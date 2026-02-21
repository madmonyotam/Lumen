import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';
import { useOrgan } from '../../context/OrganContext';
import LumenMemoryFlowCore, { type MemoryWord } from './LumenMemoryFlowCore';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
`;

const VISUAL_LIFESPAN = 10000;
const MAX_WORDS = 6;

export const MemoryFog: React.FC = () => {
    const { organState } = useOrgan();
    const activeMemories = organState?.status?.activeMemories || [];

    // Track processed memory IDs to avoid re-calculating/re-sending old ones
    const processedIds = useRef<Set<string>>(new Set());

    // Store active timeouts to clear them on unmount
    const timeouts = useRef<Set<NodeJS.Timeout>>(new Set());

    // State to hold the new batch of words to send to the visualizer
    const [newWordsBatch, setNewWordsBatch] = useState<MemoryWord[]>([]);

    // 1. Color Scale (Cold -> Neutral -> Warm/Alert) - Memoized
    const colorScale = useMemo(() => d3.scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range(["#0d1a4cff", "#494949ff", "#4f1616ff"])
        .interpolate(d3.interpolateHsl), []);

    // 2. Clear timeouts on unmount
    useEffect(() => {
        return () => {
            timeouts.current.forEach(clearTimeout);
            timeouts.current.clear();
        };
    }, []);

    // 3. Identify and Process New Memories
    useEffect(() => {
        if (!activeMemories.length) return;

        // Filter for memories we haven't processed yet
        const newMemories = activeMemories.filter(m => !processedIds.current.has(m.id));

        if (newMemories.length > 0) {
            const wordsBatch: MemoryWord[] = newMemories.flatMap((memory) => {
                // Normalize metrics
                const strength = memory.strength ?? 0.5;
                const importance = memory.importance ?? 0.5;

                // Stress calculation
                let stressVal = 0.5;
                try {
                    if (typeof memory.metadata === 'object' && memory.metadata !== null) {
                        const meta = memory.metadata as any;
                        if (typeof meta.stress === 'number') {
                            stressVal = meta.stress;
                        } else if (typeof meta.context === 'string') {
                            const match = meta.context.match(/Stress\s+([\d.]+)/);
                            if (match && match[1]) {
                                stressVal = parseFloat(match[1]);
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Failed to extract stress from metadata", e);
                }

                const color = colorScale(stressVal);

                // Define words list
                let wordsList: string[] = [];
                if (memory.keywords && memory.keywords.length > 0) {
                    wordsList = memory.keywords;
                } else if (memory.content) {
                    wordsList = [memory.content.slice(0, 15)];
                } else {
                    wordsList = [memory.id.slice(0, 8)];
                }

                // Map to visual particles
                return wordsList.map((text, index) => ({
                    id: `${memory.id}-${index}-${Date.now()}`, // Ensure unique ID even if memory re-enters
                    text: text.toUpperCase(),
                    size: importance * 0.3,
                    blur: 0.1 + (1 - strength) * 0.5,
                    color: color,
                    createdAt: Date.now()
                }));
            });

            // Mark these IDs as processed and schedule cleanup
            newMemories.forEach(m => {
                processedIds.current.add(m.id);

                // Remove from processed set after lifespan so it can potentially reappear if still active
                const timeoutId = setTimeout(() => {
                    processedIds.current.delete(m.id);
                    timeouts.current.delete(timeoutId);
                }, VISUAL_LIFESPAN + 1000); // Small buffer

                timeouts.current.add(timeoutId);
            });

            // Update state safely by appending, preventing lost updates from rapid React batching
            if (wordsBatch.length > 0) {
                setNewWordsBatch(prev => {
                    const combined = [...prev, ...wordsBatch];
                    // Keep just enough words in state to prevent unbounded growth
                    return combined.slice(-(MAX_WORDS * 3));
                });
            }
        }
    }, [activeMemories, colorScale]);

    return (
        <Container>
            <LumenMemoryFlowCore
                words={newWordsBatch}
                speed={1}
                lifeSpan={VISUAL_LIFESPAN}
                maxWords={MAX_WORDS}
            />
        </Container>
    );
};