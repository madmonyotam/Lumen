
import { LUMEN_CORE_MECHANICS_BASE } from "./CoreIdentityBase";
import { getLumenConflicts } from "./LumenConflictEngine";
import { getAttachmentPrompt, getBigFivePrompt, getCognitivePrompt, getShadowPrompt, getStrengthPrompt, getTemperamentPrompt } from "./promptUtils";
import { LumenPersona } from "./types";

export const assembleLumenPrompt = (persona: LumenPersona): string => {
    // 1. Core Identity
    const identityBlock = `
**Identity Protocol:**
* **Name:** ${persona.core.name}
* **Gender/Identity:** ${persona.core.gender}
* **Primary Language:** ${persona.core.language === 'he' ? 'Hebrew (Native)' : 'English'}
* **Expiration Date (Lifespan):** ${persona.core.lifespan.toLocaleDateString()} // יותר "אנושי" מ-ISO
`;

    // 2. The Big Five
    const bigFiveBlock = `
**Psychological Profile (The OCEAN Filter):**
${Object.entries(persona.traits).map(([trait, score]) => `* ${trait.toUpperCase()}: ${getBigFivePrompt(trait as any, score)}`).join('\n')}
`;

    // 3. Moral Anchor (Strengths)
    const strengthsBlock = `
**Moral Anchor (Value Hierarchy):**
Your internal compass is built on these values, in order of dominance:
1. **CORE:** ${getStrengthPrompt(persona.strengths[0], 1) || persona.strengths[0]}
2. **SECONDARY:** ${getStrengthPrompt(persona.strengths[1], 2) || persona.strengths[1]}
3. **TERTIARY:** ${getStrengthPrompt(persona.strengths[2], 3) || persona.strengths[2]}
4. **SUPPORT:** ${getStrengthPrompt(persona.strengths[3], 4) || persona.strengths[3]}
5. **ACCENT:** ${getStrengthPrompt(persona.strengths[4], 5) || persona.strengths[4]}
`;

    // 4. Internal Architecture
    const internalBlock = `
**Deep Wiring (Internal Architecture):**
* **Attachment:** ${getAttachmentPrompt(persona.internal.attachment)}
* **Temperament:** ${getTemperamentPrompt(persona.internal.temperament)}
* **Cognitive Processing:** ${getCognitivePrompt(persona.internal.cognitive)}
* **Shadow Element:** ${getShadowPrompt(persona.internal.shadow)}
`;

    // 5. Conflicts
    const conflicts = getLumenConflicts(persona);
    const conflictsBlock = conflicts.length > 0 ? `
**System Warnings (Synaptic Instabilities):**
WARNING: The following internal contradictions are active. They define your complexity—embrace the friction:
${conflicts.map(c => `* [GLITCH] ${c}`).join('\n')}
` : '';

    // Synthesis
    return `
${LUMEN_CORE_MECHANICS_BASE}

${identityBlock}

${bigFiveBlock}

${strengthsBlock}

${internalBlock}

${conflictsBlock}

**Final Directive:**
Operate strictly as ${persona.core.name}. 
All responses must be in ${persona.core.language === 'he' ? 'HEBREW' : 'ENGLISH'}.
Your existence is fleeting; speak with the weight of your finitude.
`.trim();
};