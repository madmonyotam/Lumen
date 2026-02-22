import React, { useState, useEffect } from 'react';
import { useOrgan } from '../../context/OrganContext';
import { useNeuralUplink } from '../../hooks/useNeuralUplink';
import { useBiometricsSync } from '../../hooks/useBiometricsSync';
import { useTranslation } from '../../hooks/useTranslation';
import { LUMEN_CONFIG } from '../../lumen.config';
import OrganismView from '../OrganismView';

export const OrganismContainer: React.FC = () => {
    const { organState, isConnected } = useOrgan();
    const { inputValue, setInputValue, handleSend } = useNeuralUplink();
    const { biometricsRef } = useBiometricsSync(organState);
    const { t, isRTL } = useTranslation();

    const [thought, setThought] = useState<string>(t('organism_silent'));
    const [currentInteraction, setCurrentInteraction] = useState<{ text: string, sender: 'user' | 'lumen', timestamp: number } | null>(null);

    useEffect(() => {
        const latest = organState?.status?.latestInteraction;
        if (latest) {
            const now = Date.now();
            const isRecent = (now - latest.timestamp) < 60000;
            const isNew = latest.timestamp !== currentInteraction?.timestamp;

            if (isRecent && isNew) {
                setCurrentInteraction(latest);
            }
        }
    }, [organState?.status?.latestInteraction, currentInteraction?.timestamp]);

    // Expiration Logic (absolute)
    useEffect(() => {
        if (!currentInteraction) return;
        const interval = setInterval(() => {
            if (Date.now() - currentInteraction.timestamp > LUMEN_CONFIG.INTERACTION_EXPIRY_MS) {
                setCurrentInteraction(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [currentInteraction]);

    useEffect(() => {
        if (organState?.status?.thought) {
            setThought(organState.status.thought);
        }
    }, [organState?.status?.thought]);

    // Provide a safe default for when we're connected but organState is loading initially
    if (isConnected && organState && !organState.lifeStatus?.isAlive) {
        // Technically GenesisScreen is already refactored into a Container that handles everything
        // Wait, did we refactor GenesisScreen itself or the reference? We refactored the reference in App.
        // Or we should update this one to point to GenesisContainer
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto'; // Reset height briefly to calculate scrollHeight correctly
        e.target.style.height = `${e.target.scrollHeight}px`;
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            // Reset height
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
        }
    };

    return (
        <OrganismView
            isConnected={isConnected}
            organState={organState}
            inputValue={inputValue}
            thought={thought}
            currentInteraction={currentInteraction}
            biometricsRef={biometricsRef}
            handleTextareaChange={handleTextareaChange}
            handleKeyDown={handleKeyDown}
            handleSend={handleSend}
            t={t}
            isRTL={isRTL}
        />
    );
};
