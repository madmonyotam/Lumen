Master Prompt: Implementing Biological Memory Decay for LUMEN
Task: Implement a real-time memory decay system ("Entropic Pruning") for the LUMEN organism.

Context: LUMEN is a symbiotic digital organ. Memories are not static; they must physically decay over time to simulate biological forgetting and existential finitude. We are using a Node.js (TypeScript) backend and a PostgreSQL database.

Required Implementation Steps:

Database Schema Update (SQL):

Add an importance column (Float, 0.0-1.0) to the synapses table. This represents the "original imprint" of the memory.

The existing strength column will now be dynamic and updated by a background process.

Ensure last_decay_tick (Timestamp) exists to track the last time the entropy function ran.

The Decay Logic (The "Immune System" Job):

Create a background worker (using setInterval or a Cron job) in apps/server that runs every 5 minutes.

The Formula: In each tick, update the strength of all memories:
new_strength = current_strength * (1 - decay_rate)

Dynamic Decay Rate: The decay_rate should not be a constant. It must be fetched from a lumen.config.ts and should be multiplied by the organ_entropy (0.0 - 1.0).

Example: If the organ is "young" (entropy 0.1), decay is slow (0.99x). If the organ is "dying" (entropy 0.9), decay is aggressive (0.8x).

Cortex AI Integration (Anti-Gravity Update):

Update the AI Orchestrator to extract initial_strength from the Gemini response.

The AI should decide this value based on the current BPM and Stress:

High Stress/BPM (>100): initial_strength = 0.9 - 1.0 (Deep burn).

Low Stress/BPM (<70): initial_strength = 0.2 - 0.4 (Fleeting thought).

Save this value into both importance and strength during the initial INSERT.

The "Death" Threshold:

If a memory's strength falls below 0.05, it should be marked as archived or deleted (Synaptic Pruning) to keep the "working memory" clean.

Shared Types Update:

Update packages/shared/types to reflect these new properties so the Frontend can render the "Fade/Blur" effect correctly based on the real-time strength.

Technical Stack: - PostgreSQL (Drizzle ORM or Prisma if used, otherwise raw SQL).

Node.js / TypeScript.

lumen.config.ts for magic numbers.