import { GarminService } from '../src/services/garmin/GarminService';
import { MemoryService } from '../src/cortex/MemoryService';
import * as dotenv from 'dotenv';

dotenv.config();

async function runTest() {
    console.log("=== Sprint 2 Verification Script ===");

    // 1. Bio-Mimicry Test
    console.log("\n[1] Testing Bio-Mimicry Engine...");
    const garmin = new GarminService();
    await garmin.connect();

    console.log("Capturing 5 ticks of Bio-Data:");
    for (let i = 0; i < 5; i++) {
        const bpm = await garmin.fetchLatestHeartRate();
        const stress = await garmin.fetchStress();
        const hrv = await garmin.fetchHRV();
        console.log(`   Tick ${i + 1}: BPM=${bpm.toFixed(2)} | Stress=${stress.toFixed(2)} | HRV=${hrv.toFixed(2)}`);
    }

    // 2. Memory Persistence Test
    console.log("\n[2] Testing Synaptic Memory (pgvector)...");
    const memory = new MemoryService();

    // Give DB connection a moment
    await new Promise(r => setTimeout(r, 1000));

    const testContent = `Verification Test Memory ${Date.now()}: The organism feels alive.`;
    console.log(`   Storing: "${testContent}"`);

    try {
        const saved = await memory.storeMemory(testContent, { test: true });
        console.log(`   ✅ Saved Memory ID: ${saved.id}`);

        console.log(`   Retrieving similar memories...`);
        const retrieved = await memory.retrieveMemories("organism alive", 1);

        if (retrieved.length > 0 && retrieved[0].content === testContent) {
            console.log(`   ✅ Verification Success: Retrieved correct memory.`);
            console.log(`      Content: ${retrieved[0].content}`);
            console.log(`      Distance/Score: ${(retrieved as any).distance || 'N/A'}`);
        } else {
            console.warn(`   ⚠️ Retrieval Mismatch or Empty.`);
            console.log(retrieved);
        }
    } catch (e) {
        console.error("   ❌ Memory Test Failed:", e);
    }

    console.log("\n=== Test Complete ===");
    process.exit(0);
}

runTest();
