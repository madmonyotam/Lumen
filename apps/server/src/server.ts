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
import { StateSyncService } from './services/StateSyncService';
import { SERVER_CONFIG } from './config/server.config';
import { mockPersona } from './prompts/testAssembly';
import { LumenPersona } from './prompts/types';
import { getAllGenesisOptions } from './prompts/promptUtils';
import { verifyToken, AuthenticatedRequest } from './middleware/auth';
import { UserService } from './services/UserService';
import { firebaseAdmin } from './config/firebase.config';

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
const memoryService = new MemoryService();
const geminiService = new GeminiService();
const userService = new UserService();
const stateSync = new StateSyncService();

const lifeCycle = new LifeCycleService(io, garminService, temporalEngine, memoryService, geminiService, stateSync);

// Socket.io Authentication Middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        socket.data.user = decodedToken;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', async (socket) => {
    const userId = socket.data.user.uid;
    console.log(`[Socket] User ${userId} connected`);

    // Ensure state is loaded into memory before joining lifecycle loop
    await stateSync.loadUserState(userId);

    socket.join(`user_${userId}`);
    lifeCycle.addUser(userId);

    socket.on('disconnect', async () => {
        console.log(`[Socket] User ${userId} disconnected`);
        lifeCycle.removeUser(userId);
        await stateSync.unloadUser(userId);
    });
});


// Auth Provisioning Endpoint
app.post('/api/auth/sync', verifyToken, async (req: AuthenticatedRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not found in token' });
        }

        const { uid, email, name, picture } = req.user;

        // 1. Upsert User in Postgres
        await userService.syncUser(uid, email, name, picture);

        // 2. Ensure Lumen exists for this user
        const lumenData = await userService.ensureLumen(uid);

        res.json({
            message: 'User synced successfully',
            user: req.user,
            lumen: lumenData
        });
    } catch (e) {
        console.error('[Auth Sync] Error:', e);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

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
app.post('/api/genesis', verifyToken, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user!.uid;
        const { persona } = req.body;

        if (!persona || !persona.core) {
            return res.status(400).json({ error: 'Missing genesis parameters' });
        }

        let lifeStatus = await stateSync.loadUserState(userId);
        lifeStatus = temporalEngine.reborn(lifeStatus, { persona });
        stateSync.saveUserState(userId, lifeStatus);

        console.log(`[Genesis] Organism reborn for ${userId} as ${persona.core.name}.`);

        // Reset user's latest interaction
        const birthMessage = persona.core.language === 'he'
            ? `אני ${persona.core.name}. הרגע נוצרתי.`
            : `I am ${persona.core.name}. I have just been born.`;

        lifeCycle.setLatestInteraction(userId, {
            text: birthMessage,
            timestamp: Date.now(),
            sender: 'lumen'
        });

        // Force immediate DB flush for major lifecycle event
        await stateSync.flushState(userId);

        res.json({ message: 'Genesis complete', lifeStatus: lifeStatus });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Death Endpoint - Kill the organism and handle memories
app.post('/api/death', verifyToken, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user!.uid;
        const { memoryAction } = req.body; // 'wipe' | 'diminish' | 'keep'

        let lifeStatus = await stateSync.loadUserState(userId);
        lifeStatus = temporalEngine.kill(lifeStatus);
        stateSync.saveUserState(userId, lifeStatus);

        console.log(`[Death] Organism killed for ${userId}. Memory Action: ${memoryAction}`);

        if (memoryAction === 'wipe') {
            await memoryService.wipeMemories(userId);
        } else if (memoryAction === 'diminish') {
            await memoryService.diminishMemories(userId, 0.1);
        }

        await stateSync.flushState(userId);

        res.json({ message: 'Organism has perished.', lifeStatus: lifeStatus });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// --- INTERACTION FLOW (Event Driven) ---
app.post('/api/chat', verifyToken, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.user!.uid;
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const lifeStatus = stateSync.getStateFromCache(userId);
        if (!lifeStatus) {
            return res.status(400).json({ error: 'Lumen state not loaded. Ensure Socket is connected.' });
        }

        if (!lifeStatus.isAlive || lifeStatus.age >= lifeStatus.lifespan) {
            return res.json({ status: 'ignored', reason: 'Organism is dead.' });
        }

        console.log(`[Neural Uplink] Received from ${userId}: "${message}"`);
        lifeCycle.setLatestInteraction(userId, { text: message, timestamp: Date.now(), sender: 'user' });

        // Process interaction contextually
        (async () => {
            try {
                const bpm = await garminService.getLastBPM();
                const stress = await garminService.getLastStress();
                const vitality = 1 - (lifeStatus.age / lifeStatus.lifespan);

                const retrievalContext = `User says: "${message}". Current State: BPM ${bpm}, Stress ${stress}`;

                // Cognitive Memory Retrieval (Spec: add_latests_mempries.md)
                const latestMemory = await memoryService.getLatestMemories(userId, 3);
                const semanticContext = await memoryService.findSimilarMemories(userId, retrievalContext, 2);
                const flashback = await memoryService.getRandomHighImportanceMemory(userId, 1);

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

                const response = await geminiService.generateCognitiveResponse(
                    { biometrics, latestMemory, semanticContext, flashback, currentMessage: message },
                    entityProfile
                );

                if (response) {
                    console.log(`[Interaction] Response for ${userId}: "${response.thought}"`);
                    lifeCycle.setLatestInteraction(userId, { text: response.thought, timestamp: Date.now(), sender: 'lumen' });

                    if (response.re_encoding) {
                        await memoryService.storeMemory(
                            userId,
                            lifeStatus.id || null,
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
                console.error(`[Interaction] Error processing for ${userId}:`, err);
            }
        })();

        res.json({ status: 'received' });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Start Background Operations
garminService.connect().catch(console.error);

httpServer.listen(SERVER_CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_CONFIG.PORT}`);
});
