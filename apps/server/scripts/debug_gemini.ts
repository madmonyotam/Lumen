import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Try loading from current directory
console.log(`CWD: ${process.cwd()}`);
dotenv.config();
console.log(`GEMINI_API_KEY present:`, !!process.env.GEMINI_API_KEY);

const logPath = path.resolve('debug_log.txt');
const log = (msg: string) => {
    console.log(msg); // Also log to console
    fs.appendFileSync(logPath, msg + '\r\n');
};

async function test() {
    fs.writeFileSync(logPath, 'Starting Debug...\r\n');

    if (!process.env.GEMINI_API_KEY) {
        log("No API Key found.");
        return;
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = ["gemini-flash-latest", "gemini-2.0-flash-lite-001"];
    const embeddingModelName = "gemini-embedding-001";

    // Test text generation
    for (const modelName of models) {
        log(`\r\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            log(`✅ Success with ${modelName}`);
            log("Response: " + result.response.text());
        } catch (e: any) {
            log(`❌ Failed with ${modelName}: ${e.message}`);
        }
    }

    // Test embedding
    log(`\r\nTesting embedding: ${embeddingModelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: embeddingModelName });
        const result = await model.embedContent("Hello");
        log(`✅ Success with ${embeddingModelName}`);
        log(`Embedding length: ${result.embedding.values.length}`);
    } catch (e: any) {
        log(`❌ Failed with ${embeddingModelName}: ${e.message}`);
    }
    // Try listing models via REST
    log("\nListing available models via REST:");
    try {
        // Use global fetch (Node 18+)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        if (!response.ok) {
            log(`❌ ListModels failed: ${response.status} ${response.statusText}`);
            const body = await response.text();
            log(`Body: ${body}`);
        } else {
            const data: any = await response.json();
            if (data.models) {
                log(`✅ Available Models:`);
                data.models.forEach((m: any) => log(` - ${m.name}`));
            } else {
                log(`⚠️ No models found in response.`);
            }
        }
    } catch (e: any) {
        log(`❌ REST Request Failed: ${e.message}`);
    }
}

test().catch(console.error);
