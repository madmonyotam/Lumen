# Task: Memory Reconsolidation (Living Memory)

## Context
Implement the "Drift" mechanism where accessing a memory changes it.

## Requirements
*   **Process:**
    1.  **Retrieve:** Fetch memory by ID.
    2.  **Mutate:** Pass memory through `GeminiService` with current context. Request a slight "rewording" or "shift in perspective" based on current Mood.
    3.  **Reinforce:** Update the memory in the DB (Upsert).
        *   **Boost Strength:** Increase `Strength` significantly (e.g., +0.25).
        *   **Update Content:** Save the mutated text.
*   **Rule:** A memory visited is a memory saved (stronger), but altered (drifted).

## Acceptance Criteria
*   [ ] `MemoryService` implements `reconsolidateMemory(id, currentContext)`.
*   [ ] Recalled memories show increased `Strength` in the DB.
*   [ ] Recalled memories show slight text variations over time.
