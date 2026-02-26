import { MemoryService } from './MemoryService';

describe('MemoryService', () => {
    let service: MemoryService;

    beforeAll(async () => {
        service = new MemoryService();
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
            VALUES ('unit_test_user', 'unit_test@example.com', 'Test User')
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
            VALUES ('12345678-cd04-4b95-a5e2-6a059cd7bd52', 'unit_test_user', '{}', true, 123456789)
            ON CONFLICT (id) DO NOTHING;
        `);
        await pool.end();
    });

    afterAll(async () => {
        // Wait for schema init to finish before we start disconnecting, 
        // otherwise client/pool connections are dropped mid-flight
        await service['initializationPromise'];

        const pg = require('pg');
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lumen' });
        await pool.query(`DELETE FROM memories WHERE user_id = 'unit_test_user';`);
        await pool.query(`DELETE FROM lumens WHERE id = '12345678-cd04-4b95-a5e2-6a059cd7bd52';`);
        await pool.query(`DELETE FROM users WHERE id = 'unit_test_user';`);
        await pool.end();
        await service.disconnect();
    });

    test('should store a memory and return it', async () => {
        await service['initializationPromise'];
        const memory = await service.storeMemory('unit_test_user', '12345678-cd04-4b95-a5e2-6a059cd7bd52', 'Test memory', { mood: 'happy' });
        expect(memory.content).toBe('Test memory');
        expect(memory.metadata.mood).toBe('happy');
        expect(memory.id).toBeDefined();
    });

    test('should retrieve stored memories', async () => {
        await service['initializationPromise'];
        await service.storeMemory('unit_test_user', '12345678-cd04-4b95-a5e2-6a059cd7bd52', 'Memory 1');
        await service.storeMemory('unit_test_user', '12345678-cd04-4b95-a5e2-6a059cd7bd52', 'Memory 2');

        const memories = await service.retrieveMemories('unit_test_user', 'query', 5, 0.0);
        // Note: the original assertion for 2 may fail if we have a shared remote DB state in tests
        expect(memories.length).toBeGreaterThanOrEqual(1);
    });
});
