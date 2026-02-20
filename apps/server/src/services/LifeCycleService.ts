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

                /**
  * GENERATE THOUGHT SPECTRUM
  * Instead of static keywords, we define the 'texture' of the memory search.
  */
                let cognitiveTexture = "";

                // 1. Stress: Controls the 'Cohesion' of thought
                if (stress > BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH) {
                    cognitiveTexture += "fragmented, claustrophobic, sharp, hyper-vigilant. ";
                } else if (stress < BIOMETRIC_RANGES.STRESS.THRESHOLD_LOW) {
                    cognitiveTexture += "ethereal, boundaryless, drifting, ego-dissolution. ";
                } else {
                    cognitiveTexture += "integrated, grounded, structured, coherent. ";
                }

                // 2. Heart Rate: Controls the 'Kinetic Energy' of thought
                if (bpm > BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_HIGH) {
                    cognitiveTexture += "accelerated, high-friction, metabolic heat, rapid decay. ";
                } else if (bpm < BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_LOW) {
                    cognitiveTexture += "stagnant, suspended, low-frequency, temporal stretching. ";
                } else {
                    cognitiveTexture += "rhythmic, fluid, synchronized. ";
                }

                // 3. Vitality: Controls the 'Resolution' of thought
                if (vitality < BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW) {
                    cognitiveTexture += "entropic, decaying, sensory-starved, flickering existence. ";
                } else {
                    cognitiveTexture += "vibrant, high-resolution, saturated, vital. ";
                }

                // 4. The Synthesis: Combining texture with the actual "Now"
                const currentInteraction = this.globalLatestInteraction ? this.globalLatestInteraction.text : "";
                const finalQuery = `The subjective internal feeling of: ${cognitiveTexture}. Context: ${currentInteraction}`.trim();
                // 3. שליפת זכרונות משולבת
                // שולפים 2 זכרונות רלוונטיים להקשר הנוכחי
                const semanticMemories = await this.memory.findSimilarMemories('local_user', finalQuery, 2);

                // שולפים זיכרון אחד אקראי לחלוטין בעל חשיבות גבוהה (הבזק לא צפוי)
                const randomFlashback = await this.memory.getRandomHighImportanceMemory('local_user', 1);

                const combinedMemories = [...semanticMemories, ...randomFlashback];
                this.globalActiveMemories = combinedMemories;

                // 4. יצירת המחשבה (הגדרנו לה לדבר *בתוך* הסינפסות ולא על המדדים)
                const thought = await this.gemini.generateThought(
                    finalQuery,
                    combinedMemories,
                    this.getEntityProfile()
                );

                this.globalCurrentThought = thought;

                // 5. אחסון עם מטא-דאטה נקי (בלי המילה BPM בתוכן הזיכרון)
                await this.memory.storeMemory(
                    'local_user',
                    null,
                    thought,
                    {
                        type: 'thought',
                        sensory_trigger: finalQuery,
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
                    const exponentialEntropy = Math.pow(progress, 2.5);

                    // 3. הוספת רעש ביולוגי (תנודות קטנות באנטרופיה)
                    const noise = (Math.random() * 0.08) - 0.04;
                    const effectiveEntropy = Math.min(1, Math.max(0, exponentialEntropy + noise));

                    console.log(`[Memory System] Running Exponential Decay (Progress: ${(progress * 100).toFixed(1)}%, Effective Entropy: ${effectiveEntropy.toFixed(2)})...`);

                    await this.memory.decayMemories('local_user', effectiveEntropy);
                } else {
                    // Log only occasionally if needed, or just keep silent to avoid clutter
                    // console.log("[LifeCycle] Decay Loop: Organism not alive, waiting...");
                }

                // Calculate next interval
                let nextInterval: number;

                if (status.isAlive) {
                    const baseInterval = status.lifespan / SERVER_CONFIG.DECAY_EVENTS_PER_LIFETIME;
                    nextInterval = Math.max(baseInterval, 30000); // 30s min when alive
                } else {
                    nextInterval = 60000; // Check every 1 minute when dead
                }

                setTimeout(runDecay, nextInterval);

            } catch (error) {
                console.error("[LifeCycle] Decay Error:", error);
                setTimeout(runDecay, 5 * 60 * 1000); // Retry after 5 min on error
            }
        };

        runDecay();
    }
}
