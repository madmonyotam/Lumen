import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SliderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const Label = styled.span`
    font-size: 0.75rem;
    color: ${props => props.theme.colors.textDim};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
`;

const ValueLabel = styled.span`
    font-size: 0.75rem;
    color: #4facfe;
    font-family: ${props => props.theme.fonts.code || 'monospace'};
    font-weight: bold;
`;

const TrackContainer = styled.div`
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
`;

const Track = styled.div`
    position: absolute;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
`;

const Fill = styled(motion.div)`
    height: 100%;
    background: linear-gradient(90deg, #00f2fe, #4facfe);
    box-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
`;

const Thumb = styled(motion.div)`
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    /* transform handled by motion */
    cursor: grab;
    box-shadow: 0 0 15px rgba(0, 242, 254, 0.8);
    z-index: 10;
    border: 2px solid rgba(0, 0, 0, 0.1);

    &:active {
        cursor: grabbing;
        scale: 1.1;
        border-color: #00f2fe;
    }
`;

const Tooltip = styled(motion.div)`
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 15, 20, 0.95);
    border: 1px solid rgba(0, 242, 254, 0.4);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    color: #00f2fe;
    font-size: 0.75rem;
    font-family: ${props => props.theme.fonts.code || 'monospace'};
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 20;

    &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -4px;
        border-width: 4px;
        border-style: solid;
        border-color: rgba(0, 242, 254, 0.4) transparent transparent transparent;
    }
`;

interface Props {
    label: string;
    value: number; // 0-100
    onChange: (val: number) => void;
    onCommit: (val: number) => void;
    getTooltipText: (val: number) => string;
}

export const TraitSlider: React.FC<Props> = ({ label, value, onChange, onCommit, getTooltipText }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Sync local value when prop changes (only if not dragging)
    useEffect(() => {
        if (!isDragging) {
            setLocalValue(value);
        }
    }, [value, isDragging]);

    const calculateValue = (clientX: number) => {
        if (!containerRef.current) return localValue;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, x / width));
        return Math.round(percentage * 100);
    };

    const updateValue = (clientX: number) => {
        const newValue = calculateValue(clientX);
        setLocalValue(newValue);
        onChange(newValue);
    };

    const handleTrackClick = (e: React.MouseEvent) => {
        // Only trigger if not dragging (simple click)
        const newValue = calculateValue(e.clientX);
        setLocalValue(newValue);
        onChange(newValue);
        onCommit(newValue);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.stopPropagation(); // Prevent track click
        // e.target.setPointerCapture(e.pointerId); // Optional but good for dragging
        setIsDragging(true);
        // updateValue(e.clientX); // Don't jump on thumb click

        const handlePointerMove = (moveEvent: PointerEvent) => {
            updateValue(moveEvent.clientX);
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            setIsDragging(false);
            const finalValue = calculateValue(upEvent.clientX);
            onCommit(finalValue);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    return (
        <SliderContainer>
            <Header>
                <Label>{label}</Label>
                <ValueLabel>{localValue}%</ValueLabel>
            </Header>
            <TrackContainer ref={containerRef} onClick={handleTrackClick}>
                <Track>
                    <Fill style={{ width: `${localValue}%` }} />
                </Track>
                <Thumb
                    style={{ left: `${localValue}%` }}
                    initial={{ x: '-50%', y: '-50%' }}
                    onPointerDown={handlePointerDown}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence>
                        {isDragging && (
                            <Tooltip
                                initial={{ opacity: 0, y: 10, x: '-50%' }}
                                animate={{ opacity: 1, y: 0, x: '-50%' }}
                                exit={{ opacity: 0, y: 10, x: '-50%' }}
                            >
                                {getTooltipText(localValue)}
                            </Tooltip>
                        )}
                    </AnimatePresence>
                </Thumb>
            </TrackContainer>
        </SliderContainer>
    );
};
