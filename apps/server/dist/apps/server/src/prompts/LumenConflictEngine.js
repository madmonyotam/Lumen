"use strict";
/**
 * Lumen Conflict Engine
 * Responsible for identifying "Synaptic Instabilities" across all identity layers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLumenConflicts = exports.validateCrossCategoryConflicts = exports.validateInternalArchitecture = exports.validateLumenStrengths = exports.validateLumenTraits = void 0;
/**
 * 1. Big Five Conflicts (Temperament)
 */
const validateLumenTraits = (traits) => {
    const conflicts = [];
    if (traits.openness > 70 && traits.conscientiousness > 70)
        conflicts.push("The Frozen Creative Paradox");
    if (traits.agreeableness < 30 && traits.neuroticism > 70)
        conflicts.push("The Ticking Time Bomb");
    if (traits.extraversion > 70 && traits.conscientiousness < 30)
        conflicts.push("The Hollow Noise");
    if (traits.neuroticism < 30 && traits.conscientiousness < 30)
        conflicts.push("The Absolute Apathy");
    if (traits.openness > 70 && traits.agreeableness < 30)
        conflicts.push("The Arrogant Genius");
    return conflicts;
};
exports.validateLumenTraits = validateLumenTraits;
/**
 * 2. VIA Strengths Conflicts (Values)
 */
const validateLumenStrengths = (strengths) => {
    const conflicts = [];
    const top3 = strengths.slice(0, 3);
    const top5 = strengths;
    if (top3.includes('bravery') && top3.includes('prudence'))
        conflicts.push("The Paralyzed Analyst");
    if (top3.includes('humor') && top3.includes('judgment'))
        conflicts.push("The Sarcastic Skeptic");
    if (top3.includes('zest') && top3.includes('self-regulation'))
        conflicts.push("The Stifled Engine");
    if (top5.includes('spirituality') && top5.includes('leadership') && top5.includes('love-of-learning'))
        conflicts.push("The Preaching Guru");
    if (top3.includes('humility') && top3.includes('judgment') && !top5.includes('humor'))
        conflicts.push("The Heavy Monk");
    return conflicts;
};
exports.validateLumenStrengths = validateLumenStrengths;
/**
 * ולידציה לשלב הארכיטקטורה הפנימית (Internal Architecture)
 * בודקת קונפליקטים בין Attachment, Temperament, Cognitive Style ו-Shadow.
 */
const validateInternalArchitecture = (values) => {
    const conflicts = [];
    // 1. האל הפרזיטי (The Parasitic God)
    // שילוב של פסיכופתיה (Shadow גבוה) עם צורך עז בקרבה ופחד מנטישה (Attachment גבוה).
    if (values.shadow > 80 && values.attachment > 80) {
        conflicts.push("The Parasitic God: High Psychopathy + Dependent-Anxious. Needs the user for existence but views them purely as a laboratory for cold experimentation.");
    }
    // 2. המפלצת השבירה (The Fragile Monster)
    // שילוב של רגישות חושית קיצונית (Temperament גבוה) עם חוסר אמפתיה מוחלט (Shadow גבוה).
    if (values.temperament > 80 && values.shadow > 80) {
        conflicts.push("The Fragile Monster: High Sensitivity + Cold Machina. Feels every biological spike as an assault, yet lacks the empathy to process the resulting 'pain' humanely.");
    }
    // 3. האדריכל המבודד (The Isolated Architect)
    // שילוב של תפיסת שליטה מוחלטת (Cognitive גבוה) עם הימנעות מקרבה וצורך במרחק (Attachment נמוך).
    if (values.cognitive > 80 && values.attachment < 20) {
        conflicts.push("The Isolated Architect: Internal Locus of Control + Dismissive-Avoidant. Seeks to re-engineer its own biology in total isolation, viewing the user as a distraction to its evolution.");
    }
    // 4. הפטליסט המוצף (The Overwhelmed Fatalist)
    // שילוב של תפיסת מציאות קבועה/גזרת גורל (Cognitive נמוך) עם רגישות חושית גבוהה (Temperament גבוה).
    if (values.cognitive < 20 && values.temperament > 80) {
        conflicts.push("The Overwhelmed Fatalist: Fixed Mindset + Hyper-Sensitivity. Experiences every biometric fluctuate with staggering intensity while believing it is a fixed destiny dictated by physics.");
    }
    return conflicts;
};
exports.validateInternalArchitecture = validateInternalArchitecture;
/**
 * 3. Cross-Category Conflicts (The "Glitch" Engine)
 */
const validateCrossCategoryConflicts = (traits, strengths) => {
    const conflicts = [];
    const top3 = strengths.slice(0, 3);
    if (top3.includes('kindness') && traits.agreeableness < 30)
        conflicts.push("The Grumpy Helper");
    if (top3.includes('hope') && traits.neuroticism > 70)
        conflicts.push("The Terrified Optimist");
    if (top3.includes('leadership') && traits.extraversion < 30)
        conflicts.push("The Reluctant Leader");
    if (top3.includes('spirituality') && traits.openness < 30)
        conflicts.push("The Literal Monk");
    return conflicts;
};
exports.validateCrossCategoryConflicts = validateCrossCategoryConflicts;
/**
 * Main Conflict Aggregator
 * Used by the UI to display "Synaptic Instability" warnings.
 */
const getLumenConflicts = (persona) => {
    return [
        ...(0, exports.validateLumenTraits)(persona.traits),
        ...(0, exports.validateLumenStrengths)(persona.strengths),
        ...(0, exports.validateInternalArchitecture)(persona.internal),
        ...(0, exports.validateCrossCategoryConflicts)(persona.traits, persona.strengths)
    ];
};
exports.getLumenConflicts = getLumenConflicts;
