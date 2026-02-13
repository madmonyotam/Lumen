"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const pg_1 = require("pg");
const GeminiService_1 = require("../services/ai/GeminiService");
class MemoryService {
    constructor() {
        Object.defineProperty(this, "pool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gemini", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen'
        });
        this.gemini = new GeminiService_1.GeminiService();
        this.ensureSchema();
    }
    async ensureSchema() {
        try {
            const client = await this.pool.connect();
            await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
            await client.query(`
                CREATE TABLE IF NOT EXISTS memories (
                    id SERIAL PRIMARY KEY,
                    content TEXT,
                    timestamp BIGINT,
                    strength FLOAT,
                    metadata JSONB,
                    embedding vector(3072)
                );
            `);
            client.release();
            console.log("[MemoryService] Schema ensured (pgvector).");
        }
        catch (err) {
            console.error("[MemoryService] DB Init Error:", err);
        }
    }
    async storeMemory(content, metadata = {}) {
        const embedding = await this.gemini.generateEmbedding(content);
        const timestamp = Date.now();
        const strength = 1.0;
        try {
            const result = await this.pool.query(`INSERT INTO memories (content, timestamp, strength, metadata, embedding) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`, [content, timestamp, strength, metadata, JSON.stringify(embedding)] // pg package handles array -> vector string usually, but explicit stringify might be safer if using raw sql
            // Actually node-postgres-vector or standard array string often works. Let's try standard array passing, pg-vector usage suggests simply passing the array if registered or string format.
            // Standard vector string format is '[1,2,3]'
            );
            console.log(`[MemoryService] Persisted: "${content}"`);
            return {
                id: result.rows[0].id.toString(),
                content,
                timestamp,
                strength,
                metadata,
                embedding
            };
        }
        catch (err) {
            console.error("[MemoryService] Store Error:", err);
            return {
                id: "error",
                content,
                timestamp,
                strength,
                metadata
            };
        }
    }
    async retrieveMemories(query, limit = 5) {
        const embedding = await this.gemini.generateEmbedding(query);
        // Convert embedding array to vector string format for SQL
        const embeddingStr = `[${embedding.join(',')}]`;
        try {
            const result = await this.pool.query(`SELECT id, content, timestamp, strength, metadata, 
                 embedding <=> $1 as distance 
                 FROM memories 
                 ORDER BY distance ASC 
                 LIMIT $2`, [embeddingStr, limit]);
            return result.rows.map(row => ({
                id: row.id.toString(),
                content: row.content,
                timestamp: parseInt(row.timestamp),
                strength: row.strength,
                metadata: row.metadata
            }));
        }
        catch (err) {
            console.error("[MemoryService] Retrieve Error:", err);
            return [];
        }
    }
    // Decay mechanism placeholder - In SQL this would be an UPDATE query reducing strength
    async decayMemories() {
        try {
            await this.pool.query(`
                UPDATE memories 
                SET strength = strength * 0.99 
                WHERE strength > 0.1
            `);
            await this.pool.query(`
                DELETE FROM memories WHERE strength <= 0.1
            `);
        }
        catch (err) {
            console.error("[MemoryService] Decay Error:", err);
        }
    }
    async wipeMemories() {
        try {
            await this.pool.query('DELETE FROM memories');
            console.log("[MemoryService] All memories wiped.");
        }
        catch (err) {
            console.error("[MemoryService] Wipe Error:", err);
        }
    }
    async checkHealth() {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            return true;
        }
        catch (e) {
            console.error("[MemoryService] Health Check Failed:", e);
            return false;
        }
    }
}
exports.MemoryService = MemoryService;
