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

setInterval(() => {
    // Generate raw metrics
    const bpm = 60 + Math.random() * 40; // 60-100
    const stress = Math.random(); // 0-1
    const hrv = 20 + Math.random() * 80;

    // Process into full OrganState
    const organState: OrganState = processBiometrics(bpm, stress, hrv);

    // Emit the new structure. 
    // The prompt says "emit a lumen-pulse event containing randomized but realistic BiometricData." 
    // AND "The component will consume data matching this TypeScript interface..."
    // So I will emit the `OrganState` object directly as the payload of `lumen-pulse`.
    io.emit('lumen-pulse', organState);

}, 1000);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
