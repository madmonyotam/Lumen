# System Engineering Prompt: Implementing Multi-Tenancy for Lumen

### Context & Goal

We are transitioning the **Lumen** application from a single-user local state to a multi-tenant architecture. The goal is to allow users to authenticate via **Firebase Google Auth**, manage their unique Lumen persona, and store long-term semantic memory.

### Technical Stack

* **Frontend:** React (Expert level implementation).
* **Authentication:** Firebase Auth (Google Provider).
* **Primary Database:** PostgreSQL (Relational data + `pgvector` for embeddings).
* **State Management:** Syncing local Lumen state with Postgres.

### System Architecture Requirements

**1. Database Schema (PostgreSQL):**

* **Users Table:** `id` (Firebase UID), `email`, `display_name`, `photo_url`, `settings` (JSONB for UI preferences like language/theme).
* **Lumens Table:** `id`, `user_id` (FK), `state` (JSONB for the persona object: traits, internal, strengths, etc.), `is_alive`, `last_updated`.
* **Memories Table (Vector):** `id`, `lumen_id` (FK), `content` (text), `embedding` (vector type), `metadata` (JSONB). **Must enforce Row Level Security (RLS)** or strict filtering by `user_id` to prevent cross-talk.

**2. Authentication Flow:**

* Implement Firebase Google Sign-In.
* On first login: Create a new User record and initialize a default Lumen persona.
* On subsequent logins: Fetch the latest Lumen state and user configuration.

**3. UI/UX - Main Header:**

* Implement a persistent **Header** component across the main app.
* **Left/Center:** Application branding.
* **Right:** User Profile section containing:
* User's Google profile picture (Avatar).
* Display name.
* A dropdown menu with a **Logout** button.


* Conditional rendering: If not authenticated, show "Sign in with Google".

### Tasks for Sprint Definition

Please break this down into actionable Jira/Linear tasks, including:

1. **Backend/DB:** Schema migration for `pgvector` and RLS policies.
2. **Auth Service:** Firebase integration and token validation on the backend.
3. **State Sync:** Logic to persist the existing JSON state to Postgres on changes.
4. **Frontend Components:** Header, UserAvatar, and Auth Guard higher-order component.
5. **API/DAO:** Functions for saving/retrieving embeddings filtered by `user_id`.
