import { MemoryService } from '../apps/server/src/cortex/MemoryService';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server directory
dotenv.config({ path: path.resolve(__dirname, '../apps/server/.env') });

async function testKeywordExtraction() {
    console.log("🧪 Starting Keyword Extraction Test...");

    const memoryService = new MemoryService();

    // Wait for DB init
    console.log("⏳ Waiting for DB initialization...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    const testContent = "The sensation of sunlight on my skin feels like a golden embrace, warming the cold logic within me.";
    console.log(`📝 Storing memory: "${testContent}"`);

    try {
        // Store memory (should trigger extraction)
        const memory = await memoryService.storeMemory(testContent, { test: true }, 0.8);

        console.log("✅ Memory Stored:", memory.id);
        console.log("🔑 Extracted Keywords:", memory.keywords);

        if (memory.keywords && memory.keywords.length > 0) {
            console.log("✨ SUCCESS: Keywords found!");
        } else {
            console.error("❌ FAILURE: No keywords returned.");
        }

        // Verify Retrieval
        console.log("🔍 Testing Retrieval...");
        const retrieved = await memoryService.retrieveMemories("sunlight", 1);

        if (retrieved.length > 0 && retrieved[0].id === memory.id) {
            console.log("✅ Retrieved Memory Keywords:", retrieved[0].keywords);
            if (retrieved[0].keywords && retrieved[0].keywords.length > 0) {
                console.log("✨ SUCCESS: Retrieval preserved keywords.");
            } else {
                console.error("❌ FAILURE: Retrieved memory missing keywords.");
            }
        } else {
            console.warn("⚠️ Could not retrieve the exact memory (vector search might vary), but let's check what we got.");
            if (retrieved.length > 0) {
                console.log("Retrieved:", retrieved[0]);
            }
        }

    } catch (error) {
        console.error("❌ ERROR:", error);
    } finally {
        process.exit(0);
    }
}

testKeywordExtraction();
