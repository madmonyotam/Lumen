"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIO_CONFIG = void 0;
exports.BIO_CONFIG = {
    drift_parameters: {
        base_drift_rate: 0.05, // How much memory changes on each retrieval (normal state)
        stress_impact_scale: 0.3, // How much Stress multiplies the deviation
        strength_decay_threshold: 0.4, // Strength level where Lumen starts truly hallucinating
        fact_retention_minimum: 0.7 // Percentage of original core truth that must remain stable
    },
    interaction_rules: {
        stimulus_reaction_speed: 0.3, // How fast external input changes internal metrics
    }
};
