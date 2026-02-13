
export class TemporalEngine {
    private subjectiveTime: number = Date.now();

    /**
     * Calculates the new subjective time based on the organism's state.
     * Higher BPM and Stress accelerate subjective time perception.
     * @param bpm Beats Per Minute (60-120+)
     * @param stress Stress Level (0.0-1.0)
     * @param deltaRealTimeMs Real time elapsed since last tick (ms)
     * @returns Current Subjective Timestamp
     */
    calculateSubjectiveTime(bpm: number, stress: number, deltaRealTimeMs: number): number {
        // Baseline: 60 BPM = 1.0x speed
        // Stress factor: 0.0 = 1.0x, 1.0 = 2.0x (subjective time flies when stressed/excited)

        const bpmFactor = Math.max(0.5, bpm / 60);
        const stressFactor = 1 + (stress * 0.5); // Max 1.5x boost from stress alone

        const timeDilation = bpmFactor * stressFactor;

        const deltaSubjective = deltaRealTimeMs * timeDilation;

        this.subjectiveTime += deltaSubjective;

        return this.subjectiveTime;
    }

    getSubjectiveTime(): number {
        return this.subjectiveTime;
    }

    getLastSubjectiveTime(): number {
        return this.subjectiveTime;
    }
}
