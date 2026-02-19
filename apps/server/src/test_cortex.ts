
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env relative to this file (src/test_cortex.ts -> ../.env)
const envPath = path.resolve(__dirname, '../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.CORTEX_MODEL_ID;

if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found!");
    process.exit(1);
}

if (!modelId) {
    console.error("❌ No CORTEX_MODEL_ID found!");
    process.exit(1);
}

console.log(`API Key: ${apiKey.substring(0, 5)}...`);
console.log(`Testing CORTEX_MODEL_ID: "${modelId}"`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelId });

async function run() {
    try {
        console.log("Sending prompt...");
        const result = await model.generateContent("Hello, are you online? Reply with 'Yes'.");
        const response = await result.response;
        console.log(`✅ Success! Response: "${response.text()}"`);
    } catch (error: any) {
        console.error("❌ Failed!");
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("StatusText:", error.response.statusText);
        }
        if (error.GoogleGenerativeAIError) {
            console.error("Details:", JSON.stringify(error, null, 2));
        }
    }
}

run();
