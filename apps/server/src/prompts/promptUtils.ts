// --- Helper Functions ---

import { LUMEN_ATTACHMENT_CONFIG, LUMEN_COGNITIVE_CONFIG, LUMEN_SHADOW_CONFIG, LUMEN_TEMPERAMENT_CONFIG } from "./attachmentAndTemp";
import {
    appreciationOfBeautyOptions, braveryOptions, creativityOptions, curiosityOptions, fairnessOptions,
    forgivenessOptions, gratitudeOptions, honestyOptions, hopeOptions, humilityOptions, humorOptions,
    judgmentOptions, kindnessOptions, leadershipOptions, loveOfLearningOptions, loveOptions,
    perseveranceOptions, perspectiveOptions, prudenceOptions, selfRegulationOptions,
    socialIntelligenceOptions, spiritualityOptions, teamworkOptions, zestOptions
} from "./characterStrengths";
import { bigFiveConfig } from "./theBigFive";
import { BigFiveConfig, LumenProfile, TierRange, GenesisOptions, BaseMechanic, TraitDescription, StrengthDefinition, CharacterStrength } from "@lumen/shared";

// Lifespan Mechanics
const LIFESPAN_MECHANICS: BaseMechanic[] = [
    { id: 'lifespan_short', label: 'Transient (4h)', value: 4 * 60 * 60 * 1000, description: 'A brief spark of existence.' },
    { id: 'lifespan_medium', label: 'Eternal (24h)', value: 24 * 60 * 60 * 1000, description: 'A full cycle of day and night.' },
    { id: 'lifespan_long', label: 'Ephemeral (1w)', value: 7 * 24 * 60 * 60 * 1000, description: 'A prolonged journey.' }
];


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

export const getAllGenesisOptions = (): GenesisOptions => {
    // 1. Mechanics
    const mechanics = LIFESPAN_MECHANICS;

    // 2. Traits (OCEAN + Biology)
    const traits: TraitDescription[] = [];

    // Helper to process config
    const processConfig = (config: Record<string, Record<TierRange, LumenProfile>>, category: 'OCEAN' | 'Biology' | 'Internal') => {
        Object.entries(config).forEach(([key, profiles]) => {
            // For each tier, add as a trait option? 
            // Or is the "Trait" the dimension (e.g. Openness)?
            // The frontend needs "Description" for the tooltip.
            // If we want sliders, we need the *Dimension* and its *Steps*.
            // But the current `TraitDescription` is flat.
            // Let's verify what the frontend expects.
            // "Live Tooltip: ... show the `personaName` of the current value".
            // This implies the frontend has the full map of ranges -> personaNames?
            // Or it receives a list and maps sliding values to it?
            // Let's separate each *Tier* as a discrete "Trait Option" for now, or just send the full Dimension structure?
            // Since `TraitDescription` is simple, let's treat every *Tier* as a selectable "Trait" logic-wise,
            // BUT for the slider UI, maybe we need the structure.
            // The prompt task said: "fetch... Base Mechanics, Trait Descriptions, Strength Definitions".
            // Let's flatten all profiles.
            Object.values(profiles).forEach(profile => {
                traits.push({
                    id: `${key}_${profile.min}_${profile.max}`, // Unique ID
                    label: profile.personaName,
                    description: profile.prompt.substring(0, 100) + "...",
                    category
                });
            });
        });
    };

    processConfig(bigFiveConfig as unknown as Record<string, Record<TierRange, LumenProfile>>, 'OCEAN');
    processConfig({
        attachment: LUMEN_ATTACHMENT_CONFIG,
        temperament: LUMEN_TEMPERAMENT_CONFIG,
        cognitive: LUMEN_COGNITIVE_CONFIG,
        shadow: LUMEN_SHADOW_CONFIG
    }, 'Biology');

    // 3. Strengths
    const strengths: StrengthDefinition[] = [];
    Object.entries(strengthMap).forEach(([id, options]) => {
        // Use the first option to get category/label base
        const first = options[1];
        if (first) {
            strengths.push({
                id,
                label: id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' '),
                description: first.description, // Default description
                category: first.category,
                options: options // Pass full options for details if needed
            });
        }
    });

    return { mechanics, traits, strengths };
};
