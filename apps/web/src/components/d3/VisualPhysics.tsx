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

export const VisualPhysics: React.FC<VisualPhysicsProps> = memo(({ biometricsRef }) => {
    console.log('[VisualPhysics] Initial Mount');

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
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>

                <RadiatingThoughtsCore
                    colors={[strokeColor]}
                    maxThoughts={0}
                    speed={2}
                    // thickness={thickness}
                    // distance={distance}
                    opacity={0.1}
                    tailLength={60}
                    dotSize={1}
                    startRadius={15}
                    glowIntensity={1.5}
                />
            </div >
        </OrganContainer>
    );
}, () => true); // Render once

VisualPhysics.displayName = 'VisualPhysics';
