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
const server_config_1 = require("./config/server.config");
const testAssembly_1 = require("./prompts/testAssembly");
const promptUtils_1 = require("./prompts/promptUtils");
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
const lifeCycle = new LifeCycleService_1.LifeCycleService(io, garminService, temporalEngine, memoryService, geminiService);
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
app.post('/api/genesis', (req, res) => {
    try {
        const { persona, traitLabels } = req.body;
        if (!persona || !persona.core || !traitLabels) {
            return res.status(400).json({ error: 'Missing genesis parameters' });
        }
        temporalEngine.reborn({ persona, traits: traitLabels });
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
    }
    catch (e) {
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
        }
        else if (memoryAction === 'diminish') {
            await memoryService.diminishMemories(0.1); // Reduce to 10%
        }
        res.json({ message: 'Organism has perished.', lifeStatus: temporalEngine.getLifeStatus() });
    }
    catch (e) {
        res.status(500).json({ error: String(e) });
    }
});
// --- INTERACTION FLOW (Event Driven) ---
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message)
            return res.status(400).json({ error: 'Message required' });
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
                const memories = await memoryService.findSimilarMemories(retrievalContext, 3);
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
                    console.log(`[Interaction] Response: "${response.thought}"`);
                    lifeCycle.globalLatestInteraction = { text: response.thought, timestamp: Date.now(), sender: 'lumen' };
                    if (response.re_encoding) {
                        await memoryService.storeMemory(response.re_encoding.content, {
                            type: 'interaction',
                            original_trigger: message,
                            perception: response.internal_perception,
                            refraction: response.memory_refraction
                        }, server_config_1.SERVER_CONFIG.BASE_IMPORTANCE_INTERACTION, response.re_encoding.strength, lifeStatus.language || 'en');
                    }
                }
            }
            catch (err) {
                console.error("[Interaction] Error:", err);
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
lifeCycle.start();
httpServer.listen(server_config_1.SERVER_CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${server_config_1.SERVER_CONFIG.PORT}`);
});
