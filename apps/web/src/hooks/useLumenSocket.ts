import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { BiometricData, OrganState } from '@lumen/shared/types/index';

const SERVER_URL = 'http://localhost:3001';

export const useLumenSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [biometrics, setBiometrics] = useState<BiometricData | null>(null);
    const [organState, setOrganState] = useState<OrganState | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Lumen Nervous System');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from Lumen Nervous System');
            setIsConnected(false);
        });

        newSocket.on('lumen-pulse', (data: BiometricData & OrganState) => {
            // Handling v1 mixed payload for now as per server implementation
            // But server also emits 'lumen-pulse-v2' with separated data.
            // Let's listen to v2 for clarity if possible, but v1 is the primary instruction.
            // Since my server emits v1 with spread properties, I'll use that.
            // Actually, shared types define them as separate interfaces.
            // Let's destructure based on keys if possible, or just store the whole object as both?
            // Wait, if I spread both into one object, I can cast it.
            const { bpm, stress, hrv, bodyBattery, vitality, mood, resonance, visualParams } = data as any;

            setBiometrics({ bpm, stress, hrv, bodyBattery });
            setOrganState({ vitality, mood, resonance, visualParams });
        });

        newSocket.on('lumen-pulse-v2', (data: { biometrics: BiometricData, organState: OrganState }) => {
            setBiometrics(data.biometrics);
            setOrganState(data.organState);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return { socket, isConnected, biometrics, organState };
};
