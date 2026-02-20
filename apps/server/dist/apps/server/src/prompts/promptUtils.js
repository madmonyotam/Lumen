"use strict";
// --- Helper Functions ---
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGenesisOptions = exports.getStrengthPrompt = exports.getBigFivePrompt = exports.getShadowPrompt = exports.getCognitivePrompt = exports.getTemperamentPrompt = exports.getAttachmentPrompt = void 0;
const attachmentAndTemp_1 = require("./attachmentAndTemp");
const characterStrengths_1 = require("./characterStrengths");
const theBigFive_1 = require("./theBigFive");
// Lifespan Mechanics
const LIFESPAN_MECHANICS = [
    { id: 'lifespan_short', label: 'Transient (4h)', value: 4 * 60 * 60 * 1000, description: 'A brief spark of existence.' },
    { id: 'lifespan_medium', label: 'Eternal (24h)', value: 24 * 60 * 60 * 1000, description: 'A full cycle of day and night.' },
    { id: 'lifespan_long', label: 'Ephemeral (1w)', value: 7 * 24 * 60 * 60 * 1000, description: 'A prolonged journey.' }
];
const strengthMap = {
    // Wisdom
    creativity: characterStrengths_1.creativityOptions,
    curiosity: characterStrengths_1.curiosityOptions,
    judgment: characterStrengths_1.judgmentOptions,
    'love-of-learning': characterStrengths_1.loveOfLearningOptions,
    perspective: characterStrengths_1.perspectiveOptions,
    // Courage
    bravery: characterStrengths_1.braveryOptions,
    honesty: characterStrengths_1.honestyOptions,
    perseverance: characterStrengths_1.perseveranceOptions,
    zest: characterStrengths_1.zestOptions,
    // Humanity
    kindness: characterStrengths_1.kindnessOptions,
    'social-intelligence': characterStrengths_1.socialIntelligenceOptions,
    love: characterStrengths_1.loveOptions,
    // Justice
    teamwork: characterStrengths_1.teamworkOptions,
    fairness: characterStrengths_1.fairnessOptions,
    leadership: characterStrengths_1.leadershipOptions,
    // Temperance
    forgiveness: characterStrengths_1.forgivenessOptions,
    humility: characterStrengths_1.humilityOptions,
    prudence: characterStrengths_1.prudenceOptions,
    'self-regulation': characterStrengths_1.selfRegulationOptions,
    // Transcendence
    'appreciation-of-beauty': characterStrengths_1.appreciationOfBeautyOptions,
    gratitude: characterStrengths_1.gratitudeOptions,
    hope: characterStrengths_1.hopeOptions,
    humor: characterStrengths_1.humorOptions,
    spirituality: characterStrengths_1.spiritualityOptions
};
const getFromConfig = (config, value) => {
    if (value <= 20)
        return config["1-20"].prompt;
    if (value <= 40)
        return config["21-40"].prompt;
    if (value <= 60)
        return config["41-60"].prompt;
    if (value <= 80)
        return config["61-80"].prompt;
    return config["81-100"].prompt;
};
const getAttachmentPrompt = (value) => getFromConfig(attachmentAndTemp_1.LUMEN_ATTACHMENT_CONFIG, value);
exports.getAttachmentPrompt = getAttachmentPrompt;
const getTemperamentPrompt = (value) => getFromConfig(attachmentAndTemp_1.LUMEN_TEMPERAMENT_CONFIG, value);
exports.getTemperamentPrompt = getTemperamentPrompt;
const getCognitivePrompt = (value) => getFromConfig(attachmentAndTemp_1.LUMEN_COGNITIVE_CONFIG, value);
exports.getCognitivePrompt = getCognitivePrompt;
const getShadowPrompt = (value) => getFromConfig(attachmentAndTemp_1.LUMEN_SHADOW_CONFIG, value);
exports.getShadowPrompt = getShadowPrompt;
const getBigFivePrompt = (trait, score) => {
    const profiles = Object.values(theBigFive_1.bigFiveConfig[trait]);
    const profile = profiles.find(p => score >= p.min && score <= p.max);
    return profile ? profile.prompt : null;
};
exports.getBigFivePrompt = getBigFivePrompt;
const getStrengthPrompt = (strengthId, rank) => {
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
    if (!options)
        return null;
    // Safety check if rank is out of bounds, default to 1
    const safeRank = (rank >= 1 && rank <= 5) ? rank : 1;
    return options[safeRank]?.description || null;
};
exports.getStrengthPrompt = getStrengthPrompt;
const getAllGenesisOptions = () => {
    // 1. Mechanics
    const mechanics = LIFESPAN_MECHANICS;
    // 2. Traits (OCEAN + Biology)
    const traits = [];
    // Helper to process config
    const processConfig = (config, category) => {
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
    processConfig(theBigFive_1.bigFiveConfig, 'OCEAN');
    processConfig({
        attachment: attachmentAndTemp_1.LUMEN_ATTACHMENT_CONFIG,
        temperament: attachmentAndTemp_1.LUMEN_TEMPERAMENT_CONFIG,
        cognitive: attachmentAndTemp_1.LUMEN_COGNITIVE_CONFIG,
        shadow: attachmentAndTemp_1.LUMEN_SHADOW_CONFIG
    }, 'Biology');
    // 3. Strengths
    const strengths = [];
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
exports.getAllGenesisOptions = getAllGenesisOptions;
