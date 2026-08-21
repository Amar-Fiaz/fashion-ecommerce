# ARCHITECTURE.md

This file is the canonical technical decision record for the Fashion E-Commerce Platform. Decisions recorded here are considered final and must not be silently changed. Any change to a decision in this file must be explicitly approved and updated here first.

This file answers **how** the system is built. See `PROJECT_SPEC.md` for **what** is being built.

---

## 1. Repository Structure

Monorepo, single Git repository:

/client   → React + Vite frontend application
/server   → Node.js + Express backend application
/docs     → Project documentation (this file and others)

The client and server are independently runnable applications that communicate only over HTTP APIs. They do not share code, database access, or runtime state.

---

## 2. Frontend Architecture

- **Build tool:** Vite
- **Language:** JavaScript (not TypeScript)
- **Routing:** React Router
- **Structure:** organized by feature/domain (e.g. `features/product/`, `features/cart/`, `features/checkout/`), not by generic file type. Avoids giant, unrelated `components/` and `pages/` dumping grounds.
- **Global client state:** Redux Toolkit — used for UI state and session state that isn't naturally "server data" (auth session, cart UI flags, modals/drawers, wishlist UI state).
- **Server state:** RTK Query — used for all data that originates from the backend (products, categories, orders, etc.), including caching and cache invalidation. Redux Toolkit and RTK Query have a clear boundary: if data comes from an API, it belongs in RTK Query, not duplicated into plain Redux state.
- **Forms:** React Hook Form for all forms, paired with **Zod** for schema validation.
- **Styling:** Tailwind CSS, driven by a centralized design token configuration (see `DESIGN_SYSTEM.md`) rather than ad hoc utility values scattered across components.
- **Responsive targets (mobile-first):**
  - Mobile: 360px, 390px, 430px
  - Tablet: 768px, 1024px
  - Desktop: 1280px, 1440px, 1920px
- **Admin panel:** built inside the same React application under `/admin` routes, lazy-loaded as a separate bundle. No separate frontend application.

---

## 3. Backend Architecture

- **Framework:** Node.js + Express
- **Structure (layered):**

routes/       → route definitions only, no logic
controllers/  → request/response handling
services/     → business logic (pricing, stock validation, order totals, payment orchestration)
models/       → Mongoose schemas
middlewares/  → auth, error handling, validation, role checks
utils/        → helpers (email templates, token generation, etc.)
config/       → DB connection, Cloudinary, environment loading

- All logic involving pricing, stock, discounts, or order totals **must** live in `services/`. Controllers must not compute or trust these values directly. This directly enforces the rule that the backend, not the frontend, is the source of truth for prices and totals.
- **Error handling:** centralized error-handling middleware. Controllers pass errors to it rather than formatting error responses individually. Raw backend/database errors are never returned to the client.
- **Validation:** performed at the route/controller boundary using Zod schemas, before business logic executes.

---

## 4. API Design

- **No API versioning** at this stage. Routes are flat and descriptive:
  - `/api/auth/...` — customer authentication
  - `/api/products/...`
  - `/api/orders/...`
  - `/api/admin/...` — all admin-only routes, including `/api/admin/auth/...`
- New route namespaces are added incrementally, only as each phase requires them.

---

## 5. Authentication Architecture

- **Mechanism:** JWT (access token + refresh token) + bcrypt for password hashing.
- **Access token:** short-lived, used for authenticating API requests.
- **Refresh token:** longer-lived, stored in an httpOnly cookie (not localStorage) to reduce exposure to XSS-based token theft.
- **Customer auth and admin auth are structurally separate**, while sharing the same underlying JWT/bcrypt mechanism:
  - Customer: `/login`, `/register` (frontend routes) → `/api/auth/...` (backend routes)
  - Admin: `/admin/login` (frontend route) → `/api/admin/auth/...` (backend routes)
  - These do not share route handlers, and an admin session cannot be produced by the customer login flow or vice versa.
- **Email verification and password reset** use signed, expiring tokens delivered via Nodemailer, following the same token-based pattern.

---

## 6. Authorization Architecture

- `User` model includes a `role` field.
- **Current state:** a single `admin` role exists, distinct from the default `customer` role.
- **Extension point (not implemented now):** the authorization system must be designed so that additional roles or granular permissions (e.g., a product manager vs. an order manager) can be introduced later — for example, by evolving the `role` field into a `roles`/`permissions` structure — without rewriting existing auth middleware or route protection logic. This is a documented constraint on how role-checking middleware is written now, not a feature being built now.

---

## 7. Payment Architecture

- **No payment gateway is selected yet.** This decision is explicitly deferred to Phase 10 (Payments) and must not block earlier phases.
- The backend must isolate all payment logic behind a **`paymentService` abstraction**, exposing a consistent interface regardless of which provider(s) are eventually integrated, conceptually:
  - initiate/create a payment
  - verify a payment (server-side, against the provider — never trusting a frontend-supplied "success" status)
  - handle asynchronous confirmation (webhook/callback)
- Manual payment methods (Cash on Delivery, Bank Transfer) are modeled as order-status workflows (e.g., pending confirmation → confirmed by admin) and do not require a payment gateway integration.
- No raw card data is ever stored or handled directly by this application's backend or frontend.

---

## 8. Product Variant Modeling

- **Decision:** product variants (size, color, stock) are stored as an **embedded array within the `Product` document**, not as a separate collection.
- **Rationale:** simpler to build and query at moderate catalog size; avoids premature complexity.
- **Escape hatch:** this is an explicit, revisitable decision. It should be reconsidered if the catalog grows to a SKU count or update pattern (e.g., frequent independent variant-level stock updates at scale) where a separate `Variant` collection would perform or scale meaningfully better. Any such change must be recorded as a new decision in this file, not made silently.

---

## 9. Admin Panel Architecture

- Same React application, no separate frontend project.
- Routes namespaced under `/admin`, loaded via lazy loading (separate bundle, not shipped to customer-only sessions).
- Protected by role-based middleware on the backend (`/api/admin/...`) and route guarding on the frontend.
- Starts with a single `admin` role (see Section 6 for the extension point).

---

## 10. Deployment Posture

- **No hosting provider is selected yet.** This decision is explicitly deferred to Phase 15 (Deployment) and must not block earlier phases.
- The application must remain host-agnostic:
  - All configuration (DB connection string, JWT secrets, Cloudinary keys, email credentials, future payment credentials) is supplied via environment variables, never hardcoded.
  - No hardcoded ports, domains, or environment-specific values in application code.
  - Media/file storage already satisfies this via Cloudinary (no local file storage dependency).
- An `.env.example` file must be maintained alongside `.env` (never committed) as development proceeds.

---

## 11. Database Modeling Conventions (summary)

Full detail lives in `DATABASE.md`. Key architectural rules recorded here because they affect system design broadly:

- **Order snapshotting:** orders store a copy of product name, price, image, and variant details at the time of purchase. Orders never reference live product data. This prevents catalog changes from retroactively corrupting historical orders.
- **Cart duality:** authenticated users have a DB-persisted cart; guest users have a client/session-based cart; carts are merged on login. This is a requirement noted here for architectural awareness; detailed design happens in Phase 8.

---

## Status

All decisions in this file are approved and final as of Phase 0, except where explicitly marked as deferred (payment gateway — Section 7; hosting — Section 10). Any future change to a decision in this file requires explicit approval and an update to this document.