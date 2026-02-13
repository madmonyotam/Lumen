"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const brain_1 = require("./ai/brain");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
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
const GarminService_1 = require("./services/garmin/GarminService");
const TemporalEngine_1 = require("./engines/TemporalEngine");
const MemoryService_1 = require("./cortex/MemoryService");
const GeminiService_1 = require("./services/ai/GeminiService");
const garminService = new GarminService_1.GarminService();
const temporalEngine = new TemporalEngine_1.TemporalEngine();
const memoryService = new MemoryService_1.MemoryService();
const geminiService = new GeminiService_1.GeminiService();
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
garminService.connect().catch(console.error);
let lastTick = Date.now();
// --- HYBRID INTELLIGENCE LOOPS ---
// 1. Biological Clock (1Hz) - Basic Life Functions
setInterval(async () => {
    try {
        const now = Date.now();
        const delta = now - lastTick;
        lastTick = now;
        // Fetch Raw Biometrics
        const bpm = await garminService.fetchLatestHeartRate();
        const stress = await garminService.fetchStress();
        const hrv = await garminService.fetchHRV();
        // Process Organ State
        temporalEngine.calculateSubjectiveTime(bpm, stress, delta);
        const organState = (0, brain_1.processBiometrics)(bpm, stress, hrv);
        // Store state globally or emit immediately
        // For now, we emit what we have, but Reflex/Cortex will enrich it asynchronously
        io.emit('lumen-pulse', {
            ...organState,
            status: {
                ...organState.status,
                messages: globalMessages, // Attached from Cortex Loop
                visualParams: globalVisualParams, // Attached from Reflex Loop
                subjectiveTime: temporalEngine.getLastSubjectiveTime()
            }
        });
    }
    catch (error) {
        console.error("Biological Clock Error:", error);
    }
}, 1000);
// State Holders for Asynchronous Intelligence
let globalMessages = [];
let globalVisualParams = {}; // TODO: Define strict type
// 2. Reflex Loop (Fast - 5s) - Bio-Reactive Visuals
setInterval(async () => {
    try {
        const bpm = await garminService.getLastBPM();
        const stress = await garminService.getLastStress();
        const context = `BPM: ${bpm}, Stress: ${stress}`;
        const reflexParams = await geminiService.generateReflex(context);
        if (reflexParams) {
            globalVisualParams = reflexParams;
            // console.log("[Reflex] Updated visual params:", reflexParams);
        }
    }
    catch (error) {
        console.error("[Reflex] Error:", error);
    }
}, 5000);
// 3. Cortex Loop (Slow - 30s or Stress Triggered) - Deep Thought
let thoughtCooldown = 0;
const CORTEX_INTERVAL = 30000; // 30s base
const STRESS_THRESHOLD = 0.8;
setInterval(async () => {
    try {
        thoughtCooldown += 1000; // Check every second, but only act if cooldown met
        const stress = await garminService.getLastStress();
        if (thoughtCooldown >= CORTEX_INTERVAL || (stress > STRESS_THRESHOLD && thoughtCooldown >= 10000)) {
            const bpm = await garminService.getLastBPM();
            const context = `BPM: ${bpm}, Stress: ${stress}, Mode: Analysis`;
            const thought = await geminiService.generateThought(context);
            if (thought) {
                console.log(`[Cortex] Thought: ${thought}`);
                globalMessages = [thought];
                thoughtCooldown = 0;
                // Memory formation on deep thoughts
                if (Math.random() > 0.6) {
                    await memoryService.storeMemory(thought, { bpm, stress, type: 'thought' });
                }
            }
        }
    }
    catch (error) {
        console.error("[Cortex] Error:", error);
    }
}, 1000);
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});
