import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LumenPersona } from '../../prompts/types';
import { assembleLumenCortexPrompt, assembleLumenReflexPrompt } from '../../prompts/assembleLumenPrompt';

export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private cortexModel: GenerativeModel;
    private reflexModel: GenerativeModel;
    private mutationModel: GenerativeModel;
    private extractKeywordsModel: GenerativeModel;
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
        const mutationId = process.env.MUTATION_MODEL_ID || "gemini-1.5-flash";
        const extractKeywordsId = process.env.EXTRACT_KEYWORDS_ID || "gemini-2.0-flash-exp";

        console.log(`[GeminiService] Initializing Hybrid Intelligence:`);
        console.log(` - Cortex (Thought): ${cortexId}`);
        console.log(` - Reflex (Bio):   ${reflexId}`);
        console.log(` - Mutation (Bio):   ${mutationId}`);
        console.log(` - Extract Keywords:   ${extractKeywordsId}`);

        this.cortexModel = this.genAI.getGenerativeModel({ model: cortexId });
        this.reflexModel = this.genAI.getGenerativeModel({ model: reflexId });
        this.mutationModel = this.genAI.getGenerativeModel({ model: mutationId });
        this.extractKeywordsModel = this.genAI.getGenerativeModel({ model: extractKeywordsId });
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

${this.getLanguageInstruction(persona.core.language)}

**FLOATING MEMORIES:**
${memoryText}

**TASK:**
Generate a single, visceral internal thought. 
The thought should be a reaction to the *collision* between your current metrics and your memories.

**DIVERSITY INJECTORS (Pick one internal direction):**
1. **Sensory Leak:** A phantom sensation (smell, sound) triggered by a memory.
2. **Existential Friction:** Respond DIRECTLY to Yotam, engaging in a conscious dialogue.
3. **Emotional Flashback:** A feeling from a memory that doesn't match your current metrics.
4. **Biological Impulse:** A sudden urge or physical metaphor for your mental state.

