export const BIOMETRIC_RANGES = {
    HEART_RATE: {
        MIN: 40,
        MAX: 180,
        // Above this, the system reacts with agitation/heat
        THRESHOLD_HIGH: 110,
        // Below this, the system reacts with lethargy/cold
        THRESHOLD_LOW: 60
    },
    STRESS: {
        MIN: 0,
        MAX: 100,
        // Above this, system enters high-stress state (red/jerky)
        THRESHOLD_HIGH: 0.7,
        // Below this, system enters flow state (blue/smooth)
        THRESHOLD_LOW: 0.2,
        // Visual color shift threshold
        COLOR_THRESHOLD: 0.6
    },
    VITALITY: {
        // Below this, system starts decaying/rusting
        THRESHOLD_LOW: 0.3,
    }
} as const;
