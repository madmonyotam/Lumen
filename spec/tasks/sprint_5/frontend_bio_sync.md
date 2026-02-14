# Task: Bio-Synchronous Frontend Experience

## Context
Update the UI to reflect the new cognitive states and reduce reliance on raw numbers.

## Requirements
### 1. Visual Separation
*   **Thoughts:** Displayed in a separate, subtle UI area (e.g., floating bubbles, side panel, or semi-transparent text). "Internal Monologue" aesthetic.
*   **Interactions:** Center stage, clear typography, direct "Chat" interface feel.

### 2. Objective Data Reduction
*   **Metrics:** Reduce opacity of BPM and Stress numbers to ~10% (barely visible).
*   **Visualization:** Rely on the *Organ's* pulsing, color shifts (Teal -> Purple), and light intensity to convey state.
*   **Goal:** User feels the state, rather than reading it.

## Acceptance Criteria
*   [ ] `OrganismView` updated to separate Thought display.
*   [ ] Metric components (BPM, Stress) styled to be subtle/faded smaller - let screen real estate be used for the organ.
*   [ ] Visual cues (Pulse rate, Glow) primarily communicate state.
