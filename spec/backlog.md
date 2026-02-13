# Product Backlog: LUMEN

## 1. Spec References
*   [Product Manager](product_manager.md)
*   [Backend Lead](backend_lead.md)
*   [Frontend Lead](frontend_lead.md)
*   [DB Architect](db_architect.md)
*   [QA Lead](qa_lead.md)
*   [DevOps Lead](devops_lead.md)

## 2. Architecture Vision
```ascii
[ User / Garmin ] --(Bio-Data)--> [ Node.js Nervous System ]
                                          |
                                    [ Gemini Cortex ]
                                          |
                                          v
[ React/D3 Bio-Digital Skin ] <--(State)--+--(Memory)--> [ Vector DB ]
```

## 3. Sprint 0: Foundation (The Skeleton)
Establishing the core biological functions and infrastructure.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 1.1 | **Monorepo Setup:** Initialize Turborepo with apps/web, apps/server, packages/shared. | ✅ Done | DevOps |
| 1.2 | **Design System:** Implement `LumenTheme` and basic tokens in Styled Components. | ✅ Done | Frontend |
| 1.3 | **Nervous System:** Setup Socket.io server with "Heartbeat" mechanism. | ✅ Done | Backend |
| 1.4 | **Bio-Ingestion:** Connect to Garmin API and normalize data structure. | ✅ Done | Backend |
| 1.5 | **Docker:** Create `Dockerfile` for server and `docker-compose` for local dev (Redis/PG). | ✅ Done | DevOps |

## 4. Sprint 1: The Awakening (Core Feature)
First conscious response to biometric data.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 2.1 | **Temporal Engine:** Implement subjective time calculation logic. | 🔲 Todo | Backend |
| 2.2 | **Visual Physics:** Create the first D3 "Organ" that pulses with BPM. | 🔲 Todo | Frontend |
| 2.3 | **First Memory:** Implement Vector DB storage for conversation history. | 🔲 Todo | DB Arch |
| 2.4 | **Identity Prompt:** Tune Gemini system prompt with the "Symbiote" persona. | 🔲 Todo | Product |

## 5. Bugs & Known Issues
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| - | - | - | - |

## 6. Future Ideas (Icebox)
*   **Dream Mode:** Visualizations that run when the user is sleeping based on REM cycles.
*   **Voice Synthesis:** Generating a voice that changes pitch based on stress levels.

## 7. Legend
*   🔲 Todo
*   🚧 In Progress
*   ✅ Done
*   🚫 Blocked
