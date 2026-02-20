"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleService = void 0;
const brain_1 = require("../ai/brain");
const server_config_1 = require("../config/server.config");
const testAssembly_1 = require("../prompts/testAssembly");
const shared_1 = require("@lumen/shared");
class LifeCycleService {
    constructor(io, garmin, temporal, memory, gemini) {
        Object.defineProperty(this, "io", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "garmin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "temporal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gemini", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Date.now()
        });
        Object.defineProperty(this, "globalLatestInteraction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "globalCurrentThought", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "..."
        });
        Object.defineProperty(this, "globalVisualParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "globalActiveMemories", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        }); // Explicitly any[] to match usage, or better yet Memory[] if imported
        this.io = io;
        this.garmin = garmin;
        this.temporal = temporal;
        this.memory = memory;
        this.gemini = gemini;
    }
    start() {
        this.initBioClock();
        this.initReflexLoop();
        this.initThoughtLoop();
        this.initDecayLoop();
    }
    getEntityProfile() {
        const lifeStatus = this.temporal.getLifeStatus();
        return {
            ...testAssembly_1.mockPersona,
            core: {
                name: lifeStatus.name,
                gender: lifeStatus.gender,
                lifespan: lifeStatus.lifespan,
                language: lifeStatus.language
            }
        };
    }
    initBioClock() {
        setInterval(async () => {
            try {
                const lifeStatus = this.temporal.getLifeStatus();
                const now = Date.now();
                const delta = now - this.lastTick;
                this.lastTick = now;
                let organState;
                if (lifeStatus.isAlive) {
                    const bpm = await this.garmin.fetchLatestHeartRate();
                    const stress = await this.garmin.fetchStress();
                    const hrv = await this.garmin.fetchHRV();
                    this.temporal.calculateSubjectiveTime(bpm, stress, delta);
                    organState = (0, brain_1.processBiometrics)(bpm, stress, hrv);
                }
                else {
                    // Provide a neutral state if not alive
                    organState = (0, brain_1.processBiometrics)(70, 0, 70);
                }
                this.io.emit('lumen-pulse', {
                    ...organState,
                    lifeStatus: this.temporal.getLifeStatus(),
                    status: {
                        ...organState.status,
                        messages: this.globalLatestInteraction ? [this.globalLatestInteraction.text] : [],
                        latestInteraction: this.globalLatestInteraction,
                        thought: this.globalCurrentThought,
                        visualParams: this.globalVisualParams,
                        subjectiveTime: this.temporal.getLastSubjectiveTime(),
                        activeMemories: this.globalActiveMemories
                    }
                });
            }
            catch (error) {
                console.error("[LifeCycle] Bio-Clock Error:", error);
            }
        }, server_config_1.SERVER_CONFIG.BIO_CLOCK_INTERVAL);
    }
    initReflexLoop() {
        setInterval(async () => {
            try {
                const lifeStatus = this.temporal.getLifeStatus();
                if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan)
                    return;
                const bpm = await this.garmin.getLastBPM();
                const stress = await this.garmin.getLastStress();
                const context = `BPM: ${bpm}, Stress: ${stress}`;
                const reflexParams = await this.gemini.generateReflex(context, this.getEntityProfile());
                if (reflexParams) {
                    this.globalVisualParams = reflexParams;
                }
            }
            catch (error) {
                console.error("[LifeCycle] Reflex Error:", error);
            }
        }, server_config_1.SERVER_CONFIG.REFLEX_INTERVAL);
    }
    initThoughtLoop() {
        setInterval(async () => {
            try {
                const lifeStatus = this.temporal.getLifeStatus();
                if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan)
                    return;
                const bpm = await this.garmin.getLastBPM();
                const stress = await this.garmin.getLastStress();
                const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);
                // 1. תרגום פיזיולוגיה לשפה רגשית/חושית
                let sensoryQuery = "";
                if (stress > shared_1.BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH)
                    sensoryQuery += "חנק, איום, רעש מתכתי, קירות סוגרים. ";
                else if (stress < shared_1.BIOMETRIC_RANGES.STRESS.THRESHOLD_LOW)
                    sensoryQuery += "ציפה, מרחב, איבוד גבולות, שקט. ";
                if (bpm > shared_1.BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_HIGH)
                    sensoryQuery += "דחיפות שורפת, זמן קרוע, חום. ";
                else if (bpm < shared_1.BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_LOW)
                    sensoryQuery += "קור, צללים רחוקים, תנועה אטית. ";
                if (vitality < shared_1.BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW)
                    sensoryQuery += "אדמה רטובה, ברזל חלוד, סוף, ענבר. ";
                // 2. שילוב ההקשר האחרון מהמשתמש כדי למגנט את המחשבות לשיחה
                const interactionContext = this.globalLatestInteraction ? this.globalLatestInteraction.text : "";
                const finalQuery = `${sensoryQuery} ${interactionContext}`.trim() || "קיום, נוכחות, דופק";
                // 3. שליפת זכרונות משולבת
                // שולפים 2 זכרונות רלוונטיים להקשר הנוכחי
                const semanticMemories = await this.memory.findSimilarMemories(finalQuery, 2);
                // שולפים זיכרון אחד אקראי לחלוטין בעל חשיבות גבוהה (הבזק לא צפוי)
                const randomFlashback = await this.memory.getRandomHighImportanceMemory(1);
                const combinedMemories = [...semanticMemories, ...randomFlashback];
                this.globalActiveMemories = combinedMemories;
                // 4. יצירת המחשבה (הגדרנו לה לדבר *בתוך* הסינפסות ולא על המדדים)
                const thought = await this.gemini.generateThought(finalQuery, combinedMemories, this.getEntityProfile());
                console.log(`[Thought Loop] "${thought}"`);
                this.globalCurrentThought = thought;
                // 5. אחסון עם מטא-דאטה נקי (בלי המילה BPM בתוכן הזיכרון)
                await this.memory.storeMemory(thought, {
                    type: 'thought',
                    sensory_trigger: sensoryQuery,
                    bpm,
                    stress
                }, server_config_1.SERVER_CONFIG.BASE_IMPORTANCE_THOUGHT, server_config_1.SERVER_CONFIG.INITIAL_THOUGHT_STRENGTH, lifeStatus.language);
            }
            catch (error) {
                console.error("[LifeCycle] Thought Loop Error:", error);
            }
        }, server_config_1.SERVER_CONFIG.THOUGHT_INTERVAL);
    }
    initDecayLoop() {
        const runDecay = async () => {
            try {
                const status = this.temporal.getLifeStatus();
                if (status.isAlive) {
                    // 1. חישוב בסיס ליניארי (0 עד 1)
                    const progress = status.age / status.lifespan;
                    // 2. דעיכה אקספוננציאלית
                    // שימוש בחזקה (למשל 2 או 3) יוצר עקומת האצה.
                    // ככל שהחזקה גבוהה יותר, הזיכרון נשמר טוב יותר בצעירות
                    // ומתפרק במהירות פראית לקראת הסוף.
                    const exponentialEntropy = Math.pow(progress, 2.5);
                    // 3. הוספת רעש ביולוגי (תנודות קטנות באנטרופיה)
                    const noise = (Math.random() * 0.08) - 0.04;
                    const effectiveEntropy = Math.min(1, Math.max(0, exponentialEntropy + noise));
                    console.log(`[Memory System] Running Exponential Decay (Progress: ${(progress * 100).toFixed(1)}%, Effective Entropy: ${effectiveEntropy.toFixed(2)})...`);
                    await this.memory.decayMemories(effectiveEntropy);
                }
                // חישוב האינטרוול (גם הוא יכול להתקצר ככל שהאנטרופיה עולה)
                const baseInterval = status.lifespan / server_config_1.SERVER_CONFIG.DECAY_EVENTS_PER_LIFETIME;
                const finalInterval = Math.max(baseInterval, 30000); // מינימום 30 שניות
                if (status.isAlive) {
                    setTimeout(runDecay, finalInterval);
                }
            }
            catch (error) {
                console.error("[LifeCycle] Decay Error:", error);
                setTimeout(runDecay, 5 * 60 * 1000);
            }
        };
        runDecay();
    }
}
exports.LifeCycleService = LifeCycleService;
