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

const garminService = new GarminService();
const temporalEngine = new TemporalEngine();
const memoryService = new MemoryService();

garminService.connect().catch(console.error);

let lastTick = Date.now();

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

        // Emit the new structure with subjective time
        io.emit('lumen-pulse', {
            ...organState,
            status: {
                ...organState.status,
                // We'll attach it to the status object for now as a custom field
                // until we update the shared types officially
                subjectiveTime
            }
        });

        // Store a memory if stress is high (Significant Event)
        if (stress > 0.8) {
            await memoryService.storeMemory(`High stress event detected. BPM: ${bpm}`, { bpm, stress, subjectiveTime });
        }
    } catch (error) {
        console.error("Error fetching biometrics:", error);
    } // End of inner try-catch
}, 1000); // End of setInterval

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
