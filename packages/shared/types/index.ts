export interface LifeStatus {
    isAlive: boolean;
    birthTime: number;
    age: number;      // Current subjective age in ms
    lifespan: number; // Total lifespan in ms
    generation: number; // Increment on rebirth

    // Identity
    name: string;
    gender: 'male' | 'female' | 'non-binary';
    traits: string[]; // e.g., "Curious", "Stoic", "Anxious"
}

export interface OrganState {
    biometrics: {
        bpm: number;            // e.g., 73
        stressIndex: number;    // e.g., 0.14 (0.0 - 1.0 scale)
        hrv: number;            // e.g., 112
    };
    status: {
        vitality: number;       // e.g., 0.82 (0.0 - 1.0 scale)
        homeostasisLabel: string; // "STABLE", "AGITATED", etc.
        mode: string;           // "DEEP REFLECTION", "ACTIVE", etc.
        latency: number;        // e.g., 14.02
        messages?: string[];     // Array of thoughts/logs from the organism
        subjectiveTime?: number; // Internal time perception
        visualParams?: any;      // Reflex visual parameters attached to status for reactivity
    };
    lifeStatus: LifeStatus;
    visualParams: {
        coreColor: string;      // e.g., "#00f2c3"
        pulseSpeed: number;     // Multiplier for animation speed
    };
}

export interface BiometricData {
    // Keeping this for backward compatibility if needed, but OrganState now encapsulates biometrics.
    // The prompt implies the server emits data matching OrganState.
    // For now, I'll alias or keep it simple.
    bpm: number;
    stress: number;
    hrv: number;
    bodyBattery: number;
}
