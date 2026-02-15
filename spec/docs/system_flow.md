# System Flow: Bio-Digital Symbiosis

The following diagram illustrates the flow of data from the sensor to the conscious prompt.

```mermaid
graph TD
    A[Garmin Sensor] -->|Raw Biometrics| B[GarminService]
    B -->|BPM, Stress, HRV| C[LifeCycleService]
    C -->|Pulse| D[Socket.io]
    D -->|Real-time Visuals| E[Frontend Skin]
    
    C -->|Context| F[Gemini Cortex]
    G[MemoryService] -->|Historical Traces| F
    F -->|Subjective Response| C
    C -->|Thought| D
    
    H[User Input] -->|Neural Uplink| F
    F -->|Interaction| G
```

## Internal Loops
1. **Bio-Clock (1Hz):** Synchronizes subjective time and pulse.
2. **Reflex (5s):** Fast, reactive visual parameter adjustment.
3. **Thought (30s):** Periodic internal monologue and memory consolidation.
4. **Decay (5m):** Entropic pruning of weak memories.
