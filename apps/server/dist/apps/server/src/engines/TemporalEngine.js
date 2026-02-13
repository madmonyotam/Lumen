"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalEngine = void 0;
class TemporalEngine {
    constructor() {
        Object.defineProperty(this, "subjectiveTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Date.now()
        });
        Object.defineProperty(this, "birthTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Date.now()
        });
        Object.defineProperty(this, "lifespan", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 24 * 60 * 60 * 1000
        }); // Default 24h
        Object.defineProperty(this, "generation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Lumen"
        });
        Object.defineProperty(this, "gender", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'non-binary'
        });
        Object.defineProperty(this, "traits", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["Curious"]
        });
        Object.defineProperty(this, "isAlive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    /**
     * Calculates the new subjective time based on the organism's state.
     * Higher BPM and Stress accelerate subjective time perception.
     */
    calculateSubjectiveTime(bpm, stress, deltaRealTimeMs) {
        if (!this.isAlive)
            return this.subjectiveTime;
        const bpmFactor = Math.max(0.5, bpm / 60);
        const stressFactor = 1 + (stress * 0.5);
        const timeDilation = bpmFactor * stressFactor;
        const deltaSubjective = deltaRealTimeMs * timeDilation;
        this.subjectiveTime += deltaSubjective;
        // Check for mortality
        if (this.subjectiveTime - this.birthTime > this.lifespan) {
            this.isAlive = false;
        }
        return this.subjectiveTime;
    }
    reborn(payload) {
        this.name = payload.name;
        this.gender = payload.gender;
        this.traits = payload.traits;
        this.lifespan = payload.lifespan;
        this.birthTime = Date.now();
        this.subjectiveTime = this.birthTime;
        this.generation++;
        this.isAlive = true;
    }
    getLifeStatus() {
        return {
            isAlive: this.isAlive,
            birthTime: this.birthTime,
            age: this.subjectiveTime - this.birthTime,
            lifespan: this.lifespan,
            generation: this.generation,
            name: this.name,
            gender: this.gender,
            traits: this.traits
        };
    }
    getSubjectiveTime() {
        return this.subjectiveTime;
    }
    getLastSubjectiveTime() {
        return this.subjectiveTime;
    }
}
exports.TemporalEngine = TemporalEngine;
