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
The dual-loop system handling both immediate reflexes and deep cognition.

```mermaid
sequenceDiagram
    participant ServerLoop as Server Loop
    participant Gemini as GeminiService
    participant Memory as MemoryService
    participant DB as Vector DB
    participant Visuals as Client Visuals

    par Reflex Loop (Fast - 5s)
        ServerLoop->>Gemini: Generate Reflex (Color/Mood)
        Gemini-->>ServerLoop: Return Visual Params
        ServerLoop->>Visuals: Update Colors/Atmosphere
    and Cortex Loop (Slow - 30s)
        ServerLoop->>Gemini: Generate Thought (Context: BPM, Stress)
        Gemini-->>ServerLoop: Return Philosophical Thought
        
        ServerLoop->>Memory: Encode & Store Thought
        Memory->>DB: Save Embedding
        
        ServerLoop->>Visuals: Display Quote
    end
```

## 4. Memory Formation & Retrieval
How the organism remembers past states and thoughts.

```mermaid
graph LR
    Input[New Thought] -->|Embedding| NativeVector[Vector Representation]
    NativeVector -->|Similarity Search| DB[(pgvector)]
    DB -->|Retrieve| Context[Relevant Past Memories]
    Context -->|Augment| Prompt[New Prompt]
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
