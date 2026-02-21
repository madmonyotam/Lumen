import React, { memo } from 'react';
import styled from 'styled-components';
import MeshedSphereCore from './MeshedSphereCore';

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
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    filter: drop-shadow(0 0 30px ${props => props.theme.colors.teal}33) 
            drop-shadow(0 0 60px ${props => props.theme.colors.purple}22);
`;

export const VisualPhysics: React.FC<VisualPhysicsProps> = memo(({ biometricsRef }) => {
    console.log('[VisualPhysics] Initial Mount');

    return (
        <OrganContainer>
            <MeshedSphereCore
                biometricsRef={biometricsRef}
                isPlaying={true}
            />
        </OrganContainer>
    );
}, () => true); // Render once

VisualPhysics.displayName = 'VisualPhysics';
