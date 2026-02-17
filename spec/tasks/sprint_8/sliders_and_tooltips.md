# Sprint 8: Sliders & Tooltips Dynamics

## Context
Improve the user experience for OCEAN and Biology sliders by adding real-time feedback and optimizing performance.

## Technical Constraints
- React state management.
- Optimization for drag events.

## Specific Tasks
1.  **Live Tooltip:**
    - Display a tooltip above the slider thumb during drag/change (onDrag/onChange).
    - The tooltip should float and move with the thumb.

2.  **Tooltip Content:**
    - Show the `personaName` corresponding to the current value (e.g., "neuroticism_high", "attachment_secure").

3.  **Persistence Optimization:**
    - Only commit the final value to the central Store/Backend on `onDragEnd`.
    - `onChange` should only update local component state/UI.

## Definition of Done (DoD)
- [ ] Tooltips appear when interacting with sliders.
- [ ] Tooltip content accurately reflects the current value's logical name.
- [ ] Store updates only happen when the user releases the slider handle.
