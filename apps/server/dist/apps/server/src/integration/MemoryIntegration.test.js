"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MemoryService_1 = require("../cortex/MemoryService");
describe('MemoryService Integration', () => {
    let memoryService;
    beforeAll(async () => {
        memoryService = new MemoryService_1.MemoryService();
        // Wait for schema initialization if necessary
        // In a real integration test, we might use a test DB.
    });
    afterAll(async () => {
        // Cleanup connections
    });
    it('should store and retrieve memories via semantic search', async () => {
        const content = "The organism feels a strange vibration in its core.";
        const metadata = { type: 'test' };
        const stored = await memoryService.storeMemory('test_user', 'test_lumen', content, metadata, 1.0, 1.0);
        expect(stored.content).toBe(content);
        expect(stored.id).not.toBe("error");
        const retrieved = await memoryService.findSimilarMemories('test_user', "core vibration", 1);
        expect(retrieved.length).toBeGreaterThan(0);
        expect(retrieved[0].content).toBe(content);
    });
    it('should handle memory decay', async () => {
        const content = "Fading trace of a past life.";
        await memoryService.storeMemory('test_user', 'test_lumen', content, {}, 0.5, 0.5);
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
        await memoryService.storeMemory('test_user', 'test_lumen', content, {}, 0.1, 0.05); // Already at threshold
        await memoryService.decayMemories('test_user', 1.0, 0.1); // Small decay to trigger pruning
        const retrieved = await memoryService.findSimilarMemories('test_user', content, 10);
        const match = retrieved.find(m => m.content === content);
        expect(match).toBeUndefined();
    });
});
