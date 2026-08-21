# DESIGN_SYSTEM.md

This file is the single source of truth for the visual design system, once populated. It exists to enforce `CLAUDE.md` Section 9: colors, typography, spacing, border radius, shadows, and component styles must not be changed randomly or inconsistently across the application — they must be defined once, here, and reused everywhere via the Tailwind configuration.

**This file is currently a skeleton.** Actual token values are defined in Phase 2 — Design System, not in Phase 0. Populating it now would be premature, since no visual direction has been decided yet.

---

## Structure (to be populated in Phase 2)

### Colors
- Primary palette
- Secondary/accent palette
- Neutral/grayscale palette
- Semantic colors (success, error, warning, info)

### Typography
- Font family(ies)
- Type scale (headings, body, captions)
- Font weights used
- Line height rules

### Spacing Scale
- Base unit and scale progression used across margin/padding/gap utilities

### Border Radius
- Defined radius scale (e.g., none/sm/md/lg/full) and where each is used

### Shadows
- Defined elevation scale and where each is used

### Button Variants
- Primary, secondary, tertiary/ghost, destructive, disabled states — sizing and spacing rules

### Input Variants
- Text input, select, checkbox, radio — default/focus/error/disabled states

### Breakpoints

These are functional requirements from `CLAUDE.md` Section 8 and are fixed regardless of visual direction:

- **Mobile:** 360px, 390px, 430px
- **Tablet:** 768px, 1024px
- **Desktop:** 1280px, 1440px, 1920px

---

## Status

This file is a placeholder as of Phase 0. It will be filled in during Phase 2 — Design System, at which point every value defined here becomes binding for all subsequent UI work, per `CLAUDE.md` Section 9. No component should introduce a color, spacing, radius, or shadow value that isn't defined here once Phase 2 is complete.