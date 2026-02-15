export const SERVER_CONFIG = {
    PORT: 3001,

    // Intervals (ms)
    BIO_CLOCK_INTERVAL: 1000,
    REFLEX_INTERVAL: 5000,
    THOUGHT_INTERVAL: 30000,
    DECAY_EVENTS_PER_LIFETIME: 200, // Number of decay events over the full lifespan

    // Memory Settings
    BASE_IMPORTANCE_INTERACTION: 0.8,
    BASE_IMPORTANCE_THOUGHT: 0.2,
    INITIAL_THOUGHT_STRENGTH: 0.5,
    RETRIEVAL_FILTER_STRENGTH: 0.1,

    // Interaction
};
