import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { OrganState } from '@lumen/shared/types/index';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useLumenSocket = (token: string | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [organState, setOrganState] = useState<OrganState | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        const newSocket = io(SERVER_URL, {
            auth: {
                token
            }
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to Lumen Nervous System');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from Lumen Nervous System');
            setIsConnected(false);
        });

        // Listening for the new unified event structure
        newSocket.on('lumen-pulse', (data: OrganState) => {
            setOrganState(data);
        });

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return { socket, isConnected, organState };
};
