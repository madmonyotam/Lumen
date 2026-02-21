import type { Language } from '@lumen/shared/types';
import { BIOMETRIC_RANGES } from '@lumen/shared';

export const LUMEN_CONFIG = {
    // Language (Stored in localStorage or default to 'en')
    LANGUAGE: (localStorage.getItem('lumen_lang') as Language) || 'en',

    // Pulse Settings
    MIN_PULSE_BPM: BIOMETRIC_RANGES.HEART_RATE.MIN,
    MAX_PULSE_BPM: BIOMETRIC_RANGES.HEART_RATE.MAX,

    // Animation Durations (ms)
    FADE_OUT_DURATION: 2000,

    // Visuals
    DEFAULT_ORB_RADIUS: 100,
    STRESS_COLOR_THRESHOLD: BIOMETRIC_RANGES.STRESS.COLOR_THRESHOLD,

    // Endpoints
    API_URL: 'http://localhost:3001',
    // Identity Defaults
    IS_ALIVE_DEFAULT: false,
    INTERACTION_EXPIRY_MS: 60000,
};
