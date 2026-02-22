import React, { memo } from 'react';
import styled from 'styled-components';
import MeshedSphereCore from './MeshedSphereCore';
import RadiatingThoughtsCore from './RadiatingThoughtsCore';
import * as d3 from 'd3';

interface VisualPhysicsProps {
    biometricsRef: React.RefObject<{
        bpm: number;
        stress: number;
        vitality: number;
        ageRatio: number;
    }>;
    thought: string | null;
    currentInteraction: { text: string, sender: 'user' | 'lumen', timestamp: number } | null;
}

const OrganContainer = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background: transparent;
    filter: drop-shadow(0 0 30px ${props => props.theme.colors.teal}33) 
            drop-shadow(0 0 60px ${props => props.theme.colors.purple}22);
`;

const ThoughtsOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

export const VisualPhysics: React.FC<VisualPhysicsProps> = memo(({ biometricsRef, thought, currentInteraction }) => {
    console.log('[VisualPhysics] Mount/Update');

    const [maxThoughts, setMaxThoughts] = React.useState(0);
    const lastThoughtRef = React.useRef(thought);
    const lastInteractionRef = React.useRef(currentInteraction?.timestamp);

    React.useEffect(() => {
        let isBursting = false;

        // Check for new interaction
        if (currentInteraction && currentInteraction.timestamp !== lastInteractionRef.current) {
            setMaxThoughts(50);
            lastInteractionRef.current = currentInteraction.timestamp;
            isBursting = true;
        }
        // Check for new thought (only if not already bursting from interaction)
        else if (!isBursting && thought && thought !== lastThoughtRef.current) {
            setMaxThoughts(5);
            lastThoughtRef.current = thought;
            isBursting = true;
        }

        if (isBursting) {
            const timer = setTimeout(() => {
                setMaxThoughts(0);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [thought, currentInteraction]);

    const colorScale = d3.scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range(["#8992b4ff", "#ffffffff", "#f49494ff"])
        .interpolate(d3.interpolateHsl);

    const strokeColor = colorScale(biometricsRef.current.stress);


    return (
        <OrganContainer>
            <MeshedSphereCore
                biometricsRef={biometricsRef}
                isPlaying={true}
            />
            <ThoughtsOverlay>
                <RadiatingThoughtsCore
                    colors={[strokeColor]}
                    maxThoughts={maxThoughts}
                    speed={2}
                    // thickness={thickness}
                    // distance={distance}
                    opacity={0.1}
                    tailLength={60}
                    dotSize={1}
                    startRadius={15}
                    glowIntensity={1.5}
                />
            </ThoughtsOverlay>
        </OrganContainer>
    );
}, (prevProps, nextProps) => {
    // Custom compare function since we want to trigger re-renders on thought/interaction changes
    return prevProps.biometricsRef === nextProps.biometricsRef &&
        prevProps.thought === nextProps.thought &&
        prevProps.currentInteraction?.timestamp === nextProps.currentInteraction?.timestamp;
}); // Render on changes

VisualPhysics.displayName = 'VisualPhysics';
