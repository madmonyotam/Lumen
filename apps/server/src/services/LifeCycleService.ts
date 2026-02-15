import { Server } from 'socket.io';
import { GarminService } from './garmin/GarminService';
import { TemporalEngine } from '../engines/TemporalEngine';
import { MemoryService } from '../cortex/MemoryService';
import { GeminiService } from './ai/GeminiService';
import { processBiometrics } from '../ai/brain';
import { SERVER_CONFIG } from '../config/server.config';

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

                const reflexParams = await this.gemini.generateReflex(context);
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

                const retrievalContext = `Internal State: BPM ${bpm}, Stress ${stress}, Vitality ${vitality}`;
                const memories = await this.memory.findSimilarMemories(retrievalContext, 2);
                this.globalActiveMemories = memories;

                const thought = await this.gemini.generateThought(retrievalContext, memories, lifeStatus.language);

                console.log(`[Thought Loop] "${thought}"`);
                this.globalCurrentThought = thought;

                await this.memory.storeMemory(
                    thought,
                    { type: 'thought', context: retrievalContext },
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
                    const entropy = status.age / status.lifespan;
                    console.log(`[Memory System] Running Entropic Decay (Entropy: ${entropy.toFixed(2)})...`);
                    await this.memory.decayMemories(entropy);
                }

                // Calculate next interval: lifespan / events_per_lifetime
                // Default to 5 mins if something is wrong
                const interval = status.lifespan
                    ? (status.lifespan / SERVER_CONFIG.DECAY_EVENTS_PER_LIFETIME)
                    : 5 * 60 * 1000;

                setTimeout(runDecay, interval);
            } catch (error) {
                console.error("[LifeCycle] Decay Error:", error);
                setTimeout(runDecay, 5 * 60 * 1000);
            }
        };

        runDecay();
    }
}
