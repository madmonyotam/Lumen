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

const garminService = new GarminService();
garminService.connect().catch(console.error);

setInterval(async () => {
    try {
        // Generate raw metrics from Garmin Service
        const bpm = await garminService.fetchLatestHeartRate();
        const stress = await garminService.fetchStress();
        const hrv = await garminService.fetchHRV();

        // Process into full OrganState
        const organState: OrganState = processBiometrics(bpm, stress, hrv);

        // Emit the new structure. 
        io.emit('lumen-pulse', organState);
    } catch (error) {
        console.error("Error fetching biometrics:", error);
    }

}, 1000);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
