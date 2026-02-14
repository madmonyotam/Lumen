import dotenv from 'dotenv';

// Centralized environment loading
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { processBiometrics } from './ai/brain';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3001;

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

import { GarminService } from './services/garmin/GarminService';

import { TemporalEngine } from './engines/TemporalEngine';
import { MemoryService } from './cortex/MemoryService';

import { GeminiService } from './services/ai/GeminiService';

const garminService = new GarminService();
const temporalEngine = new TemporalEngine();
const memoryService = new MemoryService();
const geminiService = new GeminiService();

// Health Check Endpoint
// Health Check Endpoint
app.get('/health', async (_req, res) => {
    try {
        const dbStatus = await memoryService.checkHealth();
        const bioStatus = garminService.connected; // Check Garmin connection status

        if (dbStatus && bioStatus) {
            res.json({
                status: 'ok',
                timestamp: Date.now(),
                details: {
                    database: 'connected',
                    bio_ingestion: 'connected'
                }
            });
        } else {
            res.status(503).json({
                status: 'degraded',
                timestamp: Date.now(),
                details: {
                    database: dbStatus ? 'connected' : 'disconnected',
                    bio_ingestion: bioStatus ? 'connected' : 'disconnected'
                }
            });
        }
    } catch (e) {
        res.status(500).json({ status: 'error', error: String(e) });
    }
});

