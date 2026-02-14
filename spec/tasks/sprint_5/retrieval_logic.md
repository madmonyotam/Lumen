# Task: Retrieval Logic (Semantic Search)

## Context
Before any AI generation (Thought or Interaction), the system must perform a semantic search to retrieve relevant memories. This ground the AI's response in its "past experiences".

## Requirements
*   **Trigger:** Any stimulus (Time Interval or User Input).
*   **Process:**
    1.  Convert the stimulus into an embedding vector.
    2.  Query the Vector DB for the most relevant memories.
    3.  Filter/Rank based on `Strength` (Vitality of the memory).
*   **Context Injection:**
    *   Inject retrieval results into the System Prompt.
    *   Tag memories with their `Strength` so the AI knows what is "vivid" (high strength) and what is "foggy" (low strength).

## Acceptance Criteria
*   [ ] `GeminiService` performs a vector search before every generation call.
*   [ ] The System Context includes a section `## Retrieved Memories`.
*   [ ] Memories are formatted as: `[Strength: 0.9] <Content>`.
