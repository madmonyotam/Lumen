import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Activity } from 'lucide-react';
import type { Conflict } from '../utils/genesisValidation';

const Container = styled(motion.div)`
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${props => props.theme.colors.textDim};
`;

const ScoreBar = styled.div`
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    width: 100%;
`;

const ScoreFill = styled(motion.div) <{ $score: number }>`
    height: 100%;
    background: ${props => {
        if (props.$score > 80) return '#00f2c3'; // Teal/Green
        if (props.$score > 50) return '#facc15'; // Yellow
        return '#ef4444'; // Red
    }};
`;

const ConflictList = styled(motion.div)`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

const ConflictItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #ef4444; // Warning/Critical color
    background: rgba(239, 68, 68, 0.1);
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(239, 68, 68, 0.2);
`;

interface Props {
    stability: number;
    conflicts: Conflict[];
}

export const StabilityIndicator: React.FC<Props> = ({ stability, conflicts }) => {
    return (
        <Container initial={false}>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={14} color={stability > 50 ? '#00f2c3' : '#ef4444'} />
                    <span>Neural Stability</span>
                </div>
                <span style={{ color: stability > 50 ? '#00f2c3' : '#ef4444' }}>{stability}%</span>
            </Header>
            <ScoreBar>
                <ScoreFill
                    $score={stability}
                    initial={{ width: '100%' }}
                    animate={{ width: `${stability}%` }}
                    transition={{ duration: 0.5 }}
                />
            </ScoreBar>

            <AnimatePresence>
                {conflicts.length > 0 && (
                    <ConflictList
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {conflicts.map(conflict => (
                            <ConflictItem
                                key={conflict.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                <AlertTriangle size={14} />
                                <span>{conflict.label}</span>
                            </ConflictItem>
                        ))}
                    </ConflictList>
                )}
            </AnimatePresence>
        </Container>
    );
};
