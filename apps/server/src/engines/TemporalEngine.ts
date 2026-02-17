import { LifeStatus, LumenPersona } from '@lumen/shared/types/index';
import { BIO_CONFIG } from '../config/lumen-bio.config';

export class TemporalEngine {
    private subjectiveTime: number = Date.now();
    private birthTime: number = Date.now();
    private lifespan: number = 24 * 60 * 60 * 1000; // Default 24h
    private generation: number = 1;
    private persona: LumenPersona | null = null;
    private name: string = "Lumen";
    private gender: 'male' | 'female' | 'non-binary' = 'non-binary';
    private language: 'en' | 'he' = 'en';
    private traits: string[] = ["Curious"];
    private isAlive: boolean = false;

    /**
     * Calculates the new subjective time based on the organism's state.
     * Higher BPM and Stress accelerate subjective time perception.
     */
    calculateSubjectiveTime(bpm: number, stress: number, deltaRealTimeMs: number): number {
        if (!this.isAlive) return this.subjectiveTime;

        // Bio-Config Influence
        const reactionSpeed = BIO_CONFIG.interaction_rules.stimulus_reaction_speed;

        const bpmFactor = Math.max(0.5, bpm / 60) * (1 + reactionSpeed);
        const stressFactor = 1 + (stress * 0.5 * (1 + reactionSpeed));

        const timeDilation = bpmFactor * stressFactor;
        const deltaSubjective = deltaRealTimeMs * timeDilation;

        this.subjectiveTime += deltaSubjective;

        // Check for mortality
        if (this.subjectiveTime - this.birthTime > this.lifespan) {
            this.isAlive = false;
        }

        return this.subjectiveTime;
    }

    reborn(payload: { persona: LumenPersona, traits: string[] }) {
        this.persona = payload.persona;
        this.name = payload.persona.core.name;
        this.gender = payload.persona.core.gender;
        this.language = payload.persona.core.language || 'en';
        this.lifespan = payload.persona.core.lifespan;

        this.traits = payload.traits;

        this.birthTime = Date.now();
        this.subjectiveTime = this.birthTime;
        this.generation++;
        this.isAlive = true;
    }

    kill() {
        this.isAlive = false;
    }

    getLifeStatus(): LifeStatus {
        return {
            isAlive: this.isAlive,
            birthTime: this.birthTime,
            age: this.subjectiveTime - this.birthTime,
            lifespan: this.lifespan,
            generation: this.generation,
            name: this.name,
            gender: this.gender,
            language: this.language,
            traits: this.traits,
            persona: this.persona || undefined
        };
    }

    getSubjectiveTime(): number {
        return this.subjectiveTime;
    }

    getLastSubjectiveTime(): number {
        return this.subjectiveTime;
    }
}
