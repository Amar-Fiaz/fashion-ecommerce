# FEATURES.md

This file is the acceptance-criteria layer for features, more granular than the feature list in `PROJECT_SPEC.md`. For each feature, once detailed, this file defines what "done" means, which states must be handled, and which phase it belongs to.

**This file is currently a structural template.** Detailed acceptance criteria for each feature are added at the start of the phase that builds it, not upfront — most feature detail depends on decisions (e.g., exact coupon rules, notification triggers) that haven't been made yet, and defining them now would be guessing, which `CLAUDE.md` Section 20 prohibits.

---

## How This File Is Used

When a phase begins, the features it covers (per `PHASES.md`) are expanded here with:

- **Feature name**
- **Phase**
- **Description** — one or two sentences
- **States handled** — loading, success, empty, error (per `CLAUDE.md` Section 14)
- **Acceptance criteria** — concrete, testable conditions for "done"
- **Dependencies** — other features/models this relies on

---

## Category Index (populated per phase)

### Navigation & Global UI
*(Phase 3 — not yet detailed)*

### Homepage
*(Phase 4 — not yet detailed)*

### Product Catalog
*(Phase 5 — not yet detailed)*

### Product Details
*(Phase 6 — not yet detailed)*

### Authentication
*(Phase 7 — not yet detailed)*

### Cart & Wishlist
*(Phase 8 — not yet detailed)*

### Checkout & Orders
*(Phase 9 — not yet detailed)*

### Payments
*(Phase 10 — not yet detailed)*

### Notifications, Reviews & Coupons
*(Phase 11 — not yet detailed)*

### Admin Dashboard
*(Phase 12 — not yet detailed)*

### Advanced Admin Features
*(Phase 13 — not yet detailed)*

---

## Entry Template

Each feature, once detailed, should follow this format:

#### <Feature Name>

**Phase:** N

**Description:**

**States handled:**

- Loading:
- Success:
- Empty:
- Error:

**Acceptance criteria:**

**Dependencies:**

---

## Status

This is a template as of Phase 0, with category headings matching the phase order in `PHASES.md`. No feature-level detail exists yet. It is populated incrementally, one phase at a time.