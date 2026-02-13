"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarminService = void 0;
class GarminService {
    constructor() {
        Object.defineProperty(this, "isConnected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "timeOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.timeOffset = Math.random() * 1000;
    }
    async connect() {
        console.log("Connecting to Garmin API...");
        // Mock connection delay
        await new Promise(resolve => setTimeout(resolve, 500));
        this.isConnected = true;
        console.log("Garmin API Connected (MOCK - Bio-Mimicry Enabled).");
        return true;
    }
    get connected() {
        return this.isConnected;
    }
    /**
     * Generates a smooth organic value using 1D Perlin-like noise (sine stacking)
     */
    noise(input) {
        // Simple stacking of sine waves to simulate organic fluctuation
        return (Math.sin(input) + Math.sin(input * 2.1) * 0.5 + Math.sin(input * 0.5) * 0.5) / 2;
    }
    async fetchLatestHeartRate() {
        if (!this.isConnected)
            throw new Error("Garmin Service not connected");
        this.timeOffset += 0.01;
        const n = this.noise(this.timeOffset);
        // Base 75, fluctuates between 60 and 90 smoothly
        // n is roughly -1 to 1, but we normalize it
        return 75 + (n * 15);
    }
    async fetchStress() {
        if (!this.isConnected)
            throw new Error("Garmin Service not connected");
        // Stress moves slower than HR
        const n = this.noise(this.timeOffset * 0.5 + 100);
        // Normalize to 0-1, skewed towards lower stress usually
        return Math.max(0, Math.min(1, (n + 1) / 2));
    }
    async fetchHRV() {
        if (!this.isConnected)
            throw new Error("Garmin Service not connected");
        // Inverse correlation to stress usually, but independent noise layer
        const n = this.noise(this.timeOffset * 0.8 + 50);
        return 60 + (n * 30); // 30 to 90
    }
    async getLastBPM() {
        // Since we are mocking, we can just fetch again or store state. 
        // For now, fetching is cheap (math).
        return this.fetchLatestHeartRate();
    }
    async getLastStress() {
        return this.fetchStress();
    }
}
exports.GarminService = GarminService;
