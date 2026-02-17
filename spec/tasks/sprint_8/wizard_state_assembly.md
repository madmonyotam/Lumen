# Sprint 8: Genesis Wizard - State Management & Assembly

## Context
We need a unified state manager for the Genesis Wizard to aggregate data from all steps and produce a final `LumenPersona` object that matches the backend expectations.

## Reference
- **Expected Output Structure:** See `apps/server/src/prompts/testAssembly.ts`.
- **Design:** `spec/tasks/sprint_8/design/`

## Wizard Steps Definition
The wizard is composed of the following logical steps, corresponding to the `LumenPersona` interface:

### Step 1: Core Identity (Ref: `screen.png`)
- **Inputs:**
    - `name` (String)
    - `gender` (Enum/String)
    - `language` (Enum: 'en' | 'he')
    - `lifespan` (Calculated Date/Timestamp)
- **Output Mapped To:** `LumenPersona.core`

### Step 2: Psycho-Biological Construction (Ref: `screen-1.png`, `screen-2.png`)
- **Inputs (Sliders):**
    - **Traits (OCEAN):** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism.
        - **Mapped To:** `LumenPersona.traits`
    - **Internal (Biology/Psychology):** Attachment, Temperament, Cognitive, Shadow.
        - **Mapped To:** `LumenPersona.internal`
- **Behavior:** Real-time feedback via tooltips (see `sliders_and_tooltips.md`).

### Step 3: Signature Strengths (Ref: `screen-3.png`)
- **Inputs:**
    - Selection of 3-5 top strengths from the 24 VIA classification.
- **Mapped To:** `LumenPersona.strengths` (Array of Strings)
- **Behavior:** Category filtering and drag-and-drop (see `signature_strengths_ui.md`).

## Technical Implementation
1.  **Central Wizard Store:**
    - Implement a React Context or Zustand store to hold the draft persona.
    - Initial state should match the structure of `testAssembly.ts` (but empty/default).
    
2.  **Assembly Function:**
    - specific function `assemblePersona()` that runs on wizard completion.
    - Validates all fields are populated.
    - Returns the exact `LumenPersona` object.

## Definition of Done (DoD)
- [ ] User can navigate through all 3 steps.
- [ ] Data persists between step navigation.
- [ ] Final "Genesis" button triggers the `assemblePersona()` function.
- [ ] The output JSON exactly matches the structure of `mockPersona` in `apps/server/src/prompts/testAssembly.ts`.
