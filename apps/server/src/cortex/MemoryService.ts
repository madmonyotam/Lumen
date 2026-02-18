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
        const biometrics = {
            bpm: metadata.bpm || 70,
            stress: metadata.stress || 0.1,
            vitality: metadata.vitality || 0.8
        };
        const keywords = await this.gemini.extractKeywords(content, biometrics, language);
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
        const embeddingStr = `[${embedding.join(',')}]`;

        try {
            // אנחנו משלבים את המרחק הוקטורי עם החשיבות.
            // ככל שה-importance גבוה יותר, ה-distance "מתקצר" באופן מלאכותי.
            const result = await this.pool.query(
                `SELECT id, content, timestamp, strength, importance, metadata, keywords,
             (embedding <=> $1) / (0.5 + importance) as weighted_distance 
             FROM memories 
             WHERE strength >= $3
             ORDER BY weighted_distance ASC 
             LIMIT $2`,
                [embeddingStr, limit, minStrength]
            );

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

    async getRandomHighImportanceMemory(limit: number): Promise<Memory[]> {
        await this.initializationPromise;
        try {
            // Fetch memories with high importance (e.g. >= 0.8) randomly
            const result = await this.pool.query(
                `SELECT id, content, timestamp, strength, importance, metadata, keywords
                 FROM memories 
                 WHERE importance >= 0.8
                 ORDER BY RANDOM() 
                 LIMIT $1`,
                [limit]
            );

            return result.rows.map(row => ({
                id: row.id.toString(),
                content: row.content,
                timestamp: parseInt(row.timestamp),
                strength: row.strength,
                importance: row.importance,
                metadata: row.metadata,
                keywords: row.keywords || [],
                embedding: []
            }));
        } catch (err) {
            console.error("[MemoryService] Random Flashback Error:", err);
            return [];
        }
    }

    async reconsolidateMemory(id: string | number, context: string) {
        try {
            const res = await this.pool.query(
                'SELECT content, strength, importance, keywords FROM memories WHERE id = $1',
                [id]
            );
            if (res.rows.length === 0) return;

            const oldMemory = res.rows[0];
            const importance = oldMemory.importance || 1.0;

            // 1. הגדרת מגבלת המוטציה לפי חשיבות - הגנה על ה"אני"
            let mutationConstraint = "";
            if (importance > 0.8) {
                mutationConstraint = "STRICT: Anchor Memory. Do NOT change facts (names, numbers, locations). Only shift mood/texture.";
            } else if (importance > 0.4) {
                mutationConstraint = "MODERATE: Retain the core event, minor descriptive drift allowed.";
            } else {
                mutationConstraint = "FLUID: Peripheral memory. Significant drift/reimagining is encouraged.";
            }

            // 2. יצירת התוכן החדש (הסחיפה)
            const newContent = await this.gemini.mutateMemory(
                oldMemory.content,
                `Current Perspective: ${context}. Constraint: ${mutationConstraint}`
            );

            // 3. עדכון ה-Embedding - חיוני כדי שהחיפוש הסמנטי יישאר רלוונטי
            const newEmbedding = await this.gemini.generateEmbedding(newContent);
            const embeddingStr = `[${newEmbedding.join(',')}]`;

            // 4. חישוב מדדים חדשים
            let newStrength = parseFloat(oldMemory.strength) + 0.15;
            if (newStrength > 1.0) newStrength = 1.0;

            let newImportance = importance * 1.05;
            if (newImportance > 2.0) newImportance = 2.0;

            // 5. עדכון מסד הנתונים עם הכל
            await this.pool.query(
                `UPDATE memories 
             SET content = $1, strength = $2, importance = $3, embedding = $4 
             WHERE id = $5`,
                [newContent, newStrength, newImportance, embeddingStr, id]
            );

            // console.log(`[Reconsolidation] ID ${id} evolved. Importance: ${newImportance.toFixed(2)}`);

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
            const effectiveDecay = decayRate * (0.1 + entropy);

            // דעיכת חוזק (מהירה) ודעיכת חשיבות (איטית מאוד)
            // אנחנו משתמשים ב-entropy כדי לשחוק מעט גם את הדירוג של מה שחשוב
            await this.pool.query(`
            UPDATE memories 
            SET 
                strength = strength * (1 - $1),
                importance = importance * (1 - ($1 * 0.2)) 
            WHERE strength > $2
        `, [effectiveDecay, BIO_CONFIG.drift_parameters.strength_decay_threshold]);

            // ניקוי זכרונות שמתו
            const deleteResult = await this.pool.query(`
            DELETE FROM memories WHERE strength <= 0.05
        `);

            if (deleteResult?.rowCount) {
                console.log(`[Memory System] Pruned ${deleteResult.rowCount} faded memories.`);
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
