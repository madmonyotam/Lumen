export const BIO_CONFIG = {
    drift_parameters: {
        base_drift_rate: 0.05,          // How much memory changes on each retrieval (normal state)
        stress_impact_scale: 0.3,       // How much Stress multiplies the deviation
        strength_decay_threshold: 0.4,  // Strength level where Lumen starts truly hallucinating
        fact_retention_minimum: 0.7     // Percentage of original core truth that must remain stable
    },
    emotional_biasing: {
        hr_volatility: 0.25,             // How much HR volatility changes emotional tone
        negativity_bias_clamp: 0.2,     // Limit on how "dark" or paranoid Lumen can become
        confabulation_probability: 0.1  // Chance of inventing a completely new detail
    },
    interaction_rules: {
        stimulus_reaction_speed: 0.3,   // How fast external input changes internal metrics
        perceptual_delta_smoothing: 0.5 // Smoothing interpretation to prevent extreme narrative jumps
    }
};
