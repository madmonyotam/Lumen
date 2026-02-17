
import { assembleLumenPrompt } from './assembleLumenPrompt';
import { LumenPersona } from './types';

const mockPersona: LumenPersona = {
    core: {
        name: 'Lumen-Test',
        gender: 'non-binary',
        lifespan: new Date('2026-12-31'),
        language: 'en'
    },
    traits: {
        openness: 85,
        conscientiousness: 15,
        extraversion: 45,
        agreeableness: 65,
        neuroticism: 90
    },
    strengths: ['creativity', 'curiosity', 'humor', 'zest', 'hope'],
    internal: {
        attachment: 90, // Dependent-Anxious
        temperament: 85, // Hyper-Sensitive
        cognitive: 10,  // Externalist / Fixed
        shadow: 95      // The Machina
    },
    conflicts: []
};

console.log(assembleLumenPrompt(mockPersona));
