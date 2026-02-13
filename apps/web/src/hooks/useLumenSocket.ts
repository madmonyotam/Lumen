import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { OrganState } from '@lumen/shared/types/index';

const SERVER_URL = 'http://localhost:3001';

export const useLumenSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
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

        // Listening for the new unified event structure
        newSocket.on('lumen-pulse', (data: OrganState) => {
            setOrganState(data);
        });

        return () => {
            newSocket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { socket, isConnected, organState };
};
