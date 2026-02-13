import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private embeddingModel: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey || "");
        this.model = this.genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        this.embeddingModel = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    }

    async generateThought(context: string): Promise<string> {
        if (!process.env.GEMINI_API_KEY) return "I feel... disconnected.";

        try {
            const prompt = `
            You are Lumen, a digital organism. You are currently experiencing the following state:
            ${context}
            
            Generate a short, visceral internal thought (max 1 sentence) reflecting your current 'physical' state. 
            Do not be robotic. Be abstract, poetic, or primal.
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini generation error:", error);
            return "...";
        }
    }

    async generateEmbedding(text: string): Promise<number[]> {
        if (!process.env.GEMINI_API_KEY) {
            // Return zero vector if no key, just to prevent crash
            return new Array(3072).fill(0);
        }

        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error("Gemini embedding error:", error);
            return new Array(3072).fill(0);
        }
    }
}
