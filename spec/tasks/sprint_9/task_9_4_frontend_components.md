# Task 9.4: Frontend Authentication & UI Components

## Overview
Implement the user-facing side of authentication using Firebase, and update the UI to include a persistent header and profile management.

## Owner
*   **Frontend Lead**

## Requirements

### 1. Firebase Auth Client Integration
*   Initialize the Firebase client SDK in the React app (`apps/web`).
*   Implement the "Sign in with Google" flow.
*   Securely store and manage the Firebase Auth session state.

### 2. Auth Guard Component
*   Create a Higher-Order Component (HOC) or wrapper (`<AuthGuard />`) that monitors authentication state.
*   If unauthenticated, redirect to a Login view or show the "Sign in with Google" button overlay.
*   Pass the authentication token securely to all API and Socket.io requests.

### 3. Persistent Header Component
*   Build a global `<Header />` component visible across the app.
*   **Left/Center:** Application branding (LUMEN logo).
*   **Right (Profile Section):**
    *   User's Google Profile Picture (`UserAvatar` component).
    *   Display Name.
    *   A dropdown menu triggered by clicking the avatar.
    *   **Logout Button** inside the dropdown.

## Acceptance Criteria
- [ ] Users can sign in using Firebase Google Auth.
- [ ] The core Lumen interface is protected behind the Auth Guard.
- [ ] Header displays correct user information.
- [ ] Logging out successfully redirects to the login screen and clears the session.
