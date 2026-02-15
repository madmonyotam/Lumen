import { useRef, useEffect } from 'react';
import type { OrganState } from '@lumen/shared/types/index';

export const useBiometricsSync = (organState: OrganState | null) => {
    const biometricsRef = useRef({
        bpm: organState?.biometrics?.bpm || 70,
        stress: organState?.biometrics?.stressIndex || 0,
        vitality: organState?.status?.vitality || 1,
        ageRatio: organState?.lifeStatus ? (organState.lifeStatus.age / organState.lifeStatus.lifespan) : 0
    });

    useEffect(() => {
        if (organState?.biometrics && organState?.status && organState?.lifeStatus) {
            biometricsRef.current = {
                bpm: organState.biometrics.bpm,
                stress: organState.biometrics.stressIndex,
                vitality: organState.status.vitality,
                ageRatio: organState.lifeStatus.age / organState.lifeStatus.lifespan
            };
        }
    }, [organState]);

    return { biometricsRef };
};
