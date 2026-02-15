# Task: Memory Fog Visualization (Frontend) - Sprint 7

## Goal
Create a "Semantic Fog" visualization using D3.js where keywords drift, fade, and interact organically, replacing the old particle system.

## Technical Details

### 1. Component: `MemoryFog.tsx`
- Replace existing `AbsoluteFill` / Particle system.
- Utilize `d3-force` or similar for organic movement.
- **Drift Logic:** Elements should float with Brownian motion (random walk), not static or linear paths.
- **Constraints:** Prevent aggressive overlapping using collision detection or repulsion forces.

### 2. Life Cycle (The 60s Rule)
- **TTL:** Each keyword has a strict 60-second lifespan.
- **Fade-In:** Smooth opacity transition on entry.
- **Fade-Out:** Gradual disappearance before removal at 60s.

### 3. Visual Mapping
- **Scale:** Font size correlates with Memory `importance` (high importance = larger text).
- **Opacity:** Older memories (relative to `timestamp`) are more transparent.
- **Blur:** Older/Distant memories get a CSS `blur()` filter to simulate depth of field.

### 4. Aesthetics
- "Atmospheric" feel – like particles in a fluid, not data points on a graph.
- Max concurrent words: ~15-20 to prevent clutter.

## Acceptance Criteria
- [ ] New `MemoryFog` component renders keywords from the API.
- [ ] Keywords drift organically and do not overlap significantly.
- [ ] Keywords fade out and are removed after exactly X (config value - default 60) seconds.
- [ ] Visual hierarchy (Size/Opacity/Blur) correctly reflects memory metadata.
