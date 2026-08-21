# DATABASE.md

This file is the schema registry for the MongoDB/Mongoose database. Per `CLAUDE.md` Section 12, models are created only when required by the current development phase — this file is a living document, not a finished schema design.

Before creating any new model: check this file, confirm the model doesn't already exist, and reuse existing models where appropriate.

---

## Modeling Conventions

These conventions apply to every model created in this project:

- **Naming:** singular, PascalCase model names (e.g., `Product`, not `Products`); camelCase field names.
- **Timestamps:** every model includes `createdAt` and `updatedAt` (Mongoose `timestamps: true`) unless explicitly noted otherwise.
- **Soft delete vs. hard delete:** not yet decided globally — to be determined per-model when that model is created, and recorded here at that time.
- **Indexing:** fields used for filtering, sorting, or lookup (e.g., `slug`, `email`, `sku`) should be indexed at the time the model is created, not retrofitted later.
- **Validation:** schema-level validation (required fields, enums, min/max) lives in the Mongoose schema; request-level validation (shape of incoming data) lives in Zod schemas in the backend `middlewares/` layer. These are complementary, not duplicated logic.

---

## Cross-Cutting Rules

These rules affect multiple models and are recorded here because they are architectural constraints, not implementation details:

### Order Snapshotting

Orders must store a **copy** of product name, price, image, and selected variant details at the time of purchase. Orders must never reference live `Product` documents for this data. This prevents later catalog changes (price updates, product deletion, variant changes) from retroactively altering historical order records.

### Cart Duality

- Authenticated users have a cart persisted in the database (`Cart` model), tied to their user ID.
- Guest users have a cart maintained client-side/session-based, with no database record until they authenticate.
- On login, a guest cart must be merged into the user's persisted cart. Detailed merge behavior is designed at the start of Phase 8, not here.

### Variant Modeling

Product variants (size, color, stock) are embedded within the `Product` document as an array, not stored as a separate collection. See `ARCHITECTURE.md` Section 8 for the full rationale and the conditions under which this would be revisited.

---

## Models

Status legend: **Not Created** — planned but not yet built · **Created** — schema exists in `/server/models`

| Model | Status | Phase Introduced | Notes |
|---|---|---|---|
| User | Not Created | Phase 7 | Includes `role` field (`customer` \| `admin`) |
| Product | Not Created | Phase 5 | Embedded variants |
| Category | Not Created | Phase 5 | |
| SubCategory | Not Created | Phase 5 | |
| Cart | Not Created | Phase 8 | See Cart Duality above |
| Wishlist | Not Created | Phase 8 | |
| Address | Not Created | Phase 9 | |
| Order | Not Created | Phase 9 | Snapshotted product data — see above |
| Payment | Not Created | Phase 10 | Provider-agnostic fields; gateway TBD |
| Review | Not Created | Phase 11 | |
| Coupon | Not Created | Phase 11 | |
| Notification | Not Created | Phase 11 | |
| Banner | Not Created | Phase 13 | |
| NewsletterSubscriber | Not Created | Phase 4 or 11 (TBD at phase start) | |

No field-level schema definitions exist yet for any model. Each model's detailed field list is added to this file when that model is actually created, per `CLAUDE.md` Section 12 — not before.

---

## Status

This is a skeleton document as of Phase 0. It will be populated incrementally as each phase creates its required models. It must be kept in sync with the actual contents of `/server/models` at all times — if they diverge, this file is wrong and must be corrected.