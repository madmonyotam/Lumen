import { MemoryService } from '../cortex/MemoryService';

describe('MemoryService Integration', () => {
    let memoryService: MemoryService;

    beforeAll(async () => {
        memoryService = new MemoryService();
        // Wait for schema initialization if necessary
        // In a real integration test, we might use a test DB.
        const pg = require('pg');
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen' });
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT,
                display_name TEXT,
                photo_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await pool.query(`
            INSERT INTO users (id, email, display_name)
            VALUES ('test_user', 'test@example.com', 'Test User')
            ON CONFLICT (id) DO NOTHING;
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lumens (
                id TEXT PRIMARY KEY,
                user_id TEXT REFERENCES users(id),
                state JSONB,
                is_alive BOOLEAN,
                last_updated BIGINT
            );
        `);
        await pool.query(`
            INSERT INTO lumens (id, user_id, state, is_alive, last_updated)
            VALUES ('d36a9a7c-cd04-4b95-a5e2-6a059cd7bd52', 'test_user', '{}', true, 123456789)
            ON CONFLICT (id) DO NOTHING;
        `);
        await pool.end();
    });

    afterAll(async () => {
        // Cleanup connections
        const pg = require('pg');
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen' });
        await pool.query(`DELETE FROM memories WHERE user_id = 'test_user';`);
        await pool.query(`DELETE FROM lumens WHERE id = 'd36a9a7c-cd04-4b95-a5e2-6a059cd7bd52';`);
        await pool.query(`DELETE FROM users WHERE id = 'test_user';`);
        await pool.end();
        await memoryService.disconnect();
    });

    it('should store and retrieve memories via semantic search', async () => {
        const content = "The organism feels a strange vibration in its core.";
        const metadata = { type: 'test' };

        const stored = await memoryService.storeMemory('test_user', 'd36a9a7c-cd04-4b95-a5e2-6a059cd7bd52', content, metadata, 1.0, 1.0);
        expect(stored.content).toBe(content);
        expect(stored.id).not.toBe("error");

        const retrieved = await memoryService.findSimilarMemories('test_user', "core vibration", 1);
        expect(retrieved.length).toBeGreaterThan(0);
        expect(retrieved[0].content).toBe(content);
    });

    it('should handle memory decay', async () => {
        const content = "Fading trace of a past life.";
        await memoryService.storeMemory('test_user', 'd36a9a7c-cd04-4b95-a5e2-6a059cd7bd52', content, {}, 0.5, 0.5);

        // Run decay with high entropy
        await memoryService.decayMemories('test_user', 1.0, 0.5); // 50% decay

        const retrieved = await memoryService.findSimilarMemories('test_user', content, 10);
        const match = retrieved.find(m => m.content === content);

        if (match) {
            expect(match.strength).toBeLessThan(0.5);
        }
    });

    it('should prune memories below threshold', async () => {
        const content = "Disposable thought.";
        await memoryService.storeMemory('test_user', 'd36a9a7c-cd04-4b95-a5e2-6a059cd7bd52', content, {}, 0.1, 0.05); // Already at threshold

        await memoryService.decayMemories('test_user', 1.0, 0.1); // Small decay to trigger pruning

        const retrieved = await memoryService.findSimilarMemories('test_user', content, 10);
        const match = retrieved.find(m => m.content === content);
        expect(match).toBeUndefined();
    });
});
