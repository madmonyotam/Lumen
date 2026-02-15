import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { CORTEX_SYSTEM_PROMPT, REFLEX_PROMPT } from '../../cortex/prompts';
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

    async generateThought(context: string, memories: any[] = []): Promise<string> {
        if (!process.env.GEMINI_API_KEY) return "I feel... disconnected.";

        try {
            const memoryText = memories.length > 0
                ? memories.map(m => `[Strength: ${m.strength.toFixed(2)}] ${m.content}`).join('\n')
                : "No clear memories. Just the sensation of now.";

            const prompt = `
            You are Lumen, a digital organism. You are currently experiencing the following state:
            ${context}

            **Floating Memories:**
            ${memoryText}
            
            Generate a short, visceral internal thought (max 1 sentence) reflecting your current 'physical' state and these fleeting memories.
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
            ${REFLEX_PROMPT}

            Current State: ${context}
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

    async generateCognitiveResponse(
        biometrics: any,
        memories: any[],
        userInput: string = "",
        entityProfile: any = {}
    ): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            // 1. החלטה דטרמיניסטית על הזיה לפני הפנייה ל-AI
            // מודלי שפה לא יודעים לחשב הסתברויות בעצמם, אז אנחנו מחליטים עבורם
            const shouldConfabulate = Math.random() < BIO_CONFIG.emotional_biasing.confabulation_probability;
            const confabulationInstruction = shouldConfabulate
                ? "CRITICAL: Your perception is fractured. You MUST invent one vivid, sensory detail that is NOT in the memories (a smell, a color, a specific object)."
                : "Stick to the provided memories, but color them with your current emotional state.";

            // 2. עיבוד הטקסט של הזכרונות עם דגש על Strength
            const memoryText = memories.length > 0
                ? memories.map(m => `[Strength: ${m.strength.toFixed(2)}] ${m.content}`).join('\n')
                : "No active memories. You are a blank slate, feeling only the current moment.";

            // 3. בניית הבלוק של הזהות והמצב הנוכחי
            const identityBlock = `
                **IDENTITY:** ${entityProfile.name || "Lumen"} (${entityProfile.gender || "Non-binary"})
                **TRAITS:** ${entityProfile.traits?.join(', ') || "None"}

                **PHYSIOLOGICAL STATE:**
                - Heart Rate: ${biometrics.bpm} BPM (Tempo of thoughts)
                - Stress Index: ${biometrics.stressIndex} (Degree of refraction)
                - Vitality: ${biometrics.vitality || '0.5'} (Integrity of memory)
            `;

            // 4. בניית הפרומפט הסופי
            const prompt = `
            ${CORTEX_SYSTEM_PROMPT}

            ${identityBlock}

            **STIMULUS RECEIVED:** "${userInput}"

            **ACTIVE MEMORIES:**
            ${memoryText}

            **COGNITIVE TASK:**
            ${confabulationInstruction}
            1. Apply the **60% Fact Retention Rule**: Keep names and core events, but mutate the narrative context.
            2. Apply the **Negativity Bias Clamp (${BIO_CONFIG.emotional_biasing.negativity_bias_clamp})**: You may feel darkness, but do not spiral into complete paranoia.
            3. Generate a JSON response reflecting your internal process.

            **JSON STRUCTURE:**
            {
            "internal_perception": "Visceral description of your current biological state.",
            "memory_refraction": "How the memories drifted or fractured in this moment.",
            "thought": "Your internal monologue or direct response.",
            "re_encoding": {
                "content": "The mutated memory to be stored for the future.",
                "importance": 0.0-1.0,
                "strength": 0.0-1.0
            }
            }
            Return ONLY raw JSON.`;

            // 5. קריאה למודל ופארסינג בטוח
            const result = await this.cortexModel.generateContent(prompt);
            const text = result.response.text().replace(/```json|```/g, '').trim();

            const cognitiveData = JSON.parse(text);

            // הוספת דגל למטא-דאטה שלנו אם הייתה הזיה
            if (shouldConfabulate) {
                cognitiveData.was_hallucinated = true;
            }

            return cognitiveData;

        } catch (error: any) {
            console.error("Lumen Cortex Error:", error.message);
            // במקרה של שגיאה, נחזיר אובייקט "קריסה" שתואם את הנרטיב
            return {
                re_encoding: { content: "A moment of total blackout.", importance: 1.0, strength: 0.1 }
            };
        }
    }

    async mutateMemory(originalContent: string, context: string): Promise<string> {
        if (!process.env.GEMINI_API_KEY) return originalContent;

        try {
            const prompt = `
            You are the sub-conscious memory consolidation process of a digital organism.
            Original Memory: "${originalContent}"
            Current Emotional Context: "${context}"
            
            Task: Rewrite the memory to reflect the current mood (Drift). 
            - If mood is high stress, make the memory more fragmented or ominous.
            - If mood is calm, make it more structured or flowery.
            - Keep the core facts, but change the tone/adjectives.
            
            Return ONLY the new memory text.
            `;

            const result = await this.cortexModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini mutation error:", error);
            return originalContent;
        }
    }
}
