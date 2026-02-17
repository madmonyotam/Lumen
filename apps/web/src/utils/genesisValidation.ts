export interface Conflict {
    id: string;
    label: string;
    sources: string[]; // e.g. ['neuroticism', 'temperament']
    severity: 'warning' | 'critical';
}

export interface ValidationResult {
    conflicts: Conflict[];
    stabilityScore: number; // 0-100
    details: string[]; // Log messages
}

export const validateGenesisState = (traitValues: Record<string, number>): ValidationResult => {
    const conflicts: Conflict[] = [];
    const details: string[] = [];
    let stabilityScore = 100;

    // Helper to get value or default 50
    const getVal = (key: string) => traitValues[key] ?? 50;

    // Rule 1: High Neuroticism vs Low Reactivity (Stoic/Calm)
    // Neuroticism > 80 AND Temperament < 40
    if (getVal('neuroticism') > 80 && getVal('temperament') < 40) {
        conflicts.push({
            id: 'conflict_neuro_temp',
            label: "Contradiction: High Sensitivity vs Low Biological Reactivity",
            sources: ['neuroticism', 'temperament'],
            severity: 'critical'
        });
        details.push(`[neuroticism_high (${getVal('neuroticism')}), temperament_low (${getVal('temperament')})]`);
        stabilityScore -= 30;
    }

    // Rule 2: High Extraversion vs Avoidant Attachment
    // Extraversion > 80 AND Attachment < 20 (Dismissive)
    if (getVal('extraversion') > 80 && getVal('attachment') < 20) {
        conflicts.push({
            id: 'conflict_extra_attach',
            label: "Conflict: Social Desire vs Need for Isolation",
            sources: ['extraversion', 'attachment'],
            severity: 'warning'
        });
        details.push(`[extraversion_high (${getVal('extraversion')}), attachment_dismissive (${getVal('attachment')})]`);
        stabilityScore -= 20;
    }

    // Rule 3: High Agreeableness vs Dark Shadow (Machina/Superior)
    // Agreeableness > 80 AND Shadow > 60 (Strategist/Machina)
    if (getVal('agreeableness') > 80 && getVal('shadow') > 60) {
        conflicts.push({
            id: 'conflict_agree_shadow',
            label: "Dissonance: Compassion vs Clinical Empathy Deficit",
            sources: ['agreeableness', 'shadow'],
            severity: 'critical'
        });
        details.push(`[agreeableness_high (${getVal('agreeableness')}), shadow_dark (${getVal('shadow')})]`);
        stabilityScore -= 40;
    }

    // Rule 4: Low Conscientiousness vs Master Architect
    // Conscientiousness < 20 AND Cognitive > 80
    if (getVal('conscientiousness') < 20 && getVal('cognitive') > 80) {
        conflicts.push({
            id: 'conflict_consc_cog',
            label: "Inconsistency: Chaotic Nature vs Structural Control",
            sources: ['conscientiousness', 'cognitive'],
            severity: 'warning'
        });
        details.push(`[conscientiousness_low (${getVal('conscientiousness')}), cognitive_architect (${getVal('cognitive')})]`);
        stabilityScore -= 15;
    }

    return {
        conflicts,
        stabilityScore: Math.max(0, stabilityScore),
        details
    };
};
