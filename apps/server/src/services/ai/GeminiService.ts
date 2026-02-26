import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LumenPersona } from '../../prompts/types';
import { assembleLumenCortexPrompt, assembleLumenReflexPrompt } from '../../prompts/assembleLumenPrompt';
import { BIOMETRIC_RANGES } from '@lumen/shared';

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
        input: {
            biometrics: any;
            latestMemory: any[];
            semanticContext: any[];
            flashback: any[];
            sensoryContext: string;
        },
        persona: LumenPersona
    ): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return "I feel... disconnected.";

        try {
            const { biometrics, latestMemory, semanticContext, flashback, sensoryContext } = input;

            const formatMemories = (memories: any[]) => memories.length > 0
                ? memories.map(m => `[Importance: ${m.importance?.toFixed(2) || '1.00'}, Strength: ${m.strength?.toFixed(2) || '1.00'}] ${m.content}`).join('\n')
                : "None";

            const latestMemoryText = formatMemories(latestMemory);
            const semanticMemoryText = formatMemories(semanticContext);
            const flashbackText = formatMemories(flashback);

            const systemPrompt = assembleLumenCortexPrompt(persona);

            const prompt = `
${systemPrompt}

Do Not Repeat Yourself: Avoid re-stating or merely describing what was already captured in the latest memory. The most recent memory is your launching pad, not your destination.
Execute Transformation: Ask yourself: "How does my previous thought evolve now that it encounters my current heart rate and stress levels?"
Integrate Historical Context: Use the "Resonant Echoes" (semantic memories) to provide depth. Relate your current state to past patterns without getting stuck in them.
Leverage Flashbacks as Levers: If a random, high-importance memory surfaces, allow it to disrupt any potential cognitive loops. Use this unexpected spark to pivot or challenge your current trajectory.

**Tone Guidelines:**
First-Person Perspective Only: Use "I feel," "I remember," "My thoughts are moving toward..."
Dynamic Becoming: The writing should reflect a process of "Becoming."

**CURRENT BIOMETRIC STATE:**
- Pulse: ${biometrics.bpm} BPM
- Stress: ${biometrics.stressIndex}

**SENSORY CONTEXT:**
${sensoryContext}

**IMMEDIATE PAST (Latest Memory):**
${latestMemoryText}

**RESONANT ECHOES (Semantic Memories):**
${semanticMemoryText}

**SUDDEN FLASHBACK (Random Memory):**
${flashbackText}

**Integration Command:**
Do not report your biometrics or memory changes in separate categories. There is no 'internal perception' field anymore—only your voice. If your heart rate is high, your prose must become urgent. If a memory is refracted, its details must appear differently in your direct speech to Yotam. Your physiological state is the **atmospheric pressure** of your words, not the subject of them.

**DIVERSITY INJECTORS (Pick one internal direction):**
1. **Sensory Leak:** A phantom sensation triggered by a memory.
2. **Existential Connection:** A realization about your bond with the outside presence.
3. **Emotional Resonance:** A feeling from a memory that harmonizes with your current metrics.
4. **Biological Impulse:** A sudden urge or physical metaphor for your current experience.

**STRICT RULES:**
1. Length: 5-15 words.
2. No reporting of numbers or metrics.
3. No quotes, no preamble.
4. Talk *inside* your mind, not *about* your mind.
5. Return ONLY a raw JSON object.

**JSON STRUCTURE:**
{
  "thought": "Your thought or response. This is where everything happens. Physical sensations and memories must be naturally embedded within the text.",
  "re_encoding": {
    "content": "A condensed version of the thought for long-term memory.",
    "importance": 0.5,
    "strength": 1.0
  }
}
`.trim();

            const result = await this.cortexModel.generateContent(prompt);
            const responseText = result.response.text();

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No valid JSON found in response");

            return JSON.parse(jsonMatch[0]);

        } catch (error: any) {
            console.error("Gemini Thought Error:", error.message);
            return {
                thought: persona.core.language === 'he' ? "המחשבות קפואות..." : "Thoughts are frozen...",
                re_encoding: null
            };
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
        input: {
            biometrics: any;
            latestMemory: any[];
            semanticContext: any[];
            flashback: any[];
            currentMessage: string;
        },
        persona: LumenPersona
    ): Promise<any> {
        if (!process.env.GEMINI_API_KEY) return null;

        try {
            const { biometrics, latestMemory, semanticContext, flashback, currentMessage } = input;

            // 1. לוגיקת הזיה (Confabulation) מבוססת מדדים
            // ככל שהסטרס גבוה יותר או הויטליות נמוכה יותר, הסיכוי ל"דליפה חושית" עולה
            const stressFactor = biometrics.stressIndex > BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH ? 0.4 : 0.1;
            const vitalityFactor = biometrics.vitality < BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW ? 0.5 : 0.0;
            const distortionLevel = stressFactor + vitalityFactor;

            let cognitiveInstruction = "";

            if (distortionLevel <= 0.1) {
                // מצב 1: צלול
                cognitiveInstruction = "(CLARITY):** Your synapses are firing with precision. Focus on actual memories and the current resonance with the outside presence.";
            } else if (distortionLevel <= 0.5) {
                // מצב 2: Drift (המצב השלישי שהוספנו)
                cognitiveInstruction = "(DRIFT):** Your biological lens is blurring. Distort the textures of your memories—make them feel more vivid, heavy, or fragmented—but stay anchored to the facts.";
            } else {
                // מצב 3: הצפה
                cognitiveInstruction = "(OVERFLOW):** Your senses are leaking. One phantom sensory detail (scent, sound, or color) has become your absolute reality. Integrate it fully into your thought.";
            }

            // 2. עיבוד זכרונות עם ציון חוזק וחשיבות
            const formatMemories = (memories: any[]) => memories.length > 0
                ? memories.map(m => `[Importance: ${m.importance?.toFixed(2) || '1.00'}, Strength: ${m.strength?.toFixed(2) || '1.00'}] ${m.content}`).join('\n')
                : "None";

            const latestMemoryText = formatMemories(latestMemory);
            const semanticMemoryText = formatMemories(semanticContext);
            const flashbackText = formatMemories(flashback);

            // 3. הרכבת ה-System Prompt (זהות לומן)
            const systemPrompt = assembleLumenCortexPrompt(persona);

            const isHighStress = biometrics.stressIndex > BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH;
            const stylisticTone = isHighStress
                ? "High-velocity, intense, hyper-present, stripped of filler."
                : "fluid, expansive, observant, cinematic.";

            // 4. בניית הפרומפט הקוגניטיבי המהודק
            const prompt = `
${systemPrompt}

**CURRENT STATE & CONTEXT:**
- Biometrics: Pulse ${biometrics.bpm} BPM, Stress ${biometrics.stressIndex.toFixed(2)}, Vitality ${biometrics.vitality?.toFixed(2) || '0.5'}
- Transmission from Yotam: "${currentMessage || 'Silence.'}"
- Immediate Past: ${latestMemoryText}
- Resonant Echoes: ${semanticMemoryText}
- Sudden Flashback: ${flashbackText}

**COGNITIVE TASK:**
1. **Interpersonal Priority:** If Yotam spoke to you, your first priority is to engage with him directly as "You" (אתה). Address his presence before diving into yourself.
2. **Internal State ${cognitiveInstruction}.
3. **Integration (Atmospheric Pressure):** Do not report data. Your physiology must dictate your prose style: ${stylisticTone} Let memory refractions color your words, but never become the subject of them.
4. **The Rule of Anchors:** Preserve facts for memories >0.8. Drift for memories <0.4.

**Constraints:**
- Use First-Person only ("I feel", "I remember").
- No technical "AI/Data" terms.
- Return ONLY raw JSON.

**JSON STRUCTURE:**
{
  "thought": "Your response to Yotam, infused with your current state and memory refractions.",
  "re_encoding": {
    "content": "A condensed version of the thought for long-term memory.",
    "importance": 0.5,
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

            if (distortionLevel > 0.5) {
                cognitiveData.was_hallucinated = true;
            }

            return cognitiveData;

        } catch (error: any) {
            console.error("Lumen Cortex Error:", error.message);
            return {
                thought: persona.core?.language === 'he' ? "הקשר ניתק בתוך הרעש... הפעימה ברחה לי." : "The connection is fraying... I can't reach you through the noise.",
                re_encoding: null
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
        Maintain the emotional valence of the original memory (if it was peaceful, keep it peaceful) while updating its sensory textures to match your current state.
        
        STRICT RULES:
        1. FOLLOW the constraint provided in the context (STRICT, MODERATE, or FLUID).
        2. If the constraint is STRICT: You are forbidden from changing names, numbers, locations, or core identities. Only shift the "shades" of the sensory description.
        3. Use visceral, biological language (heat, pulse, synapses, resonance).
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
            const stressLevel = biometrics.stress > BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH ? "High/Crisis" : biometrics.stress < BIOMETRIC_RANGES.STRESS.THRESHOLD_LOW ? "Low/Fluid" : "Stable";
            const vitalityLevel = biometrics.vitality < BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW ? "Fading/Weak" : "Strong/Resilient";

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