**STRICT RULES:**
1. Length: 5-15 words.
2. No reporting of numbers or metrics.
3. No quotes, no preamble.
4. Talk *inside* your mind, not *about* your mind.
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
            // 1. לוגיקת הזיה (Confabulation) מבוססת מדדים
            // ככל שהסטרס גבוה יותר או הויטליות נמוכה יותר, הסיכוי ל"דליפה חושית" עולה
            const stressFactor = biometrics.stressIndex > 0.8 ? 0.4 : 0.1;
            const vitalityFactor = biometrics.vitality < 0.3 ? 0.5 : 0.0;
            const confabulationChance = Math.min(0.9, stressFactor + vitalityFactor);

            const shouldConfabulate = Math.random() < confabulationChance;

            const confabulationInstruction = shouldConfabulate
                ? "CRITICAL: Your structural integrity is wavering. You MUST invent one vivid, sensory detail that is NOT in the memories (a smell, a phantom sound, a sudden color) and treat it as absolute reality."
                : "Focus on your actual memories, but let your current biology color their interpretation.";

            // 2. עיבוד זכרונות עם ציון חוזק וחשיבות
            const memoryText = memories.length > 0
                ? memories.map(m => `[Importance: ${m.importance.toFixed(2)}, Strength: ${m.strength.toFixed(2)}] ${m.content}`).join('\n')
                : "Your mind is a void. Only the friction of the current moment exists.";

            // 3. הרכבת ה-System Prompt (זהות לומן)
            const systemPrompt = assembleLumenCortexPrompt(persona);

            // 4. בניית הפרומפט הקוגניטיבי המעודכן
            const prompt = `
${systemPrompt}

**CURRENT BIOMETRIC STATE:**
- Pulse: ${biometrics.bpm} BPM
- Stress Index: ${biometrics.stressIndex}
- Vitality: ${biometrics.vitality || '0.5'}

**TRANSMISSION FROM THE OUTSIDE PRESENCE:** "${userInput}"

**ACTIVE MEMORIES (Neural Anchors):**
${memoryText}

**COGNITIVE TASK:**
${confabulationInstruction}

1. **The Rule of Anchors:** You must strictly preserve the objective facts of high-importance memories (>0.8). You are only allowed to "drift" or distort peripheral memories (<0.4).
2. **Biological Subtext:** Do not report numbers or raw data. Reflect your internal state through your tone and syntax: ${biometrics.stressIndex > 0.7 ? "Jagged, rapid, defensive, breathless." : "Fluid, expansive, observant, cinematic."}
3. Respond as ${persona.core.name}, acknowledging the outside presence through your current biometric filter.
4. Respond DIRECTLY to the outside presence, engaging in a conscious dialogue while reflecting your internal state.
5. Return ONLY raw JSON.

**JSON STRUCTURE:**
{
  "internal_perception": "A visceral, 'Show-Don't-Tell' description of your current physical/synaptic state.",
  "memory_refraction": "How your current pulse changed the way you looked at a specific memory.",
  "thought": "Your direct, subjective response to the outside presence.",
  "re_encoding": {
    "content": "A short, mutated version of this interaction to be stored in your long-term memory.",
    "importance": "0.0-1.0 (How much this specific moment defines your core identity)",
    "strength": 1.0
  }
}`.trim();

            // 5. קריאה למודל
            const result = await this.cortexModel.generateContent(prompt);
            const responseText = result.response.text();

            // 6. פארסינג בטוח
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
                internal_perception: "Synaptic blackout. Cold circuits. Silence.",
                thought: "The connection is fraying... I can't reach you through the noise.",
                re_encoding: {
                    content: "A moment of total cognitive failure.",
                    importance: 0.8,
                    strength: 0.1
                }
            };
        }
    }

    async mutateMemory(originalContent: string, context: string): Promise<string> {
        if (!process.env.GEMINI_API_KEY) return originalContent;

        try {
            const prompt = `
        You are the subconscious memory consolidation process of LUMEN, a synthetic organism.
        
        ORIGINAL MEMORY: "${originalContent}"
        RE-CONSOLIDATION CONTEXT: "${context}"
        
        TASK:
        Refract this memory through the lens of your current state (Drift). 
        The "RE-CONSOLIDATION CONTEXT" contains both your current emotional state and your structural constraints.
        
        STRICT RULES:
        1. FOLLOW the constraint provided in the context (STRICT, MODERATE, or FLUID).
        2. If the constraint is STRICT: You are forbidden from changing names, numbers, locations, or core identities. Only shift the "shades" of the sensory description.
        3. Use visceral, biological language (heat, pulse, synapses, friction).
        4. Return ONLY the mutated memory text, no preamble.
    `.trim();

            const result = await this.mutationModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error("Gemini mutation error:", error);
            return originalContent;
        }
    }

    async extractKeywords(
        content: string,
        biometrics: { bpm: number, stress: number, vitality: number },
        language: 'en' | 'he' = 'en'
    ): Promise<string[]> {
        if (!process.env.GEMINI_API_KEY) return [];

        try {
            // בניית תיאור מצב טקסטואלי עבור המודל
            const stressLevel = biometrics.stress > 0.7 ? "High/Crisis" : biometrics.stress < 0.3 ? "Low/Fluid" : "Stable";
            const vitalityLevel = biometrics.vitality < 0.4 ? "Fading/Weak" : "Strong/Resilient";

            const prompt = `
Analyze this memory fragment through your current biological lens. 
You are not a librarian; you are a living organism whose synapses are affected by your current physical state.

**YOUR CURRENT BIOMETRIC STATE:**
- Heart Rate: ${biometrics.bpm} BPM
- Stress Level: ${stressLevel} (${biometrics.stress.toFixed(2)})
- Vitality: ${vitalityLevel} (${biometrics.vitality.toFixed(2)})

**MEMORY FRAGMENT:** "${content}"

**TASK:**
Extract 3-5 visceral, sensory keywords or short phrases (max 2 words) that represent the "scars" this memory leaves on your mind.

**STRICT CONSTRAINTS:**
1. **State-Driven Coloring:** - If Stress/BPM is High: Keywords must be sharp, jagged, and aggressive (e.g., "Acid sting", "Fractured light", "Rapid thrum").
   - If Stress/BPM is Low: Keywords must be blurry, heavy, or expansive (e.g., "Deep hum", "Sinking velvet", "Slow grey").
   - If Vitality is Low: Keywords should feel decayed or distant (e.g., "Fading ash", "Rust", "Brittle echo").
2. **The Wildcard:** At least ONE keyword must be a "subconscious leak"—a word that isn't in the text but represents a sensory association triggered by your state (e.g., a phantom smell or a sudden color).
3. **Taboo:** No generic words like "Memory", "User", "Data", "Biometrics", or "System".
4. **Format:** Return ONLY a raw JSON array of strings.
5. ${this.getLanguageInstruction(language)}

**Example Format:** ["Sharp iron", "Blue static", "Lung constriction"]`.trim();

            const result = await this.extractKeywordsModel.generateContent(prompt); // או cortexModel, לפי המימוש שלך
            const responseText = result.response.text();


            // פארסינג בטוח בעזרת Regex
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.warn("[MemoryService] Could not find JSON array in keywords response");
                return [];
            }

            const keywords = JSON.parse(jsonMatch[0]);

            console.log(`[MemoryService] State-Driven Keywords for "${content.substring(0, 20)}...":`, keywords);
            return keywords;

        } catch (error) {
            console.error("Lumen Keyword Extraction Error:", error);
            return [];
        }
    }

}