// Genesis Endpoint - Rebirth the organism
// Genesis Endpoint - Rebirth the organism
app.post('/api/genesis', (req, res) => {
    try {
        const { name, gender, traits, lifespan } = req.body;

        if (!name || !gender || !traits || !lifespan) {
            return res.status(400).json({ error: 'Missing genesis parameters' });
        }

        temporalEngine.reborn({ name, gender, traits, lifespan });
        console.log(`[Genesis] Organism reborn as ${name} (${gender}) with ${traits.length} traits.`);

        // Reset global messages on rebirth
        globalLatestInteraction = { text: `I am ${name}. I have just been born.`, timestamp: Date.now(), sender: 'lumen' };

        // NOTE: Memory wiping is now handled by the death/rebirth transition logic, not automatically here.
        // If a clean slate is desired, /api/death with action='wipe' should have been called prior.

        res.json({ message: 'Genesis complete', lifeStatus: temporalEngine.getLifeStatus() });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Death Endpoint - Kill the organism and handle memories
app.post('/api/death', async (req, res) => {
    try {
        const { memoryAction } = req.body; // 'wipe' | 'diminish' | 'keep'

        console.log(`[Death] Organism killed. Memory Action: ${memoryAction}`);
        temporalEngine.kill();

        if (memoryAction === 'wipe') {
            await memoryService.wipeMemories();
        } else if (memoryAction === 'diminish') {
            await memoryService.diminishMemories(0.1); // Reduce to 10%
        }
        // 'keep' does nothing to memories

        res.json({ message: 'Organism has perished.', lifeStatus: temporalEngine.getLifeStatus() });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

garminService.connect().catch(console.error);

let lastTick = Date.now();

// --- HYBRID INTELLIGENCE LOOPS ---

// 1. Biological Clock (1Hz) - Basic Life Functions
setInterval(async () => {
    try {
        const lifeStatus = temporalEngine.getLifeStatus();
        if (!lifeStatus.isAlive) return;

        const now = Date.now();
        const delta = now - lastTick;
        lastTick = now;

        // Fetch Raw Biometrics
        const bpm = await garminService.fetchLatestHeartRate();
        const stress = await garminService.fetchStress();
        const hrv = await garminService.fetchHRV();

        // Process Organ State
        temporalEngine.calculateSubjectiveTime(bpm, stress, delta);
        const organState = processBiometrics(bpm, stress, hrv);

        // Store state globally or emit immediately
        // For now, we emit what we have, but Reflex/Cortex will enrich it asynchronously
        io.emit('lumen-pulse', {
            ...organState,
            lifeStatus: temporalEngine.getLifeStatus(),
            status: {
                ...organState.status,
                messages: globalLatestInteraction ? [globalLatestInteraction.text] : [], // Backward compatibility
                latestInteraction: globalLatestInteraction, // New format
                thought: globalCurrentThought, // New thought field
                visualParams: globalVisualParams, // Attached from Reflex Loop
                subjectiveTime: temporalEngine.getLastSubjectiveTime()
            }
        });

    } catch (error) {
        console.error("Biological Clock Error:", error);
    }
}, 1000);

// State Holders for Asynchronous Intelligence
let globalLatestInteraction: { text: string; timestamp: number; sender: 'user' | 'lumen' } | null = null;
let globalCurrentThought: string = "...";
let globalVisualParams: any = {}; // TODO: Define strict type

// 2. Reflex Loop (Fast - 5s) - Bio-Reactive Visuals
setInterval(async () => {
    try {
        // Mortality Guardrail
        const lifeStatus = temporalEngine.getLifeStatus();
        if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) return;

        const bpm = await garminService.getLastBPM();
        const stress = await garminService.getLastStress();
        const context = `BPM: ${bpm}, Stress: ${stress}`;

        const reflexParams = await geminiService.generateReflex(context);
        if (reflexParams) {
            globalVisualParams = reflexParams;
        }
    } catch (error) {
        console.error("[Reflex] Error:", error);
    }
}, 5000);

// --- INTERACTION FLOW (Event Driven) ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        // Mortality Check
        const lifeStatus = temporalEngine.getLifeStatus();
        if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) {
            return res.json({ status: 'ignored', reason: 'Organism is dead.' });
        }

        console.log(`[Neural Uplink] Received: "${message}"`);
        // Update global state with user message immediately
        globalLatestInteraction = { text: message, timestamp: Date.now(), sender: 'user' };

        // Immediate processing for interaction
        (async () => {
            try {
                const bpm = await garminService.getLastBPM();
                const stress = await garminService.getLastStress();
                const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);

                // 1. Retrieve Memories (High context)
                const retrievalContext = `User says: "${message}". Current State: BPM ${bpm}, Stress ${stress}`;
                const memories = await memoryService.findSimilarMemories(retrievalContext, 3);

                // 2. Generate Cognitive Response
                const biometrics = { bpm, stressIndex: stress, vitality };
                const entityProfile = {
                    name: lifeStatus.name,
                    gender: lifeStatus.gender,
                    traits: lifeStatus.traits
                };

                const response = await geminiService.generateCognitiveResponse(biometrics, memories, message, entityProfile);

                if (response) {
                    console.log(`[Interaction] Response: "${response.thought}"`);

                    // Update Global Interaction State with LATEST response
                    globalLatestInteraction = { text: response.thought, timestamp: Date.now(), sender: 'lumen' };

                    // 3. Re-encode Memory (High Importance)
                    if (response.re_encoding) {
                        await memoryService.storeMemory(
                            response.re_encoding.content,
                            {
                                type: 'interaction',
                                original_trigger: message,
                                perception: response.internal_perception,
                                refraction: response.memory_refraction
                            },
                            0.8, // Base Importance for Interaction
                            response.re_encoding.strength
                        );
                    }
                }
            } catch (err) {
                console.error("[Interaction] Error:", err);
            }
        })();

        res.json({ status: 'received' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// --- THOUGHT LOOP (Internal Monologue) ---
const THOUGHT_INTERVAL = 30000; // 30s
setInterval(async () => {
    try {
        // Mortality Guardrail
        const lifeStatus = temporalEngine.getLifeStatus();
        if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) return;

        const bpm = await garminService.getLastBPM();
        const stress = await garminService.getLastStress();
        const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);

        // 1. Retrieve Memories (Drifting thoughts)
        // Context is internal state + random thought trigger
        const retrievalContext = `Internal State: BPM ${bpm}, Stress ${stress}, Vitality ${vitality}`;
        // Lower logical resonance, maybe more random? For now same vector search.
        const memories = await memoryService.findSimilarMemories(retrievalContext, 2);

        // 2. Generate Thought
        const thought = await geminiService.generateThought(retrievalContext, memories);

        console.log(`[Thought Loop] "${thought}"`);
        globalCurrentThought = thought;

        // 3. Store Memory (Low Importance - Fleeting)
        await memoryService.storeMemory(
            thought,
            {
                type: 'thought',
                context: retrievalContext
            },
            0.2, // Low importance for internal thoughts
            0.5  // Initial strength
        );

    } catch (error) {
        console.error("[Thought Loop] Error:", error);
    }
}, THOUGHT_INTERVAL);

// 4. Memory Decay & Pruning (Every 5 Minutes)
const DECAY_INTERVAL = 5 * 60 * 1000;
setInterval(async () => {
    try {
        // Calculate Entropy based on age/lifespan
        const status = temporalEngine.getLifeStatus();
        if (!status.isAlive) return;

        const entropy = status.age / status.lifespan; // 0.0 (Birth) -> 1.0 (Death)

        console.log(`[Memory System] Running Entropic Decay (Entropy: ${entropy.toFixed(2)})...`);
        await memoryService.decayMemories(entropy);

    } catch (error) {
        console.error("[Memory System] Decay Error:", error);
    }
}, DECAY_INTERVAL);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});
