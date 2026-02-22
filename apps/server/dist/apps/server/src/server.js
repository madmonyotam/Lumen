"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Centralized environment loading
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const GarminService_1 = require("./services/garmin/GarminService");
const TemporalEngine_1 = require("./engines/TemporalEngine");
const MemoryService_1 = require("./cortex/MemoryService");
const GeminiService_1 = require("./services/ai/GeminiService");
const LifeCycleService_1 = require("./services/LifeCycleService");
const StateSyncService_1 = require("./services/StateSyncService");
const server_config_1 = require("./config/server.config");
const testAssembly_1 = require("./prompts/testAssembly");
const promptUtils_1 = require("./prompts/promptUtils");
const auth_1 = require("./middleware/auth");
const UserService_1 = require("./services/UserService");
const firebase_config_1 = require("./config/firebase.config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const garminService = new GarminService_1.GarminService();
const temporalEngine = new TemporalEngine_1.TemporalEngine();
const memoryService = new MemoryService_1.MemoryService();
const geminiService = new GeminiService_1.GeminiService();
const userService = new UserService_1.UserService();
const stateSync = new StateSyncService_1.StateSyncService();
const lifeCycle = new LifeCycleService_1.LifeCycleService(io, garminService, temporalEngine, memoryService, geminiService, stateSync);
// Socket.io Authentication Middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        const decodedToken = await firebase_config_1.firebaseAdmin.auth().verifyIdToken(token);
        socket.data.user = decodedToken;
        next();
    }
    catch (err) {
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
app.post('/api/auth/sync', auth_1.verifyToken, async (req, res) => {
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
    }
    catch (e) {
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
        }
        else {
            res.status(503).json({
                status: 'degraded',
                timestamp: Date.now(),
                details: {
                    database: dbStatus ? 'connected' : 'disconnected',
                    bio_ingestion: bioStatus ? 'connected' : 'disconnected'
                }
            });
        }
    }
    catch (e) {
        res.status(500).json({ status: 'error', error: String(e) });
    }
});
// Genesis Options Endpoint
app.get('/api/genesis/options', (_req, res) => {
    try {
        const options = (0, promptUtils_1.getAllGenesisOptions)();
        res.json(options);
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Genesis Endpoint - Rebirth the organism
app.post('/api/genesis', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
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
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Death Endpoint - Kill the organism and handle memories
app.post('/api/death', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { memoryAction } = req.body; // 'wipe' | 'diminish' | 'keep'
        let lifeStatus = await stateSync.loadUserState(userId);
        lifeStatus = temporalEngine.kill(lifeStatus);
        stateSync.saveUserState(userId, lifeStatus);
        console.log(`[Death] Organism killed for ${userId}. Memory Action: ${memoryAction}`);
        if (memoryAction === 'wipe') {
            await memoryService.wipeMemories(userId);
        }
        else if (memoryAction === 'diminish') {
            await memoryService.diminishMemories(userId, 0.1);
        }
        await stateSync.flushState(userId);
        res.json({ message: 'Organism has perished.', lifeStatus: lifeStatus });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// --- INTERACTION FLOW (Event Driven) ---
app.post('/api/chat', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { message } = req.body;
        if (!message)
            return res.status(400).json({ error: 'Message required' });
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
                const memories = await memoryService.findSimilarMemories(userId, retrievalContext, 3);
                const biometrics = { bpm, stressIndex: stress, vitality };
                const entityProfile = lifeStatus.persona || {
                    ...testAssembly_1.mockPersona,
                    core: {
                        name: lifeStatus.name,
                        gender: lifeStatus.gender,
                        lifespan: lifeStatus.lifespan,
                        language: lifeStatus.language
                    }
                };
                const response = await geminiService.generateCognitiveResponse(biometrics, memories, message, entityProfile);
                if (response) {
                    console.log(`[Interaction] Response for ${userId}: "${response.thought}"`);
                    lifeCycle.setLatestInteraction(userId, { text: response.thought, timestamp: Date.now(), sender: 'lumen' });
                    if (response.re_encoding) {
                        await memoryService.storeMemory(userId, lifeStatus.id || null, response.re_encoding.content, {
                            type: 'interaction',
                            original_trigger: message,
                            perception: response.internal_perception,
                            refraction: response.memory_refraction
                        }, server_config_1.SERVER_CONFIG.BASE_IMPORTANCE_INTERACTION, response.re_encoding.strength, lifeStatus.language || 'en');
                    }
                }
            }
            catch (err) {
                console.error(`[Interaction] Error processing for ${userId}:`, err);
            }
        })();
        res.json({ status: 'received' });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// Start Background Operations
garminService.connect().catch(console.error);
httpServer.listen(server_config_1.SERVER_CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${server_config_1.SERVER_CONFIG.PORT}`);
});
