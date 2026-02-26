export const SERVER_CONFIG = {
    PORT: 3001,

    // Intervals (ms)
    BIO_CLOCK_INTERVAL: 3000,
    REFLEX_INTERVAL: 100000, // temporary
    THOUGHT_INTERVAL: 90000, // temporary
    DECAY_EVENTS_PER_LIFETIME: 200, // Number of decay events over the full lifespan

    // Memory Settings
    BASE_IMPORTANCE_INTERACTION: 0.8,
    BASE_IMPORTANCE_THOUGHT: 0.2,
    INITIAL_THOUGHT_STRENGTH: 0.5,
    RETRIEVAL_FILTER_STRENGTH: 0.5,

    // Interaction
};
