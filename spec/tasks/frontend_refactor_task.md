# Frontend Refactoring Task: Architecture & UI/UX Overhaul

## Overview
This task outlines a comprehensive refactoring of the frontend application to align with the core technical principles defined in `spec/frontend_lead.md`. The goal is to achieve production-grade, high-performance, and maintainable code with a strong emphasis on UI/UX, built on React, TypeScript, and Data Visualization (D3.js).

## Phase 1: Architecture & Structural Refactoring
- [x] **Smart vs. Dumb Component Separation:**
  - Audit existing components.
  - Refactor to strictly separate **Smart Containers** (handling logic, state, data fetching, hooks) from **Dumb Components** (purely presentational, receiving props only).
- [x] **Logic Extraction:**
  - Move stateful logic and side-effects out of components and into **Reusable Custom Hooks**.
  - Relocate pure logic and calculations to standalone `utils` functions to improve testability and reuse.
- [x] **Configuration-Driven Components:**
  - Update complex components to be configuration-driven, using configuration objects/values for flexible behavior.

## Phase 2: Styling System & Layout Strategy
- [x] **Styled-Components Migration & Strictness:**
  - Ensure `styled-components` is used *exclusively* across the frontend. Remove inline styles, CSS modules, or other styling paradigms if present.
  - **Layout-First Approach:** Stabilize structure and layout using styled components before implementing detailed styling.
- [x] **Theme System implementation:**
  - Implement/Refine the global **Theme** system for sizes, spacing, typography, and colors.
  - Establish a two-layer **Color Architecture**:
    - `Palette`: Base hex codes.
    - `Usage/UI`: Semantic tokens (e.g., `primary`, `background`, `error`).

## Phase 3: Responsive Strategy & Split-Rendering
- [x] **Strict Split-Rendering:**
  - Audit current responsive implementations (media queries).
  - Implement a `useMobile` hook.
  - Where necessary/complex, use the strict split-rendering approach to yield completely different component trees for Web vs. Mobile experiences.

## Phase 4: Performance Optimization
- [x] **Re-render Optimization:**
  - Audit the application using React Profiler.
  - Strategically apply `React.memo`, `useCallback`, and `useMemo` to minimize unnecessary re-renders.
- [x] **Component Granularity:**
  - Break down large components into small, focused, and "atomic" pieces to limit the blast radius of state updates.

## Phase 5: Motion & Visualization Refinement
- [x] **Smooth UI Interactions:**
  - Audit UI transitions and interactions.
  - Implement **Framer Motion** for all standard UI animations to guarantee butter-smooth transitions.
- [x] **Data Visualization:**
  - Ensure any complex data visualizations and mathematical layouts exclusively leverage **D3.js**.
  - Optimize D3 integrations inside React for performance.
