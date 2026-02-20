import dotenv from 'dotenv';

// Centralized environment loading
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GarminService } from './services/garmin/GarminService';
import { TemporalEngine } from './engines/TemporalEngine';
import { MemoryService } from './cortex/MemoryService';
import { GeminiService } from './services/ai/GeminiService';
import { LifeCycleService } from './services/LifeCycleService';
import { SERVER_CONFIG } from './config/server.config';
import { mockPersona } from './prompts/testAssembly';
import { LumenPersona } from './prompts/types';
import { getAllGenesisOptions } from './prompts/promptUtils';

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

const garminService = new GarminService();
const temporalEngine = new TemporalEngine();
temporalEngine.loadState();
const memoryService = new MemoryService();
const geminiService = new GeminiService();

const lifeCycle = new LifeCycleService(io, garminService, temporalEngine, memoryService, geminiService);

// Health Check Endpoint
app.get('/health', async (_req, res) => {
    try {
        const dbStatus = await memoryService.checkHealth();
        const bioStatus = garminService.connected;

        if (dbStatus && bioStatus) {
            res.json({
                status: 'ok',
                timestamp: Date.now(),
                details: { database: 'connected', bio_ingestion: 'connected' }
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

// Genesis Options Endpoint
app.get('/api/genesis/options', (_req, res) => {
    try {
        const options = getAllGenesisOptions();
        res.json(options);
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Genesis Endpoint - Rebirth the organism
app.post('/api/genesis', (req, res) => {
    try {
        const { persona } = req.body;

        if (!persona || !persona.core) {
            return res.status(400).json({ error: 'Missing genesis parameters' });
        }

        temporalEngine.reborn({ persona });
        console.log(`[Genesis] Organism reborn as ${persona.core.name} (${persona.core.gender}). Language: ${persona.core.language || 'en'}`);

        // Reset global messages on rebirth via lifeCycle state
        const birthMessage = persona.core.language === 'he'
            ? `אני ${persona.core.name}. הרגע נוצרתי.`
            : `I am ${persona.core.name}. I have just been born.`;

        lifeCycle.globalLatestInteraction = {
            text: birthMessage,
            timestamp: Date.now(),
            sender: 'lumen'
        };

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
            await memoryService.wipeMemories('local_user');
        } else if (memoryAction === 'diminish') {
            await memoryService.diminishMemories('local_user', 0.1); // Reduce to 10%
        }

        res.json({ message: 'Organism has perished.', lifeStatus: temporalEngine.getLifeStatus() });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// --- INTERACTION FLOW (Event Driven) ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const lifeStatus = temporalEngine.getLifeStatus();
        if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) {
            return res.json({ status: 'ignored', reason: 'Organism is dead.' });
        }

        console.log(`[Neural Uplink] Received: "${message}"`);
        lifeCycle.globalLatestInteraction = { text: message, timestamp: Date.now(), sender: 'user' };

        // Process interaction contextually
        (async () => {
            try {
                const bpm = await garminService.getLastBPM();
                const stress = await garminService.getLastStress();
                const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);

                const retrievalContext = `User says: "${message}". Current State: BPM ${bpm}, Stress ${stress}`;
                const memories = await memoryService.findSimilarMemories('local_user', retrievalContext, 3);

                const biometrics = { bpm, stressIndex: stress, vitality };
                const entityProfile: LumenPersona = lifeStatus.persona || {
                    ...mockPersona,
                    core: {
                        name: lifeStatus.name,
                        gender: lifeStatus.gender,
                        lifespan: lifeStatus.lifespan,
                        language: lifeStatus.language
                    }
                };

                const response = await geminiService.generateCognitiveResponse(biometrics, memories, message, entityProfile);

                if (response) {
                    console.log(`[Interaction] Response: "${response.thought}"`);
                    lifeCycle.globalLatestInteraction = { text: response.thought, timestamp: Date.now(), sender: 'lumen' };

                    if (response.re_encoding) {
                        await memoryService.storeMemory(
                            'local_user',
                            null,
                            response.re_encoding.content,
                            {
                                type: 'interaction',
                                original_trigger: message,
                                perception: response.internal_perception,
                                refraction: response.memory_refraction
                            },
                            SERVER_CONFIG.BASE_IMPORTANCE_INTERACTION,
                            response.re_encoding.strength,
                            lifeStatus.language || 'en'
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

// Start Background Operations
garminService.connect().catch(console.error);
lifeCycle.start();

httpServer.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_CONFIG.PORT}`);
});
