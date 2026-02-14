# Task: Mortality Logic (Terminus Protection)

## Context
Ensure that death is absolute. No processing should occur after the organism has died.

## Requirements
*   **Guardrails:**
    *   Add checks (`if (vitality <= 0)`) at the entry point of:
        *   Thought Loop
        *   Interaction Loop
        *   Memory Consolidation
*   **State:**
    *   When Dead: Freezing all state. No new memories. No new thoughts. System becomes read-only / static.

## Acceptance Criteria
*   [ ] Verify `isAlive` or `vitality > 0` before triggering AI.
*   [ ] Verify no DB writes (Memory) occur after death event.
