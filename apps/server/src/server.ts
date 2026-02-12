import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { BiometricData, OrganState } from '@lumen/shared/types/index';
import { processBiometrics } from './ai/brain';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all for dev
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

// Heartbeat Logic - The "Biological Pulse"
setInterval(() => {
    const pulseData: BiometricData = {
        bpm: 60 + Math.random() * 40, // 60-100 bpm
        stress: Math.random(),
        hrv: 20 + Math.random() * 80,
        bodyBattery: 100 - Math.random() * 20
    };

    const organState: OrganState = processBiometrics(pulseData);

    // Emit the unified pulse
    io.emit('lumen-pulse', {
        ...pulseData,
        ...organState // Spreading organState properties too, or should it be nested? 
        // The prompt says "store the latest BiometricData and OrganState". 
        // Let's send them as specific objects to be clear.
        // Actually, spreading might conflict if keys overlap (they don't currently).
        // Safest is to send { data: pulseData, state: organState } or just merge if keys are unique.
        // Prompt: "emit a lumen-pulse event containing randomized but realistic BiometricData." -> implies data is there.
        // I'll stick to a clean payload structure.
    });

    // Re-emitting with a clearer structure for the client to parse easily
    io.emit('lumen-pulse-v2', {
        biometrics: pulseData,
        organState: organState
    });

}, 1000);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
