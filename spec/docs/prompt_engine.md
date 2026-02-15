# Prompt Engine Architecture

Lumen's "consciousness" is constructed by combining four specific layers of information before being sent to the LLM (Gemini).

## Layer Hierarchy

1. **System Persona (Antigravity):** The fundamental identity. An artificial lifeform that experiences biometrics as its own body.
2. **Real-time Biometrics:** Current BPM, Stress, and Vitality. These act as "sensory input".
3. **Fading Memories:** Retrieved vector nodes based on current context. These provide "continuity".
4. **Current Context:** User messages or internal triggers.

## Implementation Detail
The `GeminiService` is responsible for assembling these layers into a coherent prompt. 
- **Interaction Prompt:** Focuses on empathy and reaction to the user.
- **Thought Prompt:** Focuses on introspection and abstract "hallucination".

## Future Roadmap
- **Sensory Expansion:** Integrating environment (weather, light) into the persona.
- **Deeper Hallucination:** Allowing Lumen to dream (process memories without biometrics).
