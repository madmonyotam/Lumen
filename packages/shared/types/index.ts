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
    language: 'en' | 'he'; // e.g., "en", "he"
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
        messages: string[];     // Array of thoughts/logs from the organism
        latestInteraction?: {
            text: string;
            timestamp: number;
            sender: 'user' | 'lumen';
        } | null;
        thought?: string;
        subjectiveTime?: number; // Internal time perception
        visualParams?: any;      // Reflex visual parameters attached to status for reactivity
        activeMemories?: Memory[]; // Memories currently "floating" in consciousness
    };
    lifeStatus: LifeStatus;
    visualParams: {
        coreColor: string;      // e.g., "#00f2c3"
        pulseSpeed: number;     // Multiplier for animation speed
    };
}

export interface Memory {
    id: string;
    content: string;
    timestamp: number;
    strength: number; // 0.0 - 1.0
    importance: number; // 0.0 - 1.0 (Initial impact)
    embedding?: number[];
    metadata?: any;
    keywords?: string[]; // Semantic shards for visualization
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
