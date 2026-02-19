"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("./MemoryService");
const pg_1 = require("pg");
jest.mock('pg', () => {
    const mPool = {
        connect: jest.fn(),
        query: jest.fn(),
        on: jest.fn(),
        release: jest.fn(),
    };
    return { Pool: jest.fn(() => mPool) };
});
jest.mock('../services/ai/GeminiService');
describe('MemoryService Flashback Unit Test', () => {
    let service;
    let pool;
    beforeEach(() => {
        service = new MemoryService_1.MemoryService();
        // Access the mocked pool instance
        pool = pg_1.Pool.mock.results[0].value;
        pool.query.mockResolvedValue({ rows: [] }); // Default
        // Mock ensureSchema calls
        pool.connect.mockResolvedValue({
            query: jest.fn(),
            release: jest.fn()
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('getRandomHighImportanceMemory should execute correct SQL', async () => {
        await service['initializationPromise']; // Wait for init
        const mockMemories = [
            { id: '1', content: 'Mem 1', timestamp: '1000', strength: 1.0, importance: 0.9, metadata: {} },
            { id: '2', content: 'Mem 2', timestamp: '2000', strength: 1.0, importance: 0.85, metadata: {} }
        ];
        pool.query.mockResolvedValueOnce({ rows: mockMemories });
        const memories = await service.getRandomHighImportanceMemory(2);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT id, content, timestamp, strength, importance, metadata, keywords'), [2]);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('FROM memories'), [2]);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE importance >= 0.8'), [2]);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY RANDOM()'), [2]);
        expect(memories).toHaveLength(2);
        expect(memories[0].id).toBe('1');
        expect(memories[1].importance).toBe(0.85);
    });
});
