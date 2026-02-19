"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_CONFIG = void 0;
exports.SERVER_CONFIG = {
    PORT: 3001,
    // Intervals (ms)
    BIO_CLOCK_INTERVAL: 3000,
    REFLEX_INTERVAL: 60000, // temporary
    THOUGHT_INTERVAL: 30000,
    DECAY_EVENTS_PER_LIFETIME: 200, // Number of decay events over the full lifespan
    // Memory Settings
    BASE_IMPORTANCE_INTERACTION: 0.8,
    BASE_IMPORTANCE_THOUGHT: 0.2,
    INITIAL_THOUGHT_STRENGTH: 0.5,
    RETRIEVAL_FILTER_STRENGTH: 0.1,
    // Interaction
};
