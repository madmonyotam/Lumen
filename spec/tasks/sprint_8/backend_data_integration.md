# Sprint 8: Backend Data Integration

## Context
We need to move away from hard-coded prompt options in the frontend and fetch them from the server/store. This ensures flexibility and easier updates for Base Mechanics, Trait Descriptions, and Strength Definitions.

## Technical Constraints
- Use the existing central Store for state management.
- Ensure data is fetched on initial load.

## Specific Tasks
1.  **Prompt Options Fetching:**
    - Implement a service/API call to fetch:
        - Base Mechanics
        - Trait Descriptions
        - Strength Definitions
    - Store these in the frontend Store.
    
2.  **Schema Mapping:**
    - Ensure all fetched objects contain one of the following:
        - `personaName`: The logical key for the backend/prompt.
        - `label`: The display text for the UI.

## Definition of Done (DoD)
- [ ] Application fetches prompt options from the server/mock service on load.
- [ ] Data is correctly stored in the central Store.
- [ ] All UI components using these options are updated to read from the Store instead of hardcoded lists.
- [ ] Checked that `personaName` and `label` are correctly mapped.
