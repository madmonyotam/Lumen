import { MemoryService } from './MemoryService';
import { Pool } from 'pg';

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
    let service: MemoryService;
    let pool: any;

    beforeEach(() => {
        service = new MemoryService();
        // Access the mocked pool instance
        pool = (Pool as unknown as jest.Mock).mock.results[0].value;
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

        const memories = await service.getRandomHighImportanceMemory('test_user', 2);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT id, content, timestamp, strength, importance, metadata, keywords'),
            [2, 'test_user']
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('FROM memories'),
            [2, 'test_user']
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('WHERE importance >= 0.8 AND user_id = $2'),
            [2, 'test_user']
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('ORDER BY RANDOM()'),
            [2, 'test_user']
        );

        expect(memories).toHaveLength(2);
        expect(memories[0].id).toBe('1');
        expect(memories[1].importance).toBe(0.85);
    });
});
