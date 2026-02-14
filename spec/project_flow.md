# Lumen Project Flow & Architecture

## 1. System Overview
Lumen is a digital organism that evolves based on real-time biometric data. It features a hybrid intelligence system with a "Reflex" loop for immediate, visceral reactions and a "Cortex" loop for deep, introspective thought.

```mermaid
graph TD
    User((User/Garmin)) -->|Bio-Data| Server[Node.js Server]
    Server -->|WebSockets| Client[React Frontend]
    
    subgraph "Nervous System (Backend)"
        Garmin[Garmin Service]
        Temporal[Temporal Engine]
        Memory[Memory Service]
        Gemini[Gemini AI]
    end
    
    subgraph "Brain (AI)"
        Reflex["Reflex Model <br> (Fast/Visuals)"]
        Cortex["Cortex Model <br> (Slow/Thoughts)"]
    end
    
    subgraph "Storage"
        PG[(Postgres DB)]
        Vector[(pgvector)]
    end

    Server --> Garmin
    Garmin --> Temporal
    Temporal --> Client
    
    Server --> Gemini
    Gemini --> Reflex
    Gemini --> Cortex
    
    Cortex --> Memory
    Memory --> Vector
```

## 2. Bio-Data Ingestion Flow
How the system processes raw biological signals into digital organ state.

```mermaid
sequenceDiagram
    participant Garmin as Garmin Watch
    participant Service as GarminService
    participant Engine as TemporalEngine
    participant Socket as Socket.IO
    participant Client as Frontend (OrganismView)

    loop Every 1s (Biological Clock)
        Service->>Garmin: Fetch Heart Rate/Stress
        Garmin-->>Service: Return Bio-Data (BPM, HRV)
        
        Service->>Engine: Calculate Subjective Time
        Engine->>Engine: Update Organ State
        
        Engine->>Socket: Emit 'lumen-pulse'
        Socket->>Client: Update Visuals (D3)
    end
```

## 3. Hybrid Intelligence Architecture
The tri-loop system handling reflexes, deep cognition, and direct interaction.

```mermaid
sequenceDiagram
    participant ServerLoop as Server (Loops)
    participant API as API (/chat)
    participant Gemini as GeminiService
    participant Memory as MemoryService
    participant Client as Frontend

    par Reflex Loop (Fast - 5s)
        ServerLoop->>Gemini: Generate Reflex (Color/Mood)
        Gemini-->>ServerLoop: Return Visual Params
        ServerLoop->>Client: Emit 'lumen-pulse' (Visuals)
    and Thought Loop (Slow - 30s)
        ServerLoop->>Memory: Retrieve Memories (Drift)
        ServerLoop->>Gemini: Generate Internal Thought
        Gemini-->>ServerLoop: Return Thought
        ServerLoop->>Memory: Store Thought (Low Importance)
        ServerLoop->>Client: Emit 'lumen-pulse' (Thought)
    and Interaction Loop (Event Driven)
        Client->>API: User Message
        API->>Memory: Retrieve Memories (High Relevance)
        API->>Gemini: Generate Cognitive Response
        Gemini-->>API: Return Response
        API->>Memory: Store Interaction (High Importance)
        API->>Client: Update Chat History
    end
```

## 4. Memory Reconsolidation Cycle
How the organism remembers and modifies its past (Drift).

```mermaid
graph TD
    Trigger[Input/Thought] -->|1. Search| DB[(Vector DB)]
    DB -->|2. Retrieve| Memory[Old Memory]
    Memory -->|3. Perceive| Context[Current Emotional State]
    Context -->|4. Mutate| Gemini[Cortex Mutation]
    Gemini -->|5. Rewrite| ModifiedMemory[Drifted Memory]
    ModifiedMemory -->|6. Reinforce| DB
    style ModifiedMemory fill:#f9f,stroke:#333,stroke-width:2px
```

## 5. Life Cycle & Resurrection
How the organism manages its finitude and rebirth.

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Server as Server
    participant Engine as TemporalEngine
    participant DB as Vector DB

    Note over Client, DB: Life In Progress
    Server->>Engine: Calculate subjective time
    Engine->>Engine: Check Mortality (Age > Lifespan)
    Engine-->>Server: Return isAlive: false
    Server->>Client: Emit 'lumen-pulse' (isAlive: false)
    Client->>Client: Display GenesisScreen

    Note over Client, DB: Resurrection (Genesis)
    Client->>Server: POST /api/genesis (Name, Traits, etc.)
    Server->>Engine: reborn()
    Server->>DB: wipeMemories()
    Engine->>Engine: Reset Time & Age
    Server-->>Client: Success Status
    Client->>Client: Display OrganismView (Generation N+1)
```
