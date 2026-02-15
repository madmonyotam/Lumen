import { useState } from 'react';

export const useNeuralUplink = () => {
    const [inputValue, setInputValue] = useState("");
    const [showKillModal, setShowKillModal] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const message = inputValue;
        setInputValue("");

        try {
            await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
        } catch (e) {
            console.error("Failed to send message:", e);
        }
    };

    const handleKill = async (action: 'wipe' | 'diminish') => {
        try {
            await fetch('http://localhost:3001/api/death', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
