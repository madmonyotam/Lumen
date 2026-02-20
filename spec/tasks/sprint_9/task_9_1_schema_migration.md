# Task 9.1: Database Schema Migration & RLS

## Overview
As part of the shift to multi-tenancy, we are introducing PostgreSQL for relational data and `pgvector` for embeddings. We must establish the base tables and enforce strict Row Level Security (RLS) to ensure user isolation.

## Owner
*   **DB Architect:** Schema design and security rules.
*   **Backend Lead:** Application integration and migration execution.

## Requirements

### 1. Schema Definition
Create the following tables in PostgreSQL (e.g., via Supabase or raw SQL migrations):

*   **`users` table:**
    *   `id` (Firebase UID, Primary Key)
    *   `email` (String, Unique)
    *   `display_name` (String)
    *   `photo_url` (String)
    *   `settings` (JSONB): To store UI preferences, such as selected language or theme.

*   **`lumens` table:**
    *   `id` (UUID or Serial, Primary Key)
    *   `user_id` (Foreign Key referencing `users.id`)
    *   `state` (JSONB): The `LumenPersona` object encompassing traits, internal structure, and strengths.
    *   `is_alive` (Boolean)
    *   `last_updated` (Timestamp)

*   **`memories` table (Vector):**
    *   `id` (UUID or Serial)
    *   `lumen_id` (Foreign Key referencing `lumens.id`)
    *   `content` (Text)
    *   `embedding` (Vector type - 3072 or appropriate dimensions)
    *   `metadata` (JSONB): For strength, importance, keywords, origin_mood, etc.

### 2. Row Level Security (RLS)
The **DB Architect** must establish strict RLS policies on all the above tables.
*   A user can only `SELECT`, `INSERT`, `UPDATE`, or `DELETE` records where `user_id` matches their authenticated Firebase UID.
*   For `memories`, the policy must check the `lumen_id` -> `user_id` relationship (or store `user_id` redundantly on the `memories` table for simpler RLS).

## Acceptance Criteria
- [ ] Schema migration files are defined and executable.
- [ ] Tables are created in the database.
- [ ] RLS policies are strictly enforced and tested against unauthorized access attempts.
