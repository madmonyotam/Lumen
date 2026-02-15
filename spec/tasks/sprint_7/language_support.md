# Task: Multi-Language Support (Fullstack) - Sprint 7

## Goal
Enable Lumen to communicate in Hebrew or English based on user preference selected at Genesis.

## Technical Details

### 1. Frontend (Genesis Screen)
- Add a language selection step/toggle to the `Genesis` flow.
- Options: `Hebrew`, `English`.
- Save selection to LocalStorage/State and send to Backend during initialization.

### 2. Backend (Context & Prompt)
- **Storage:** Persist user language preference in the User/System configuration.
- **System Prompt:**
  - Inject a directive into the System Prompt: "You must communicate strictly in {SELECTED_LANGUAGE}."
  - Ensure thought generation (Internal Monologue) also respects this setting, or decides if thoughts remain abstract/English while output is Hebrew. *Decision: Thoughts should likely align with the output language for consistency.*

## Acceptance Criteria
- [ ] Genesis screen includes Language Selection.
- [ ] Lumen responds in the selected language.
- [ ] Lumen's internal thoughts are consistent with the selected language (or at least the output is).
