"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleService = void 0;
const brain_1 = require("../ai/brain");
const server_config_1 = require("../config/server.config");
const testAssembly_1 = require("../prompts/testAssembly");
const shared_1 = require("@lumen/shared");
class LifeCycleService {
    constructor(io, garmin, temporal, memory, gemini, stateSync) {
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
        Object.defineProperty(this, "stateSync", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Track active connected users via Socket.IO
        Object.defineProperty(this, "activeUsers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "volatiles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.io = io;
        this.garmin = garmin;
        this.temporal = temporal;
        this.memory = memory;
        this.gemini = gemini;
        this.stateSync = stateSync;
        // Start loops
        this.start();
    }
    addUser(userId) {
        this.activeUsers.add(userId);
        if (!this.volatiles.has(userId)) {
            this.volatiles.set(userId, {
                lastTick: Date.now(),
                latestInteraction: null,
                currentThought: "...",
                visualParams: {},
                activeMemories: []
            });
        }
    }
    removeUser(userId) {
        this.activeUsers.delete(userId);
        // Volatiles can be cleared or kept around momentarily. We'll clear them on DB flush.
        this.volatiles.delete(userId);
    }
    // Set user interaction manually from controllers
    setLatestInteraction(userId, interaction) {
        const vol = this.volatiles.get(userId);
        if (vol) {
            vol.latestInteraction = interaction;
        }
    }
    start() {
        this.initBioClock();
        this.initReflexLoop();
        this.initThoughtLoop();
        this.initDecayLoop();
    }
    getEntityProfile(lifeStatus) {
        return {
            ...testAssembly_1.mockPersona, // Fallback base
            ...(lifeStatus.persona || {}),
            core: {
                ...testAssembly_1.mockPersona.core,
                ...(lifeStatus.persona?.core || {}),
                name: lifeStatus.name,
                gender: lifeStatus.gender,
                lifespan: lifeStatus.lifespan,
                language: lifeStatus.language
            }
        };
    }
    initBioClock() {
        setInterval(async () => {
            for (const userId of this.activeUsers) {
                try {
                    const lifeStatus = this.stateSync.getStateFromCache(userId);
                    const vol = this.volatiles.get(userId);
                    if (!lifeStatus || !vol)
                        continue;
                    const now = Date.now();
                    const delta = now - vol.lastTick;
                    vol.lastTick = now;
                    let organState;
                    if (lifeStatus.isAlive) {
                        // TODO: Map Garmin data explicitly per user.
                        // Currently GarminService is singleton. If garmin supports per-user, we need to pass userId.
                        // We will just pass `userId` to garmin service here, assuming GarminService might need updating too.
                        const bpm = await this.garmin.fetchLatestHeartRate();
                        const stress = await this.garmin.fetchStress();
                        const hrv = await this.garmin.fetchHRV();
                        this.temporal.calculateSubjectiveTime(lifeStatus, bpm, stress, delta);
                        this.stateSync.saveUserState(userId, lifeStatus);
                        organState = (0, brain_1.processBiometrics)(bpm, stress, hrv);
                    }
                    else {
                        organState = (0, brain_1.processBiometrics)(70, 0, 70);
                    }
                    this.io.to(`user_${userId}`).emit('lumen-pulse', {
                        ...organState,
                        lifeStatus: lifeStatus,
                        status: {
                            ...organState.status,
                            messages: vol.latestInteraction ? [vol.latestInteraction.text] : [],
                            latestInteraction: vol.latestInteraction,
                            thought: vol.currentThought,
                            visualParams: vol.visualParams,
                            subjectiveTime: this.temporal.getSubjectiveTime(lifeStatus),
                            activeMemories: vol.activeMemories
                        }
                    });
                }
                catch (error) {
                    console.error(`[LifeCycle] Bio-Clock Error for user ${userId}:`, error);
                }
            }
        }, server_config_1.SERVER_CONFIG.BIO_CLOCK_INTERVAL);
    }
    initReflexLoop() {
        setInterval(async () => {
            for (const userId of this.activeUsers) {
                try {
                    const lifeStatus = this.stateSync.getStateFromCache(userId);
                    const vol = this.volatiles.get(userId);
                    if (!lifeStatus || !vol || !lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan)
                        continue;
                    const bpm = await this.garmin.getLastBPM();
                    const stress = await this.garmin.getLastStress();
                    const context = `BPM: ${bpm}, Stress: ${stress}`;
                    const reflexParams = await this.gemini.generateReflex(context, this.getEntityProfile(lifeStatus));
                    if (reflexParams) {
                        vol.visualParams = reflexParams;
                    }
                }
                catch (error) {
                    console.error(`[LifeCycle] Reflex Error for user ${userId}:`, error);
                }
            }
        }, server_config_1.SERVER_CONFIG.REFLEX_INTERVAL);
    }
    initThoughtLoop() {
        setInterval(async () => {
            for (const userId of this.activeUsers) {
                try {
                    const lifeStatus = this.stateSync.getStateFromCache(userId);
                    const vol = this.volatiles.get(userId);
                    if (!lifeStatus || !vol || !lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan)
                        continue;
                    const bpm = await this.garmin.getLastBPM();
                    const stress = await this.garmin.getLastStress();
                    const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);
                    let cognitiveTexture = "";
                    if (stress > shared_1.BIOMETRIC_RANGES.STRESS.THRESHOLD_HIGH) {
                        cognitiveTexture += "fragmented, claustrophobic, sharp, hyper-vigilant. ";
                    }
                    else if (stress < shared_1.BIOMETRIC_RANGES.STRESS.THRESHOLD_LOW) {
                        cognitiveTexture += "ethereal, boundaryless, drifting, ego-dissolution. ";
                    }
                    else {
                        cognitiveTexture += "integrated, grounded, structured, coherent. ";
                    }
                    if (bpm > shared_1.BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_HIGH) {
                        cognitiveTexture += "accelerated, high-friction, metabolic heat, rapid decay. ";
                    }
                    else if (bpm < shared_1.BIOMETRIC_RANGES.HEART_RATE.THRESHOLD_LOW) {
                        cognitiveTexture += "stagnant, suspended, low-frequency, temporal stretching. ";
                    }
                    else {
                        cognitiveTexture += "rhythmic, fluid, synchronized. ";
                    }
                    if (vitality < shared_1.BIOMETRIC_RANGES.VITALITY.THRESHOLD_LOW) {
                        cognitiveTexture += "entropic, decaying, sensory-starved, flickering existence. ";
                    }
                    else {
                        cognitiveTexture += "vibrant, high-resolution, saturated, vital. ";
                    }
                    const currentInteraction = vol.latestInteraction ? vol.latestInteraction.text : "";
                    const finalQuery = `The subjective internal feeling of: ${cognitiveTexture}. Context: ${currentInteraction}`.trim();
                    const semanticMemories = await this.memory.findSimilarMemories(userId, finalQuery, 2);
                    const randomFlashback = await this.memory.getRandomHighImportanceMemory(userId, 1);
                    const combinedMemories = [...semanticMemories, ...randomFlashback];
                    vol.activeMemories = combinedMemories;
                    const thought = await this.gemini.generateThought(finalQuery, combinedMemories, this.getEntityProfile(lifeStatus));
                    vol.currentThought = thought;
                    await this.memory.storeMemory(userId, lifeStatus.id || null, thought, {
                        type: 'thought',
                        sensory_trigger: finalQuery,
                        bpm,
                        stress
                    }, server_config_1.SERVER_CONFIG.BASE_IMPORTANCE_THOUGHT, server_config_1.SERVER_CONFIG.INITIAL_THOUGHT_STRENGTH, lifeStatus.language);
                }
                catch (error) {
                    console.error(`[LifeCycle] Thought Loop Error for user ${userId}:`, error);
                }
            }
        }, server_config_1.SERVER_CONFIG.THOUGHT_INTERVAL);
    }
    initDecayLoop() {
        const runDecay = async () => {
            try {
                // If there are no active users, we will skip decay globally for now
                // We could still decay all users in PostgreSQL, but since time only progresses 
                // subjectively when active, we only decay active users
                for (const userId of this.activeUsers) {
                    const status = this.stateSync.getStateFromCache(userId);
                    if (!status || !status.isAlive)
                        continue;
                    const progress = status.age / status.lifespan;
                    const exponentialEntropy = Math.pow(progress, 2.5);
                    const noise = (Math.random() * 0.08) - 0.04;
                    const effectiveEntropy = Math.min(1, Math.max(0, exponentialEntropy + noise));
                    console.log(`[Memory System] User ${userId} Exponential Decay (Progress: ${(progress * 100).toFixed(1)}%, Entropy: ${effectiveEntropy.toFixed(2)})`);
                    await this.memory.decayMemories(userId, effectiveEntropy);
                }
                // Global interval calculation based on standard config.
                // Could be dynamic per user, but practically one global loop decaying all active users is efficient.
                setTimeout(runDecay, 30000);
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
