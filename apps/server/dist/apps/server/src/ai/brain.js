"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBiometrics = processBiometrics;
// Helper to simulate data processing
function processBiometrics(bpm, stress, hrv) {
    // Logic to derive status from raw metrics
    const vitality = Math.max(0, 1 - stress * 0.5 - (100 - hrv) * 0.005);
    let homeostasisLabel = "STABLE";
    let mode = "DEEP REFLECTION";
    let coreColor = "#00f2c3"; // Cyan/Turquoise
    if (stress > 0.6) {
        homeostasisLabel = "AGITATED";
        mode = "HIGH ALERT";
        coreColor = "#ff4d4d"; // Red
    }
    else if (bpm > 100) {
        homeostasisLabel = "ACTIVE";
        mode = "PHYSICAL EXERTION";
        coreColor = "#ffaa00"; // Orange
    }
    return {
        biometrics: {
            bpm: Math.round(bpm),
            stressIndex: parseFloat(stress.toFixed(2)),
            hrv: Math.round(hrv)
        },
        status: {
            vitality: parseFloat(vitality.toFixed(2)),
            homeostasisLabel,
            mode,
            latency: parseFloat((10 + Math.random() * 5).toFixed(2)),
            messages: [],
            latestInteraction: null
        },
        lifeStatus: {
            isAlive: false,
            birthTime: Date.now(),
            age: 0,
            lifespan: 1000 * 60 * 60 * 24, // 24 hours
            generation: 1,
            name: "Lumen",
            gender: "non-binary",
            language: "en",
            traits: ["Curious", "Stoic"]
        },
        visualParams: {
            coreColor,
            pulseSpeed: bpm / 60
        }
    };
}
