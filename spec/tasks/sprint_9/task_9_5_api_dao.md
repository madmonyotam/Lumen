# Task 9.5: API / DAO Multi-Tenant Upgrades

## Overview
The Memory and Context retrieval systems must absolutely respect multi-tenancy. A user must not retrieve another user's memories. 

## Owner
*   **Backend Lead**

## Requirements

### 1. DAO Retrofit
*   Refactor the `MemoryService` (or equivalent data access objects) to require a `user_id` or `lumen_id` for every operation.
*   `storeMemory()`, `retrieveMemories()`, `decayMemories()`, and `wipeMemories()` must all filter by `user_id`.

### 2. pgvector Transition (If Applicable)
*   If transitioning from Pinecone to `pgvector` entirely, implement the embedding similarity logic (`<=>` operator) in the Postgres queries.
*   Ensure the similarity search query includes `WHERE user_id = $x` logic (or relies on RLS) to prevent crosstalk.

### 3. Security Audit
*   Review all endpoints exposed in `server.ts` to ensure `req.user.uid` is being used correctly in all downstream database calls.

## Acceptance Criteria
- [ ] All memory retrieval successfully scopes to the authenticated user.
- [ ] Cross-user visibility tests are written and pass (User A retrieving memories returns 0 results belonging to User B).
