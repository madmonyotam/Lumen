import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useNeuralUplink = () => {
    const { token } = useAuth();
    const [inputValue, setInputValue] = useState("");
    const [showKillModal, setShowKillModal] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim() || !token) return;

        const message = inputValue;
        setInputValue("");

        try {
            await fetch(`${SERVER_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
        } catch (e) {
            console.error("Failed to send message:", e);
        }
    };

    const handleKill = async (action: 'wipe' | 'diminish') => {
        if (!token) return;

        try {
            await fetch(`${SERVER_URL}/api/death`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ memoryAction: action })
            });
            setShowKillModal(false);
        } catch (e) {
            console.error("Failed to terminate:", e);
        }
    };

    return {
        inputValue,
        setInputValue,
        showKillModal,
        setShowKillModal,
        handleSend,
        handleKill
    };
};
