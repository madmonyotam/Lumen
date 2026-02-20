# Task 9.2: Firebase Auth & Token Validation

## Overview
Validate incoming requests from the frontend using Firebase Authentication, and ensure every request has a verified tenant (user).

## Owner
*   **Backend Lead:** Implementation of authentication middleware and user provisioning.
*   **Software Architect:** Authentication flow design and security guarantees.

## Requirements

### 1. Firebase Admin Setup
*   Integrate `firebase-admin` into the Node.js / Express backend.
*   Configure environment variables securely.

### 2. Authentication Middleware
*   Create an Express middleware (or Socket.io middleware) that intercepts requests and validates the Firebase ID token found in the `Authorization: Bearer <token>` header.
*   Attach the decoded Firebase UID to the request object context (e.g., `req.user`).
*   Reject requests with invalid or missing tokens (Status: 401).

### 3. First Login Provisioning
*   Implement a login/sync endpoint (e.g., `POST /api/auth/sync`).
*   If the Firebase UID does not exist in the `users` table:
    *   Create a new user record.
    *   Initialize a default Lumen persona for this user in the `lumens` table.
*   If the user exists, return their configuration and the current status of their Lumen.

## Acceptance Criteria
- [ ] Firebase Admin is configured and working locally.
- [ ] Middleware blocks unauthorized requests.
- [ ] First-time login automatically creates the required User and Lumen DB rows.
