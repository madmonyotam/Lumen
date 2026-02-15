import React, { useEffect, useRef } from 'react';
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

export const MemoryFog: React.FC = () => {
    const { organState } = useOrgan();

    const activeMemories = organState?.status?.activeMemories || [];

    // 1. Color Scale (Cold -> Neutral -> Warm/Alert)
    const colorScale = d3.scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range(["#001e97ff", "#ffffff", "#ff0000"])
        .interpolate(d3.interpolateHsl);

    // 2. Map Active Memories to Visual Words
    const memoryWords: MemoryWord[] = activeMemories.flatMap((memory) => {
        // Normalize metrics (assuming 0-1 range, providing defaults)
        const strength = memory.strength ?? 0.5;
        const importance = memory.importance ?? 0.5;

        // Metadata color mapping - try to find a normalizeable value
        // If metadata has sentiment (-1 to 1), map to 0-1. Otherwise use importance.
        // Extract stress from metadata (handle object or JSON string)
        let stressVal = 0.5;
        try {
            if (typeof memory.metadata === 'object' && memory.metadata !== null) {
                const meta = memory.metadata as any;
                // Direct property
                if (typeof meta.stress === 'number') {
                    stressVal = meta.stress;
                }
                // Embedded in context string e.g. "Internal State: BPM 73..., Stress 0.87..."
                else if (typeof meta.context === 'string') {
                    const match = meta.context.match(/Stress\s+([\d.]+)/);
                    if (match && match[1]) {
                        stressVal = parseFloat(match[1]);
                    }
                }
            }
        } catch (e) {
            console.warn("Failed to extract stress from metadata", e); // keep console warn but maybe remove console log of memory
        }

        const color = colorScale(stressVal);


        // Define base words list from keywords or valid fallback
        let wordsList: string[] = [];
        if (memory.keywords && memory.keywords.length > 0) {
            wordsList = memory.keywords;
        } else if (memory.content) {
            wordsList = [memory.content.slice(0, 15)];
        } else {
            wordsList = [memory.id.slice(0, 8)];
        }

        // Map each word/keyword to a visual particle
        return wordsList.map((text, index) => ({
            id: `${memory.id}-${index}`, // Unique ID per keyword
            text: text.toUpperCase(),
            size: 0.1 + importance * 0.9,    // Importance -> Size (0.1 - 1.0)
            blur: 0.2 + (1 - strength) * 0.5,      // Strength -> Blur (0.3 - 0.8)
            color: color,                    // Metadata/Sentiment -> Color
            createdAt: Date.now()            // Unified creation time for the batch
        }));
    });

    return (
        <Container>
            <LumenMemoryFlowCore
                words={memoryWords}
                speed={1}
                lifeSpan={10000}
                maxWords={20}
            />
        </Container>
    );
};