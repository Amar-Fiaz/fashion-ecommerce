# DESIGN_SYSTEM.md

This file is the single source of truth for the visual design system. It exists to enforce `CLAUDE.md` Section 9: colors, typography, spacing, border radius, shadows, and component styles must not be changed randomly or inconsistently across the application — they must be defined once, here, and reused everywhere via the Tailwind configuration in `client/tailwind.config.js`.

No component should introduce a color, spacing, radius, or shadow value that isn't defined here.

---

## Visual Direction

Monochrome base (white / neutral grayscale / near-black) with a single accent color used sparingly for calls-to-action and highlights. Minimal, spacious, fashion-focused — per `CLAUDE.md` Section 9.

## Colors

| Token | Value | Usage |
|---|---|---|
| `white` | `#FFFFFF` | Backgrounds |
| `neutral-50` | `#F7F7F7` | Subtle backgrounds, hover states |
| `neutral-200` | `#E5E5E5` | Borders, dividers |
| `neutral-500` | `#8A8A8A` | Secondary/muted text |
| `neutral-800` | `#2B2B2B` | Body text |
| `black` | `#141414` | Headings, primary text, primary button backgrounds |
| `accent` | `#B8935A` | Primary CTAs, highlights, active/selected states |
| `accent-dark` | `#8F6E3E` | Accent hover/pressed states |
| `success` | `#2E7D32` | Success messages/states |
| `error` | `#C0392B` | Error messages, validation, destructive actions |

This is a deliberately minimal palette. New colors are added here only when a real feature genuinely needs one (e.g. a `warning`/`info` semantic color if a future phase requires it) — not added speculatively.

## Typography

- **Font family:** system font stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — no external font file, no added dependency.
- **Type scale:**

| Token | Size | Line Height | Typical use |
|---|---|---|---|
| `text-xs` | 12px | 16px | Captions, fine print |
| `text-sm` | 14px | 20px | Secondary text, labels |
| `text-base` | 16px | 24px | Body text (default) |
| `text-lg` | 20px | 28px | Subheadings |
| `text-xl` | 24px | 32px | Section headings |
| `text-2xl` | 32px | 40px | Page headings |
| `text-3xl` | 40px | 48px | Hero/large display headings |

- **Font weights used:** 400 (regular/body), 500 (medium/labels), 600 (semibold/subheadings), 700 (bold/headings).

## Spacing Scale

No custom spacing scale is defined — Tailwind's default spacing scale is used as-is (e.g. `p-4`, `gap-6`, `mt-8`). Convention: **never use arbitrary spacing values** (e.g. `mt-[13px]`) anywhere in the codebase — only the predefined scale, to keep spacing consistent per `CLAUDE.md` Section 9.

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-none` | 0px | Sharp edges (rare) |
| `rounded-sm` | 4px | Inputs, small elements |
| `rounded-md` | 8px | Buttons, cards |
| `rounded-lg` | 16px | Larger containers, modals |
| `rounded-full` | 9999px | Pills, avatars, circular icons |

## Shadows

| Token | Usage |
|---|---|
| `shadow-sm` | Subtle elevation (cards at rest) |
| `shadow-md` | Medium elevation (dropdowns, hover states) |
| `shadow-lg` | Pronounced elevation (modals, popovers) |

## Button Variants (defined in the next Phase 2 step, as the actual `Button` component)

- **Primary:** `accent` background, `white` text — main call-to-action.
- **Secondary:** `black` or `neutral-800` border, transparent background — secondary actions.
- **Ghost/Tertiary:** no border/background, text-only — low-emphasis actions.
- **Destructive:** `error` background or border — delete/remove actions.
- All variants share the same sizing, radius (`rounded-md`), and disabled-state treatment (reduced opacity, no pointer events).

## Input Variants (defined in the next Phase 2 step, as the actual `Input` component)

- **Default:** `neutral-200` border, `white` background.
- **Focus:** `black` or `accent` border, subtle `shadow-sm`.
- **Error:** `error` border, error message in `error` color below the field.
- **Disabled:** `neutral-50` background, `neutral-500` text, no pointer events.

## Breakpoints

Fixed functional requirements from `CLAUDE.md` Section 8:

- **Mobile:** 360px, 390px, 430px
- **Tablet:** 768px, 1024px
- **Desktop:** 1280px, 1440px, 1920px

---

## Status

Design tokens (colors, typography, spacing convention, radius, shadows) are defined and documented as of Phase 2, Step 1. Button and Input component implementations follow in the next Phase 2 step. This file is binding for all UI work from this point forward — no new color, spacing, radius, or shadow value should be introduced elsewhere without being added here first.