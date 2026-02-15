import { Pool } from 'pg';
import { GeminiService } from '../services/ai/GeminiService';
import { BIO_CONFIG } from '../config/lumen-bio.config';
import { SERVER_CONFIG } from '../config/server.config';
import { Memory } from '@lumen/shared/types/index';

// export interface Memory { ... } // Removed local definition

export class MemoryService {
    private pool: Pool;
    private gemini: GeminiService;

    private initializationPromise: Promise<void>;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
        });
        this.gemini = new GeminiService();
        this.initializationPromise = this.ensureSchema();
    }

    private async ensureSchema() {
        let client;
        try {
            client = await this.pool.connect();
            console.log("[MemoryService] Connected to DB, ensuring schema...");
            await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
            await client.query(`
                CREATE TABLE IF NOT EXISTS memories (
                    id SERIAL PRIMARY KEY,
                    content TEXT,
                    timestamp BIGINT,
                    strength FLOAT,
                    importance FLOAT DEFAULT 1.0,
                    metadata JSONB,
                    embedding vector(3072),
                    keywords TEXT[]
                );
            `);
            // Attempt to add importance column if it doesn't exist (migration-ish)
            await client.query(`
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='memories' AND column_name='importance') THEN 
                        ALTER TABLE memories ADD COLUMN importance FLOAT DEFAULT 1.0; 
                    END IF;
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='memories' AND column_name='keywords') THEN 
                        ALTER TABLE memories ADD COLUMN keywords TEXT[]; 
                    END IF; 
                END $$;
            `);

            console.log("[MemoryService] Schema ensured (pgvector, memories table).");
        } catch (err) {
            console.error("[MemoryService] DB Init Error:", err);
            // Retry logic could go here, but for now we just log
        } finally {
            if (client) client.release();
        }
    }

    async storeMemory(content: string, metadata: any = {}, importance: number = 1.0, initialStrength?: number, language: 'en' | 'he' = 'en'): Promise<Memory> {
        await this.initializationPromise;
        const embedding = await this.gemini.generateEmbedding(content);
        // Extract keywords asynchronously or await? Await for now to ensure data completeness
        const keywords = await this.gemini.extractKeywords(content, language);
        const timestamp = Date.now();
        const strength = initialStrength !== undefined ? initialStrength : 1.0;

        try {
            const result = await this.pool.query(
                `INSERT INTO memories (content, timestamp, strength, importance, metadata, embedding, keywords) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [content, timestamp, strength, importance, metadata, JSON.stringify(embedding), keywords]
            );

            console.log(`[MemoryService] Persisted: "${content}" with keywords: [${keywords.join(', ')}]`);

            return {
                id: result.rows[0].id.toString(),
                content,
                timestamp,
                strength,
                importance,
                metadata,
                embedding,
                keywords
            };
        } catch (err) {
            console.error("[MemoryService] Store Error:", err);
            return {
                id: "error",
                content,
                timestamp,
                strength,
                importance,
                metadata
            };
        }
    }

    async retrieveMemories(query: string, limit: number = 5, minStrength: number = 0.0): Promise<Memory[]> {
        await this.initializationPromise;
        const embedding = await this.gemini.generateEmbedding(query);
        // Convert embedding array to vector string format for SQL
        const embeddingStr = `[${embedding.join(',')}]`;

        try {
            const result = await this.pool.query(
                `SELECT id, content, timestamp, strength, importance, metadata, keywords,
                 embedding <=> $1 as distance 
                 FROM memories 
                 WHERE strength >= $3
                 ORDER BY distance ASC 
                 LIMIT $2`,
                [embeddingStr, limit, minStrength]
            );

            // Trigger Reconsolidation (Drift) - Fire and forget
            // The act of remembering changes the memory.
            result.rows.forEach(row => {
                this.reconsolidateMemory(row.id, `Triggered by: ${query}`);
            });

            return result.rows.map(row => ({
                id: row.id.toString(),
                content: row.content,
                timestamp: parseInt(row.timestamp),
                strength: row.strength,
                importance: row.importance || 1.0,
                metadata: row.metadata,
                keywords: row.keywords || [],
                embedding: [] // We don't need embedding in retrieval usually, or we can fetch it. Interface says optional?
            }));

        } catch (err) {
            console.error("[MemoryService] Retrieve Error:", err);
            return [];
        }
    }

    async reconsolidateMemory(id: string | number, context: string) {
        try {
            // Fetch current state
            const res = await this.pool.query('SELECT content, strength FROM memories WHERE id = $1', [id]);
            if (res.rows.length === 0) return;

            const oldMemory = res.rows[0];

            // Mutate via Cortex
            const newContent = await this.gemini.mutateMemory(oldMemory.content, context);

            // Reinforcement Boost (+0.25)
            let newStrength = parseFloat(oldMemory.strength) + 0.25;
            if (newStrength > 1.0) newStrength = 1.0;

            await this.pool.query(
                'UPDATE memories SET content = $1, strength = $2 WHERE id = $3',
                [newContent, newStrength, id]
            );

            // console.log(`[MemoryService] Drifted ID ${id}: ${oldMemory.content.substring(0,20)}... -> ${newContent.substring(0,20)}...`);
        } catch (err) {
            console.error(`[MemoryService] Reconsolidation failed for ID ${id}`, err);
        }
    }

    // Alias for the spec requirement
    async findSimilarMemories(query: string, limit: number = 5): Promise<Memory[]> {
        return this.retrieveMemories(query, limit, SERVER_CONFIG.RETRIEVAL_FILTER_STRENGTH); // Use standardized filter
    }

    // Decay mechanism - Entropic Pruning
    async decayMemories(entropy: number, decayRate: number = 0.05) {
        await this.initializationPromise;
        try {
            // Formula: new_strength = current_strength * (1 - decay_rate * entropy)
            // We use a simplified SQL update.
            // Adjust decay based on entropy: higher entropy = faster decay.
            // Minimum decay factor to ensure *some* decay always happens if entropy is low.

            // Usage of Bio-Config for logic
            const effectiveDecay = decayRate * (0.1 + entropy);

            await this.pool.query(`
                UPDATE memories 
                SET strength = strength * (1 - $1)
                WHERE strength > $2
            `, [effectiveDecay, BIO_CONFIG.drift_parameters.strength_decay_threshold]);

            // Prune dead memories
            const deleteResult = await this.pool.query(`
                DELETE FROM memories WHERE strength <= 0.05
            `);

            if (deleteResult && deleteResult.rowCount != null && deleteResult.rowCount > 0) {
                console.log(`[MemoryService] Pruned ${deleteResult.rowCount} faded memories.`);
            }

        } catch (err) {
            console.error("[MemoryService] Decay Error:", err);
        }
    }

    async wipeMemories() {
        await this.initializationPromise;
        try {
            await this.pool.query('DELETE FROM memories');
            console.log("[MemoryService] All memories wiped.");
        } catch (err) {
            console.error("[MemoryService] Wipe Error:", err);
        }
    }

    async diminishMemories(factor: number) {
        await this.initializationPromise;
        try {
            await this.pool.query(`
                UPDATE memories
                SET strength = strength * $1
            `, [factor]);

            // Prune very weak memories
            const deleteResult = await this.pool.query(`
                DELETE FROM memories WHERE strength <= 0.05
            `);

            if (deleteResult && deleteResult.rowCount != null && deleteResult.rowCount > 0) {
                console.log(`[MemoryService] Pruned ${deleteResult.rowCount} faded memories after diminishing.`);
            }

            console.log(`[MemoryService] Memories diminished by factor ${factor}.`);
        } catch (err) {
            console.error("[MemoryService] Diminish Error:", err);
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            return true;
        } catch (e) {
            console.error("[MemoryService] Health Check Failed:", e);
            return false;
        }
    }
}
