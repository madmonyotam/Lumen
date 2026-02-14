# Task: Cognitive Differentiation (Thought vs. Interaction)

## Context
Separate the cognitive flow into two distinct loops: varied internal thoughts and direct user interactions.

## Requirements
### 1. Thought Loop (Internal)
*   **Trigger:** Automated interval (e.g., every 30s).
*   **Nature:** Private, internal processing. Lumen talking to itself about its state or the user.
*   **Input:** Current biometric state + Random existing memory.
*   **Output:** A "Thought" log.
*   **Effect:** Creates memories with **Lower Importance** (0.1 - 0.3).

### 2. Interaction Loop (External)
*   **Trigger:** User Input (Messages).
*   **Nature:** Direct, high-focus communication.
*   **Input:** User message + Biometrics + Retrieved Memories.
*   **Output:** A direct response to the user.
*   **Effect:** Creates memories with **High Importance** (0.7 - 1.0).

## Acceptance Criteria
*   [ ] `server.ts` has two distinct interval/event handlers.
*   [ ] `GeminiService` methods distinguished: `generateThought()` vs `generateResponse()`.
*   [ ] Memory creation logic assigns different `importance` scores based on the source.
