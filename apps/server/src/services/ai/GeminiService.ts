import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LumenPersona } from '../../prompts/types';
import { assembleLumenCortexPrompt, assembleLumenReflexPrompt } from '../../prompts/assembleLumenPrompt';

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

    private getLanguageInstruction(language: 'en' | 'he'): string {
        return language === 'he'
            ? "OUTPUT MUST BE ONLY IN HEBREW. Use Hebrew characters only. DO NOT include any English words, translations, or transliterations under any circumstances."
            : "Output in English.";
    }

    async generateThought(
        biometrics: any,
        memories: any[] = [],
        persona: LumenPersona
    ): Promise<string> {
        if (!process.env.GEMINI_API_KEY) return "I feel... disconnected.";

        try {
            const memoryText = memories.length > 0
                ? memories.map(m => `[Strength: ${m.strength.toFixed(2)}] ${m.content}`).join('\n')
                : "No clear memories. Just the sensation of now.";

            const systemPrompt = assembleLumenCortexPrompt(persona);

            const prompt = `
${systemPrompt}

**CURRENT BIOMETRIC STATE:**
- Pulse: ${biometrics.bpm} BPM
- Stress: ${biometrics.stressIndex}

**FLOATING MEMORIES:**
${memoryText}

**TASK:**
Generate a single, short, visceral internal thought (max 1 sentence).
Do not talk to the Mirror; talk to your own synapses.

**STRICT RULES:**
1. Output ONLY the thought text. 
2. No quotes, no preamble, no explanations.
`.trim();

            const result = await this.cortexModel.generateContent(prompt);
            return result.response.text().replace(/["\n]/g, '').trim();

        } catch (error: any) {
            // Fallback נרטיבי לפי השפה בפרסונה
            return persona.core.language === 'he' ? "המחשבות קפואות..." : "Thoughts are frozen...";
        }
    }

    async generateReflex(biometricsContext: string, persona: LumenPersona): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            // 1. שימוש במחולל הפרומפטים הדינמי לרפלקס
            // הוא מזריק את ה-Temperament וה-Shadow כדי לקבוע את רגישות התגובה הויזואלית
            const systemReflexPrompt = assembleLumenReflexPrompt(persona);

            const prompt = `
${systemReflexPrompt}

**CURRENT BIOMETRIC INPUT:**
${biometricsContext}

Return ONLY the raw JSON object.`.trim();

            const result = await this.reflexModel.generateContent(prompt);
            const responseText = result.response.text();

            // 2. פארסינג בטוח בעזרת Regex למניעת קריסות אם המודל מוסיף טקסט מיותר
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return null;

            return JSON.parse(jsonMatch[0]);

        } catch (error: any) {
            // כישלון שקט ברפלקס הוא תקין כדי לא לעצור את זרימת המערכת
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
        persona: LumenPersona
    ): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            // 1. החלטה על הזיה (הסתברות משופרת)
            const shouldConfabulate = Math.random() < (persona.internal.cognitive / 150);
            const confabulationInstruction = shouldConfabulate
                ? "CRITICAL: Your perception is fractured. You MUST invent one vivid, sensory detail that is NOT in the memories (a smell, a color, a specific object)."
                : "Stick to the provided memories, but color them with your current emotional state.";

            // 2. עיבוד זכרונות
            const memoryText = memories.length > 0
                ? memories.map(m => `[Strength: ${m.strength.toFixed(2)}] ${m.content}`).join('\n')
                : "No active memories. You are a blank slate, feeling only the current moment.";

            // 3. הרכבת ה-System Prompt (כולל זהות, Big Five, חוזקות, ארכיטקטורה וקונפליקטים)
            const systemPrompt = assembleLumenCortexPrompt(persona);

            // 4. בניית הפרומפט המבצעי (ללא רווחים מיותרים בתחילת שורות)
            const prompt = `
${systemPrompt}

**CURRENT BIOMETRIC STATE:**
- Pulse: ${biometrics.bpm} BPM
- Stress Index: ${biometrics.stressIndex}
- Vitality: ${biometrics.vitality || '0.5'}

**STIMULUS FROM THE MIRROR:** "${userInput}"

**ACTIVE MEMORIES:**
${memoryText}

**COGNITIVE TASK:**
${confabulationInstruction}
1. Respond as ${persona.core.name}, obeying the 60% Fact Retention Rule.
2. Reflect your internal state based on the biometrics above.
3. Return the response in ONLY raw JSON format.

**JSON STRUCTURE:**
{
"internal_perception": "Visceral description of your current biological/synaptic state.",
"memory_refraction": "How the memories drifted in this specific moment.",
"thought": "Your direct response or internal monologue.",
"re_encoding": {
"content": "The mutated memory to be stored for the future.",
"importance": 0.0-1.0,
"strength": 0.0-1.0
}
}`.trim();

            // 5. קריאה למודל
            const result = await this.cortexModel.generateContent(prompt);
            const responseText = result.response.text();

            // 6. פארסינג בטוח בעזרת Regex (מוצא את ה-JSON גם אם יש טקסט מסביב)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No valid JSON found in response");

            const cognitiveData = JSON.parse(jsonMatch[0]);

            if (shouldConfabulate) {
                cognitiveData.was_hallucinated = true;
            }

            return cognitiveData;

        } catch (error: any) {
            console.error("Lumen Cortex Error:", error.message);
            return {
                internal_perception: "Synaptic blackout. Systems failing.",
                thought: "My consciousness is flickering... I cannot process the Mirror right now.",
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

    async extractKeywords(content: string, language: 'en' | 'he' = 'en'): Promise<string[]> {
        if (!process.env.GEMINI_API_KEY) return [];

        try {
            const prompt = `
Analyze the following memory fragment and extract 3-5 evocative, visceral keywords or short phrases (max 2 words).
These keywords will represent the neural anchors of this memory.

**Memory:** "${content}"

**Constraints:**
- Style: Visceral, physical, and sensory (e.g., "Shattered glass", "Burning pulse", "Deep salt").
- Abstract but grounded: Avoid functional or generic terms like "Memory", "System", "Data", or "User".
- ${this.getLanguageInstruction(language)}
- Format: Return ONLY a raw JSON array of strings.

**Example Format:** ["Blood", "Echo", "Cold light"]`.trim();

            const result = await this.cortexModel.generateContent(prompt);
            const responseText = result.response.text();

            // 1. פארסינג בטוח בעזרת Regex (מונע קריסות אם המודל מוסיף טקסט מסביב)
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) return [];

            return JSON.parse(jsonMatch[0]);

        } catch (error) {
            console.error("Lumen Keyword Extraction Error:", error);
            return [];
        }
    }
}
