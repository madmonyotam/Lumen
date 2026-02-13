export interface Memory {
    id: string;
    content: string;
    timestamp: number;
    strength: number; // 0.0 - 1.0
    embedding?: number[];
    metadata?: any;
}

export class MemoryService {
    private memories: Memory[] = [];

    async storeMemory(content: string, metadata: any = {}): Promise<Memory> {
        const memory: Memory = {
            id: Math.random().toString(36).substring(7),
            content,
            timestamp: Date.now(),
            strength: 1.0,
            metadata
        };
        this.memories.push(memory);
        console.log(`[MemoryService] Stored: "${content}"`);
        return memory;
    }

    async retrieveMemories(query: string, limit: number = 5): Promise<Memory[]> {
        // Mock retrieval: just return the most recent ones for now
        // In real impl, this would use vector similarity
        console.log(`[MemoryService] Retrieving for query: "${query}"`);
        return this.memories.slice(-limit).reverse();
    }

    // Decay mechanism placeholder
    decayMemories() {
        this.memories = this.memories.map(m => ({
            ...m,
            strength: m.strength * 0.99 // Simple decay
        })).filter(m => m.strength > 0.1); // Prune weak memories
    }
}
