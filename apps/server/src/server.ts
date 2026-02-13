import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { OrganState } from '@lumen/shared/types/index';
import { processBiometrics } from './ai/brain';

const app = express();
app.use(cors());

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
app.get('/health', async (_req, res) => {
    try {
        // Simple check - in real world we'd ping DB
        res.json({ status: 'ok', timestamp: Date.now() });
    } catch (e) {
        res.status(500).json({ status: 'error', error: String(e) });
    }
});

garminService.connect().catch(console.error);

let lastTick = Date.now();
let thoughtCooldown = 0;

// Configuration
const MIN_THOUGHT_INTERVAL = parseInt(process.env.MIN_THOUGHT_INTERVAL || '10000'); // 10 seconds
const STRESS_THOUGHT_INTERVAL = parseInt(process.env.STRESS_THOUGHT_INTERVAL || '3000'); // 3 seconds under high stress

setInterval(async () => {
    const now = Date.now();
    const delta = now - lastTick;
    lastTick = now;

    try {
        // Generate raw metrics from Garmin Service
        const bpm = await garminService.fetchLatestHeartRate();
        const stress = await garminService.fetchStress();
        const hrv = await garminService.fetchHRV();

        // Calculate Subjective Time
        const subjectiveTime = temporalEngine.calculateSubjectiveTime(bpm, stress, delta);

        // Process into full OrganState
        const organState: OrganState = processBiometrics(bpm, stress, hrv);

        // Cognitive Pulse (Thought Generation) - Every ~10 seconds or high stress
        thoughtCooldown += delta;
        let activeThought = undefined;

        if (thoughtCooldown > MIN_THOUGHT_INTERVAL || (stress > 0.8 && thoughtCooldown > STRESS_THOUGHT_INTERVAL)) {
            const context = `BPM: ${bpm}, Stress: ${stress}, Mode: ${organState.status.mode}`;
            activeThought = await geminiService.generateThought(context);
            if (activeThought) {
                console.log(`[Cortex] Thought: ${activeThought}`);
                // Store thought as a memory occasionally
                if (Math.random() > 0.7) {
                    await memoryService.storeMemory(activeThought, { type: 'thought', ...organState.biometrics });
                }
            }
            thoughtCooldown = 0;
        }

        // Emit the new structure with subjective time
        io.emit('lumen-pulse', {
            ...organState,
            status: {
                ...organState.status,
                messages: activeThought ? [activeThought] : [], // Send thought to frontend
                subjectiveTime
            }
        });

        // Store a memory if stress is high (Significant Event)
        if (stress > 0.9) { // Increased threshold to avoid spam
            await memoryService.storeMemory(`Panic event detected. BPM: ${bpm}`, { bpm, stress, subjectiveTime });
        }
    } catch (error) {
        console.error("Error fetching biometrics:", error);
    } // End of inner try-catch
}, 1000); // End of setInterval

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});
