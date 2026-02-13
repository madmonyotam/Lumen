import { MemoryService } from './MemoryService';

describe('MemoryService', () => {
    let service: MemoryService;

    beforeEach(() => {
        service = new MemoryService();
    });

    test('should store a memory and return it', async () => {
        const memory = await service.storeMemory('Test memory', { mood: 'happy' });
        expect(memory.content).toBe('Test memory');
        expect(memory.metadata.mood).toBe('happy');
        expect(memory.id).toBeDefined();
    });

    test('should retrieve stored memories', async () => {
        await service.storeMemory('Memory 1');
        await service.storeMemory('Memory 2');

        const memories = await service.retrieveMemories('query', 5);
        expect(memories.length).toBe(2);
        // Should be reversed (LIFO-ish in mock)
        expect(memories[0].content).toBe('Memory 2');
        expect(memories[1].content).toBe('Memory 1');
    });
});
