import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

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
    color: ${props => props.theme.ui.text.dim};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 500;
`;

const ValueLabel = styled.span`
    font-size: 0.75rem;
    color: ${props => props.theme.palette.blue.main};
    font-family: ${props => props.theme.config.fonts.code || 'monospace'};
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

const Fill = styled(motion.div) <{ $percentage: number, $isRTL: boolean }>`
    height: 100%;
    background: linear-gradient(90deg, ${props => props.theme.palette.teal.main}, ${props => props.theme.palette.blue.main});
    box-shadow: ${props => props.theme.palette.teal.neon};
    position: absolute;
    top: 0;
    width: ${props => props.$percentage}%;
    ${props => props.$isRTL ? 'right' : 'left'}: 0;
`;

const Thumb = styled(motion.div) <{ $percentage: number, $isRTL: boolean }>`
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

    ${props => props.$isRTL ? 'right' : 'left'}: ${props => props.$percentage}%;

    &:active {
        cursor: grabbing;
        scale: 1.1;
        border-color: ${props => props.theme.palette.teal.main};
    }
`;

const Tooltip = styled(motion.div)`
    position: absolute;
    bottom: 24px;
    left: 50%;
    background: rgba(10, 15, 20, 0.95);
    border: 1px solid rgba(0, 242, 254, 0.4);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    white-space: nowrap;
    color: ${props => props.theme.palette.teal.main};
    font-size: 1rem;
    font-family: ${props => props.theme.config.fonts.code || 'monospace'};
    pointer-events: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 20;
    transition: all 0.5s ease-out;
`;

interface Props {
    label: string;
    value: number; // 0-100
    onChange: (val: number) => void;
    onCommit: (val: number) => void;
    getTooltipText: (val: number) => string;
}

export const TraitSlider: React.FC<Props> = React.memo(({ label, value, onChange, onCommit, getTooltipText }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const { isRTL } = useTranslation();

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
        let percentage = Math.max(0, Math.min(1, x / width));

        if (isRTL) {
            percentage = 1 - percentage;
        }

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
                    <Fill
                        $percentage={localValue}
                        $isRTL={isRTL}
                    />
                </Track>
                <Thumb
                    $percentage={localValue}
                    $isRTL={isRTL}
                    initial={{ x: isRTL ? '50%' : '-50%', y: '-50%' }}
                    animate={{ x: isRTL ? '50%' : '-50%', y: '-50%' }}
                    onPointerDown={handlePointerDown}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence>
                        {isDragging && (
                            <Tooltip
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                style={{ x: `-${isRTL ? 100 - localValue : localValue}%` }}
                            >
                                {getTooltipText(localValue)}
                            </Tooltip>
                        )}
                    </AnimatePresence>
                </Thumb>
            </TrackContainer>
        </SliderContainer>
    );
});
