# Task: Keyword Extraction & API Update (Backend) - Sprint 7

## Goal
Extract "semantic shards" (evocative keywords) from memories during retrieval to drive the frontend visualization.

## Technical Details

### 1. Implementation
- **Keyword Extraction Logic:**
  - Create a lightweight mechanism (could be a simple regex/frequency analysis if performance is critical, but ideally a fast LLM call or dedicated extraction logic) to extract 3-5 keywords per memory.
  - Keywords should be "evocative" (e.g., *Gold*, *Stillness*, *Breath*) rather than purely functional.

- **API Response Schema Update:**
  - Update the `Memory` interface and API response to include a `keywords: string[]` field.
  - Ensure this field is populated for both user interactions AND internal thought processes.

### 2. Integration
- **Service Layer:**
  - Modify `MemoryService` or create `KeywordExtractorService` to process text before returning/storing.
  - Since we want this for *retrieved* memories, we should generate these keywords either at storage time (better for performance) or retrieval time (more flexible). Given the requirement for "shards of meaning", storing them alongside the vector embedding makes the most sense.

- **Storage:**
  - Adding a column/field to the Vector DB or Metadata JSON for `keywords`.

## Acceptance Criteria
- [ ] Memories returned via API include a `keywords` array with 3-5 strings.
- [ ] Keywords are extracted for both User Interactions and Thoughts.
- [ ] No significant latency increase (>200ms) on memory retrieval.
