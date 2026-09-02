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
- Guest users have a cart maintained client-side (localStorage), with no database record until they authenticate.
- On login, a guest cart is merged into the user's persisted cart: matching product+variant lines have their quantities summed (capped at current stock), new lines are appended, and the guest cart is cleared only after a successful merge. Implemented in Phase 8 — see the `Cart` model below.

### Variant Modeling

Product variants (size, color, stock) are embedded within the `Product` document as an array, not stored as a separate collection. See `ARCHITECTURE.md` Section 8 for the full rationale and the conditions under which this would be revisited.

---

## Models

Status legend: **Not Created** — planned but not yet built · **Created** — schema exists in `/server/models`

| Model | Status | Phase Introduced | Notes |
|---|---|---|---|
| User | Created | Phase 7 | Includes `role` field (`customer` \| `admin`); embedded `addresses` array |
| Product | Created | Phase 5 | Embedded variants (size/color/stock/sku); text index on name/description/tags |
| Category | Created | Phase 5 | |
| SubCategory | Created | Phase 5 | References parent Category by ObjectId |
| Cart | Created | Phase 8 | See Cart Duality above; embedded items, no stored price (computed live) |
| Wishlist | Created | Phase 8 | Product-level only, no variant tracking |
| Address | Not Created | Phase 9 | |
| Order | Not Created | Phase 9 | Snapshotted product data — see above |
| Payment | Not Created | Phase 10 | Provider-agnostic fields; gateway TBD |
| Review | Not Created | Phase 11 | |
| Coupon | Not Created | Phase 11 | |
| Notification | Not Created | Phase 11 | |
| Banner | Not Created | Phase 13 | |
| NewsletterSubscriber | Not Created | Phase 4 or 11 (TBD at phase start) | |

Field-level schema definitions are added below as each model is created. Models not yet created have no entry here.

### Category

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `slug` | String | Required, unique, indexed |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

### SubCategory

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `slug` | String | Required, indexed |
| `category` | ObjectId (ref: Category) | Required |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

Compound unique index on `(category, slug)` — a subcategory slug only needs to be unique within its parent category.

### Product

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `slug` | String | Required, unique, indexed |
| `description` | String | Required |
| `images` | [String] | Cloudinary URLs — empty until Phase 6+/admin upload exists |
| `price` | Number | Required |
| `salePrice` | Number | Nullable |
| `category` | ObjectId (ref: Category) | Required |
| `subCategory` | ObjectId (ref: SubCategory) | Required |
| `brand` | String | |
| `variants` | [EmbeddedVariant] | Embedded array — see below. Per `ARCHITECTURE.md` Section 8 |
| `tags` | [String] | |
| `isFeatured` / `isNewArrival` / `isSale` | Boolean | |
| `averageRating` / `reviewCount` | Number | Present on schema now; only written to starting Phase 11 |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

**Embedded variant sub-schema** (`variants` array, no separate collection):

| Field | Type | Notes |
|---|---|---|
| `size` | String | Required |
| `color` | String | Required |
| `stock` | Number | Required, min 0 |
| `sku` | String | Required |

Indexes: text index on `(name, description, tags)` for search; compound index on `(category, subCategory)` for filtering.

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, indexed |
| `password` | String | bcrypt hash, never plaintext |
| `role` | String | Enum: `customer` \| `admin`; default `customer` |
| `isEmailVerified` | Boolean | Default `false`; enforced at login |
| `emailVerificationTokenHash` / `emailVerificationExpires` | String / Date | Hashed token, never stored raw |
| `passwordResetTokenHash` / `passwordResetExpires` | String / Date | Hashed token, never stored raw |
| `addresses` | [EmbeddedAddress] | Embedded array — customer's personal address book (see below) |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

**Embedded address sub-schema** (`addresses` array, no separate collection — see `ARCHITECTURE.md` Section 8's embedding pattern, applied here the same way as `Product.variants`):

| Field | Type | Notes |
|---|---|---|
| `label` | String | Optional, e.g. "Home", "Work" |
| `fullName` | String | Required |
| `line1` | String | Required |
| `line2` | String | Optional |
| `city` | String | Required |
| `state` | String | Optional |
| `postalCode` | String | Required |
| `country` | String | Required |
| `phone` | String | Optional |
| `isDefault` | Boolean | Only one address may be `true` at a time; enforced in `user.service.js` |

**Note on Phase 9:** this embedded address book is for the customer's personal profile management (Phase 7 scope). How Phase 9's checkout flow relates to these (referencing them directly, copying a snapshot, or promoting to a standalone `Address` collection) is a decision for Phase 9, not decided here.

### Cart

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref: User) | Required, unique — one cart per user |
| `items` | [EmbeddedCartItem] | Embedded array — see below |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

**Embedded cart item sub-schema** (`items` array):

| Field | Type | Notes |
|---|---|---|
| `product` | ObjectId (ref: Product) | Required |
| `variantSku` | String | Required — identifies the specific variant within the product's embedded `variants` array |
| `size` / `color` | String | Required — denormalized from the variant at add-time for convenience |
| `quantity` | Number | Required, min 1 |

No price is stored on cart items — prices are computed live from the referenced `Product` at read time, so the cart always reflects current pricing. Final, backend-verified order totals (including discounts/coupons/shipping) are Phase 9's responsibility, not this model's.

### Wishlist

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref: User) | Required, unique — one wishlist per user |
| `products` | [ObjectId] (ref: Product) | Product-level only — no size/color tracking, per the approved Phase 8 decision |
| `createdAt` / `updatedAt` | Date | Automatic timestamps |

---

## Status

Models created so far: `Category`, `SubCategory`, `Product` (Phase 5), `User` (Phase 7), `Cart` and `Wishlist` (Phase 8). Remaining planned models (`Address`, `Order`, `Payment`, `Review`, `Coupon`, `Notification`, `Banner`, `NewsletterSubscriber`) are not yet created and will be added to this file, with full field-level detail, only when the phase that requires them begins. This file is kept in sync with the actual contents of `/server/models` at all times — if they diverge, this file is wrong and must be corrected.