export interface BiometricData {
    bpm: number;
    stress: number;
    hrv: number;
    bodyBattery: number;
}

export interface OrganState {
    vitality: number;
    mood: string;
    resonance: number;
    visualParams: Record<string, unknown>;
}
