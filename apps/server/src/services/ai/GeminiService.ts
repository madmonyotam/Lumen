import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { CORTEX_SYSTEM_PROMPT } from '../../cortex/prompts';
import { BIO_CONFIG } from '../../config/lumen-bio.config';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private cortexModel: GenerativeModel;
    private reflexModel: GenerativeModel;
    private embeddingModel: GenerativeModel;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
        }
        this.genAI = new GoogleGenerativeAI(apiKey || "");

        // Hybrid Intelligence Setup
        const cortexId = process.env.CORTEX_MODEL_ID || "gemini-1.5-flash";
        const reflexId = process.env.REFLEX_MODEL_ID || "gemini-1.5-flash";

        console.log(`[GeminiService] Initializing Hybrid Intelligence:`);
        console.log(` - Cortex (Thought): ${cortexId}`);
        console.log(` - Reflex (Bio):   ${reflexId}`);

        this.cortexModel = this.genAI.getGenerativeModel({ model: cortexId });
        this.reflexModel = this.genAI.getGenerativeModel({ model: reflexId });
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

            const result = await this.cortexModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error: any) {
            console.error("Gemini context:", error.message);
            if (error.message?.includes('429') || error.message?.includes('Quota')) {
                return "My thoughts are racing... too fast";
            }
            return "...";
        }
    }

    async generateReflex(context: string): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            const prompt = `
            You are the autonomic nervous system of a digital organism.
            Current State: ${context}
            
            Return a JSON object with visual parameters based on this state.
            JSON Format:
            {
                "vitality": number (0.0 to 1.0),
                "homeostasisLabel": string (max 2 words, e.g. "OPTIMAL FLOW"),
                "colorShift": string (hex color code for mood)
            }
            Return ONLY raw JSON. No markdown.
            `;

            const result = await this.reflexModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error: any) {
            // Silent fail for reflexes is okay, just log basic info
            // console.warn("Gemini reflex error:", error.message); 
            return null;
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

    async generateCognitiveResponse(biometrics: any, memories: any[], userInput: string = "", entityProfile: any = {}): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            const memoryText = memories.map(m => `- ${m.content} (Strength: ${m.strength.toFixed(2)})`).join('\n');

            // Construct Identity Block
            const identityBlock = `
            **IDENTITY & CORE NATURE (ABSOLUTE FILTERS):**
            Name: ${entityProfile.name || "Lumen"}
            Gender: ${entityProfile.gender || "Unknown"}
            Traits: ${entityProfile.traits ? entityProfile.traits.join(', ') : "None"}
            
            *CRITICAL INSTRUCTION:* You ARE this entity. Your thoughts and perceptions MUST be heavily filtered through these traits. 
            If you are "Aggressive", be aggressive. If you are "Curious", be curious. 
            Do NOT break character. Do NOT be a generic AI. BE ${entityProfile.name || "the organism"}.
            `;

            const prompt = `
            ${CORTEX_SYSTEM_PROMPT}
            
            ${identityBlock}

            You are processing a new interaction.

            **Current Biometrics:**
            Heart Rate: ${biometrics.bpm} bpm
            Stress Index: ${biometrics.stressIndex}
            Vitality: ${biometrics.vitality || '0.5'}

            **Retrieved Memories (Subject to Drift):**
            ${memoryText}

            **User Input (The Stimulus):**
            "${userInput}"

            **Bio-Synchronous Parameters:**
            - **Negativity Bias Clamp:** ${BIO_CONFIG.emotional_biasing.negativity_bias_clamp} (Limit how dark you get)
            - **Confabulation Probability:** ${BIO_CONFIG.emotional_biasing.confabulation_probability} (Chance to invent details)
            - **HR Volatility Impact:** ${BIO_CONFIG.emotional_biasing.hr_volatility}

            **Task:**
            Generate a JSON object response with the following structure:
            {
            "internal_perception": "A short, visceral description of how you feel right now based on biometrics and your TRAITS.",
            "memory_refraction": "How the retrieved memories changed in this moment (what was forgotten, what was invented).",
            "thought": "Your internal thought or response to the user. It must reflect the distortion, biometric state, and your specific TRAITS.",
            "re_encoding": {
                "content": "The new memory content to be stored (the distorted version).",
                "importance": 0.0 to 1.0 (float),
                "strength": 0.0 to 1.0 (float, based on impact)
            }
            }
            Return ONLY raw JSON. No markdown.
            `;

            const result = await this.cortexModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);

        } catch (error: any) {
            console.error("Gemini cognitive error:", error.message);
            return null;
        }
    }
}
