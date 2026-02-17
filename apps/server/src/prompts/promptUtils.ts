// --- Helper Functions ---

import { LUMEN_ATTACHMENT_CONFIG, LUMEN_COGNITIVE_CONFIG, LUMEN_SHADOW_CONFIG, LUMEN_TEMPERAMENT_CONFIG } from "./attachmentAndTemp";
import {
    appreciationOfBeautyOptions, braveryOptions, creativityOptions, curiosityOptions, fairnessOptions,
    forgivenessOptions, gratitudeOptions, honestyOptions, hopeOptions, humilityOptions, humorOptions,
    judgmentOptions, kindnessOptions, leadershipOptions, loveOfLearningOptions, loveOptions,
    perseveranceOptions, perspectiveOptions, prudenceOptions, selfRegulationOptions,
    socialIntelligenceOptions, spiritualityOptions, teamworkOptions, zestOptions,
    CharacterStrength
} from "./characterStrengths";
import { bigFiveConfig } from "./theBigFive";
import { BigFiveConfig, LumenProfile, TierRange } from "./types";

const strengthMap: Record<string, Record<number, CharacterStrength>> = {
    // Wisdom
    creativity: creativityOptions,
    curiosity: curiosityOptions,
    judgment: judgmentOptions,
    'love-of-learning': loveOfLearningOptions,
    perspective: perspectiveOptions,
    // Courage
    bravery: braveryOptions,
    honesty: honestyOptions,
    perseverance: perseveranceOptions,
    zest: zestOptions,
    // Humanity
    kindness: kindnessOptions,
    'social-intelligence': socialIntelligenceOptions,
    love: loveOptions,
    // Justice
    teamwork: teamworkOptions,
    fairness: fairnessOptions,
    leadership: leadershipOptions,
    // Temperance
    forgiveness: forgivenessOptions,
    humility: humilityOptions,
    prudence: prudenceOptions,
    'self-regulation': selfRegulationOptions,
    // Transcendence
    'appreciation-of-beauty': appreciationOfBeautyOptions,
    gratitude: gratitudeOptions,
    hope: hopeOptions,
    humor: humorOptions,
    spirituality: spiritualityOptions
};

const getFromConfig = (config: Record<TierRange, LumenProfile>, value: number): string => {
    if (value <= 20) return config["1-20"].prompt;
    if (value <= 40) return config["21-40"].prompt;
    if (value <= 60) return config["41-60"].prompt;
    if (value <= 80) return config["61-80"].prompt;
    return config["81-100"].prompt;
};

export const getAttachmentPrompt = (value: number) => getFromConfig(LUMEN_ATTACHMENT_CONFIG, value);
export const getTemperamentPrompt = (value: number) => getFromConfig(LUMEN_TEMPERAMENT_CONFIG, value);
export const getCognitivePrompt = (value: number) => getFromConfig(LUMEN_COGNITIVE_CONFIG, value);
export const getShadowPrompt = (value: number) => getFromConfig(LUMEN_SHADOW_CONFIG, value);

export const getBigFivePrompt = (trait: keyof BigFiveConfig, score: number): string | null => {
    const profiles = Object.values(bigFiveConfig[trait]);
    const profile = profiles.find(p => score >= p.min && score <= p.max);
    return profile ? profile.prompt : null;
};

export const getStrengthPrompt = (strengthId: string, rank: number): string | null => {
    // Rank logic: 
    // rank 1 (Core) -> option 1 (most intense/defining)? 
    // Or does the user mean specific 'option' 1-5 from the file maps to intensity?
    // Looking at characterStrengths.ts, options 1-5 seem to be different "flavors" or intensity levels.
    // However, the Persona passed has a list of strength IDs. It doesn't specify which "Option" (1-5) to use for that strength.
    // BUT the task description for assembleLumenPrompt (step 7 in plan) implies we need a getter.
    // Use an algorithm to map rank in the top 5 to the option index?
    // "Rank 1: The Core" -> Option 1? "Rank 5: The Accent" -> Option 5?
    // Let's assume for now 1-to-1 mapping or default to 1 if not specified.
    // Actually, looking at the previous plan and context, the 'rank' in 'CoreHierarchy' (rank1..rank5) likely corresponds to the slot.
    // And logically, a 'Core' strength would manifest strongly (Option 1 or 5?).
    // Let's assume the 'rank' argument passed here (1-5) maps to the keys 1-5 in the options object.

    const options = strengthMap[strengthId];
    if (!options) return null;

    // Safety check if rank is out of bounds, default to 1
    const safeRank = (rank >= 1 && rank <= 5) ? rank : 1;
    return options[safeRank]?.description || null;
};
