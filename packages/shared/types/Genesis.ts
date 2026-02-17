
export type LumenGender = 'male' | 'female' | 'non-binary';
export type LumenLanguage = 'he' | 'en';
export type TierRange = "1-20" | "21-40" | "41-60" | "61-80" | "81-100";

// --- Derived from apps/server/src/prompts/types.ts ---

export interface CoreIdentity {
    name: string;
    gender: LumenGender;
    lifespan: number;
    language: LumenLanguage;
}

export interface LumenProfile {
    min: number;
    max: number;
    personaName: string;
    prompt: string;
}

export interface BigFiveConfig {
    openness: Record<TierRange, LumenProfile>;
    conscientiousness: Record<TierRange, LumenProfile>;
    extraversion: Record<TierRange, LumenProfile>;
    agreeableness: Record<TierRange, LumenProfile>;
    neuroticism: Record<TierRange, LumenProfile>;
}

export interface InternalConfig {
    attachment: Record<TierRange, LumenProfile>;
    temperament: Record<TierRange, LumenProfile>;
    cognitive: Record<TierRange, LumenProfile>;
    shadow: Record<TierRange, LumenProfile>;
}

export interface BigFiveScores {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
}

export interface InternalScores {
    attachment: number;
    temperament: number;
    cognitive: number;
    shadow: number;
}

export interface LumenPersona {
    /** Step 0: Base Identity */
    core: CoreIdentity;

    /** Step 1: Temperamental Filter (OCEAN) */
    traits: BigFiveScores;

    /** Step 2: Moral Anchor (Ordered IDs 1-5) */
    strengths: string[];

    /** Step 3: Deep Wiring */
    internal: InternalScores;

    /** Computed: Calculated Synaptic Instabilities */
    conflicts?: string[];
}

// --- Derived from apps/server/src/prompts/characterStrengths.ts ---

export type StrengthCategory = 'Wisdom' | 'Courage' | 'Humanity' | 'Justice' | 'Temperance' | 'Transcendence';

export interface CharacterStrength {
    label: string;
    category: StrengthCategory;
    description: string;
}

// --- New Types for Genesis Wizard Options ---

export interface BaseMechanic {
    id: string;
    label: string;
    value: number;
    description: string;
}

export interface TraitDescription {
    id: string;
    label: string;
    description: string;
    category: 'OCEAN' | 'Biology' | 'Internal';
}

export interface StrengthDefinition {
    id: string; // e.g. "wisdom_creativity"
    label: string;
    description: string;
    category: StrengthCategory;
    options?: Record<number, CharacterStrength>; // Optional full map if needed
}

export interface GenesisOptions {
    mechanics: BaseMechanic[];
    traits: TraitDescription[];
    strengths: StrengthDefinition[];
}
