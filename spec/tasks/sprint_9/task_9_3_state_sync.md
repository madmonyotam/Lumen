# Task 9.3: State Synchronization (Postgres)

## Overview
Currently, Lumen's state is persisted locally (via JSON files or memory). We need to shift this to save and restore from the new PostgreSQL `lumens` table.

## Owner
*   **Fullstack (Backend Lead & Frontend Lead)**

## Requirements

### 1. Backend Persistence Sync
*   **TemporalEngine / LifeCycleService Update:** Instead of saving to a local `life_status.json`, the state must be written to the `lumens` table for the respective `user_id`.
*   Establish a mechanism to load a user's active Lumen state into memory (Redis or local memory cache) when the user logs in or establishes a Socket connection.
*   When state changes occur (birth, decay, time ticks), update the Postgres `state` JSONB field and `last_updated` column.

### 2. Efficient Write Strategy
*   Continuous saves (e.g., every biometric pulse) to the DB would be expensive.
*   Implement a saving mechanism that caches frequent changes in Redis or memory, and flushes to PostgreSQL periodically or on critical events (e.g., connection close, birth, death, significant personality shift).

## Acceptance Criteria
- [ ] Lumen's state natively saves to the database.
- [ ] When a user reconnects after a server restart, their specific Lumen state loads correctly.
- [ ] Multi-tenant isolation is respected (User A does not see User B's Lumen state).
