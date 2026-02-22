"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporalEngine = void 0;
const lumen_bio_config_1 = require("../config/lumen-bio.config");
class TemporalEngine {
    /**
     * Calculates the new subjective time based on the organism's state.
     * Higher BPM and Stress accelerate subjective time perception.
     * Modifies and returns the state object.
     */
    calculateSubjectiveTime(state, bpm, stress, deltaRealTimeMs) {
        if (!state.isAlive)
            return state;
        // Bio-Config Influence
        const reactionSpeed = lumen_bio_config_1.BIO_CONFIG.interaction_rules.stimulus_reaction_speed;
        const bpmFactor = Math.max(0.5, bpm / 60) * (1 + reactionSpeed);
        const stressFactor = 1 + (stress * 0.5 * (1 + reactionSpeed));
        const timeDilation = bpmFactor * stressFactor;
        const deltaSubjective = deltaRealTimeMs * timeDilation;
        state.age += deltaSubjective;
        // Check for mortality
        if (state.age > state.lifespan) {
            state.isAlive = false;
        }
        return state;
    }
    reborn(state, payload) {
        const persona = payload.persona;
        state.persona = persona;
        state.name = persona.core.name;
        state.gender = persona.core.gender;
        state.language = persona.core.language || 'en';
        state.lifespan = persona.core.lifespan;
        state.birthTime = Date.now();
        state.age = 0;
        state.generation++;
        state.isAlive = true;
        return state;
    }
    kill(state) {
        state.isAlive = false;
        return state;
    }
    getSubjectiveTime(state) {
        return state.birthTime + state.age;
    }
}
exports.TemporalEngine = TemporalEngine;
