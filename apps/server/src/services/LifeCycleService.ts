import { Server } from 'socket.io';
import { GarminService } from './garmin/GarminService';
import { TemporalEngine } from '../engines/TemporalEngine';
import { MemoryService } from '../cortex/MemoryService';
import { GeminiService } from './ai/GeminiService';
import { processBiometrics } from '../ai/brain';
import { SERVER_CONFIG } from '../config/server.config';
import { LumenPersona } from '../prompts/types';
import { mockPersona } from '../prompts/testAssembly';
import { BIOMETRIC_RANGES } from '@lumen/shared';

export class LifeCycleService {
    private io: Server;
    private garmin: GarminService;
    private temporal: TemporalEngine;
    private memory: MemoryService;
    private gemini: GeminiService;

    private lastTick: number = Date.now();

    public globalLatestInteraction: { text: string; timestamp: number; sender: 'user' | 'lumen' } | null = null;
    public globalCurrentThought: string = "...";
    public globalVisualParams: any = {};
    public globalActiveMemories: any[] = []; // Explicitly any[] to match usage, or better yet Memory[] if imported

    constructor(
        io: Server,
        garmin: GarminService,
        temporal: TemporalEngine,
        memory: MemoryService,
        gemini: GeminiService
    ) {
        this.io = io;
        this.garmin = garmin;
        this.temporal = temporal;
        this.memory = memory;
        this.gemini = gemini;
    }

    public start() {
        this.initBioClock();
        this.initReflexLoop();
        this.initThoughtLoop();
        this.initDecayLoop();
    }

    private getEntityProfile(): LumenPersona {
        const lifeStatus = this.temporal.getLifeStatus();
        return {
            ...mockPersona,
            core: {
                name: lifeStatus.name,
                gender: lifeStatus.gender,
                lifespan: lifeStatus.lifespan,
                language: lifeStatus.language
            }
        };
    }

    private initBioClock() {
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
                    organState = processBiometrics(bpm, stress, hrv);
                } else {
                    // Provide a neutral state if not alive
                    organState = processBiometrics(70, 0, 70);
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
            } catch (error) {
                console.error("[LifeCycle] Bio-Clock Error:", error);
            }
        }, SERVER_CONFIG.BIO_CLOCK_INTERVAL);
    }

    private initReflexLoop() {
        setInterval(async () => {
            try {
                const lifeStatus = this.temporal.getLifeStatus();
                if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) return;

                const bpm = await this.garmin.getLastBPM();
                const stress = await this.garmin.getLastStress();
                const context = `BPM: ${bpm}, Stress: ${stress}`;

                const reflexParams = await this.gemini.generateReflex(context, this.getEntityProfile());
                if (reflexParams) {
                    this.globalVisualParams = reflexParams;
                }
            } catch (error) {
                console.error("[LifeCycle] Reflex Error:", error);
            }
        }, SERVER_CONFIG.REFLEX_INTERVAL);
    }

    private initThoughtLoop() {
        setInterval(async () => {
            try {
                const lifeStatus = this.temporal.getLifeStatus();
                if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) return;

                const bpm = await this.garmin.getLastBPM();
                const stress = await this.garmin.getLastStress();
                const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);

                // 1. תרגום פיזיולוגיה לשפה רגשית/חושית
                let sensoryQuery = "";
                if (stress > BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH) sensoryQuery += "חנק, איום, רעש מתכתי, קירות סוגרים. ";
                else if (stress < BIOMETRIC_RANGES.STRESS.THRESHOLD_LOW) sensoryQuery += "ציפה, מרחב, איבוד גבולות, שקט. ";

                if (bpm > BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_HIGH) sensoryQuery += "דחיפות שורפת, זמן קרוע, חום. ";
                else if (bpm < BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_LOW) sensoryQuery += "קור, צללים רחוקים, תנועה אטית. ";

                if (vitality < BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW) sensoryQuery += "אדמה רטובה, ברזל חלוד, סוף, ענבר. ";

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
                const thought = await this.gemini.generateThought(
                    finalQuery,
                    combinedMemories,
                    this.getEntityProfile()
                );

                console.log(`[Thought Loop] "${thought}"`);
                this.globalCurrentThought = thought;

                // 5. אחסון עם מטא-דאטה נקי (בלי המילה BPM בתוכן הזיכרון)
                await this.memory.storeMemory(
                    thought,
                    {
                        type: 'thought',
                        sensory_trigger: sensoryQuery,
                        bpm,
                        stress
                    },
                    SERVER_CONFIG.BASE_IMPORTANCE_THOUGHT,
                    SERVER_CONFIG.INITIAL_THOUGHT_STRENGTH,
                    lifeStatus.language
                );
            } catch (error) {
                console.error("[LifeCycle] Thought Loop Error:", error);
            }
        }, SERVER_CONFIG.THOUGHT_INTERVAL);
    }

    private initDecayLoop() {
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
                const baseInterval = status.lifespan / SERVER_CONFIG.DECAY_EVENTS_PER_LIFETIME;
                const finalInterval = Math.max(baseInterval, 30000); // מינימום 30 שניות

                if (status.isAlive) {
                    setTimeout(runDecay, finalInterval);
                }

            } catch (error) {
                console.error("[LifeCycle] Decay Error:", error);
                setTimeout(runDecay, 5 * 60 * 1000);
            }
        };

        runDecay();
    }
}
