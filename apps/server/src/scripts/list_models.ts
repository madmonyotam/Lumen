// import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from apps/server
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API KEY found');
        return;
    }

    // const genAI = new GoogleGenerativeAI(apiKey);
    // @ts-ignore - modelManager might not be typed in this version or accessed differently, trying standard first
    /* 
       Actually, GoogleGenerativeAI class doesn't have listModels directly in some versions. 
       It is usually on the `GoogleGenerativeAI` instance or a static method. 
       Wait, standard way in v0.1.0+ is:
       const genAI = new GoogleGenerativeAI(API_KEY);
       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
       
       But to LIST models, we usually need the REST API or `makeRequest`.
       However, let's try to see if we can just test a few known ones.
       Actually, let's look at node_modules/@google/generative-ai to see if there is a listModels.
       
       Wait, the error message said: "Call ListModels to see the list...".
       If I cannot find it in the SDK, I will use `fetch` to the REST API.
    */

    console.log("Fetching models via REST API...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => {
                console.log(`- ${m.name} (${m.displayName}) - Supported: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.error("No models found or error:", data);
        }
    } catch (e) {
        console.error("Error fetching models:", e);
    }
}

listModels();
