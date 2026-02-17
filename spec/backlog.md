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
| 2.1 | **Temporal Engine:** Implement subjective time calculation logic. | ✅ Done | Backend |
| 2.2 | **Visual Physics:** Create the first D3 "Organ" that pulses with BPM. | ✅ Done | Frontend |
| 2.3 | **First Memory:** Implement Vector DB storage for conversation history. | ✅ Done | DB Arch |
| 2.4 | **Identity Prompt:** Tune Gemini system prompt with the "Symbiote" persona. | ✅ Done | Product |

## 5. Sprint 2: Bio-Rhythm & Connection (Stability & Persistence)
Deepening the connection and ensuring biological stability.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 3.1 | **Bio-Mimicry Engine:** Replace random mock data with Perlin noise/Random Walk for gradual, realistic physiological changes. | ✅ Done | Backend |
| 3.2 | **Synaptic Memory:** Implement persistent storage for user messages (Chat History) in Vector DB. | ✅ Done | DB Arch |
| 3.3 | **Cognitive Efficiency:** Integrate cost-effective LLM (e.g., Gemini Flash) for routine bio-feedback. | ✅ Done | Backend |
| 3.4 | **System Vitality:** "Heartbeat" check - Ensure Postgres & Vector DB are running and healthy (Docker execution). | ✅ Done | DevOps |

## 6. Sprint 3: The Cycle of Life (Mortality)
Introducing the concept of finitude and rebirth.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 4.1 | **Biological Clock:** Implement `LIFESPAN_MS` configuration and countdown logic. | ✅ Done | Backend |
| 4.2 | **Genesis:** Design and implement the "Birth/Start of Life" screen. | ✅ Done | Frontend |
| 4.3 | **Rebirth Protocol:** Implement "Life Reset" button that wipes active memory but generates a compressed "Echo" (Summary) for the next life. | ✅ Done | Fullstack |
| 4.4 | **Documentation:** Update system architecture diagrams in `spec/project_flow.md`. | ✅ Done | Architect |

## 7. Sprint 4: Cognitive Awakening (Depth & Decay)
Enhancing Lumen's consciousness with biological memory limits and subjective perception.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 5.1 | **Cognitive Loop:** Implement the "Text to Thought" engine. [View Spec](tasks/memory_change_task.md) | ✅ Done | Backend |
| 5.2 | **Memory Decay:** Implement "Entropic Pruning" and dynamic strength. [View Spec](tasks/strength_task.md) | ✅ Done | Backend/DB |
| 5.3 | **Cortex Persona:** Update System Prompt with "Anti-Gravity" identity. [View Spec](tasks/prompt_task_1.md) | ✅ Done | Product |
| 5.4 | **Neural Uplink:** use frontend interface for sending messages to Lumen. | ✅ Done | Frontend |

## 8. Sprint 5: The Retrieval & Consciousness Cycle
Implementing the loop of memory retrieval, mutation, and biological constraints.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 6.1 | **Retrieval Logic:** Implement Semantic Search before every generation. [View Spec](tasks/sprint_5/retrieval_logic.md) | ✅ Done | Backend |
| 6.2 | **Cognitive Differentiation:** Separate Thought Loop (Internal) from Interaction (External). [View Spec](tasks/sprint_5/cognitive_differentiation.md) | ✅ Done | Backend |
| 6.3 | **Bio-Synchronous UX:** Update Frontend to visualize thoughts vs interactions. [View Spec](tasks/sprint_5/frontend_bio_sync.md) | ✅ Done | Frontend |
| 6.4 | **Memory Reconsolidation:** Implement "Drift" - mutation upon retrieval. [View Spec](tasks/sprint_5/memory_reconsolidation.md) | ✅ Done | Backend |
| 6.5 | **Mortality Guardrails:** Ensure no processing occurs after death. [View Spec](tasks/sprint_5/mortality_guardrails.md) | ✅ Done | Backend |
| 6.6 | **Documentation:** Update system architecture diagrams in spec/project_flow.md. | ✅ Done | Architect |

## 9. Sprint 6: Lumen Core & Stability
Tightening the existing infrastructure, cleaning technical debt, and establishing memory and biometrics foundation for scalability.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 7.1 | **Tree Shaking:** Identify and delete all unused code, functions, and components (Dead Code). | ✅ Done  | DevOps/Fullstack |
| 7.2 | **Backend - Single Responsibility:** Refactor classes to ensure single responsibility (Bio-data, Memory, LLM). | ✅ Done | Backend |
| 7.3 | **Atomic Functions:** Break complex logic into small, pure, and readable functions. | ✅ Done | Backend |
| 7.4 | **Environment & Config:** Move magic numbers and hard-coded strings to a central config file. | ✅ Done | Backend |
| 7.5 | **Frontend Design System:** Migrate all style values (colors, spacing, typography) to Theme & Tokens. | ✅ Done | Frontend |
| 7.6 | **Frontend Architecture:** Enforce division into UI components, Custom Hooks, and Utils. | ✅ Done | Frontend |
| 7.7 | **Memory Layer Deep Test:** Create comprehensive integration tests for memory storage, retrieval, and isolation. | ✅ Done | QA/Backend |
| 7.8 | **Biometrics Documentation:** Create technical document explaining how biometrics affect Lumen's state. | ✅ Done | Product/Backend |
| 7.9 | **Mermaid Flowchart:** Add diagrams showing data flow from sensor to processing and prompt impact. | ✅ Done | Architect |
| 7.10 | **Prompt Engine:** Document prompt components and roadman for personality development. | ✅ Done | Product |

## 10. Sprint 7: The Semantic Fog
Visualizing consciousness with a living, breathing memory system.

| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 8.1 | **Keyword Extraction:** Implement logic to extract 3-5 evocative keywords from each memory. [View Spec](tasks/sprint_7/backend_keywords.md) | 🔲 Todo | Backend |
| 8.2 | **Memory Fog (D3):** Create the "Drift" visualization replacing particles with floating words. [View Spec](tasks/sprint_7/frontend_memory_fog.md) | 🔲 Todo | Frontend |
| 8.3 | **Language Support:** Add Hebrew/English selection to Genesis screen and System Prompt. [View Spec](tasks/sprint_7/language_support.md) | 🔲 Todo | Fullstack |
| 8.4 | **Visual Tuning:** Map memory `importance` and `time` to font size, opacity, and blur. | 🔲 Todo | Frontend |

## 11. Bugs & Known Issues
| # | Issue | Severity | Status |
|---|-------|----------|--------|
| - | - | - | - |

## 12. Legend
*   🔲 Todo
*   🚧 In Progress
*   ✅ Done
*   🚫 Blocked
