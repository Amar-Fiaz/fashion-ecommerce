# PHASES.md

This file is the authoritative phase plan for the Fashion E-Commerce Platform. Development proceeds one phase at a time. A phase must not begin until the previous phase is complete and reported per `CLAUDE.md` Section 21. Future phases must not be implemented ahead of schedule, per `CLAUDE.md` Section 22.

The current phase is always tracked in `PROGRESS.md`, not here. This file defines the plan; `PROGRESS.md` tracks execution against it.

---

## Phase 0 — Architecture & Documentation

**Objective:** Establish the technical architecture and project documentation before any code exists.

**Scope:** Analyze requirements from `CLAUDE.md`; make and record foundational architectural decisions; create `docs/ARCHITECTURE.md`, `docs/PHASES.md`, `docs/PROJECT_SPEC.md`, `docs/PROGRESS.md`, `docs/DATABASE.md` (skeleton), `docs/DESIGN_SYSTEM.md` (skeleton), `docs/FEATURES.md` (template); update `CLAUDE.md` with documentation references.

**Non-goals:** No application code. No `/client` or `/server` folders. No npm packages installed. No payment gateway or hosting decisions.

**Dependencies:** None.

**Exit criteria:** All Phase 0 documentation files exist, are internally consistent, and are approved.

---

## Phase 1 — MERN Project Foundation

**Objective:** Stand up the empty but correctly structured client and server applications.

**Scope:** Create `/client` (Vite + React) and `/server` (Express) with the folder structures defined in `ARCHITECTURE.md`; base Express app with health-check route; base React app rendering a placeholder; environment variable setup (`.env.example` for both apps); MongoDB connection setup (no models yet); Git initialized with meaningful initial commits.

**Non-goals:** No product, auth, or UI features. No design system values yet. No real database models beyond connection verification.

**Dependencies:** Phase 0 complete.

**Exit criteria:** Client and server both start successfully; server connects to MongoDB; no feature code exists yet.

---

## Phase 2 — Design System

**Objective:** Establish the reusable visual foundation before any real UI is built.

**Scope:** Define color palette, typography scale, spacing scale, border radius, shadows, button variants, input variants, and breakpoints in the Tailwind config and `DESIGN_SYSTEM.md`; build a small set of foundational reusable components (e.g., Button, Input, Container) used to prove the system, not full pages.

**Non-goals:** No homepage, navigation, or product UI yet.

**Dependencies:** Phase 1 complete.

**Exit criteria:** Design tokens are defined in one place and documented; foundational components render correctly across all target breakpoints.

---

## Phase 3 — Header, Navigation & Global UI

**Objective:** Build the persistent site chrome used across all pages.

**Scope:** Header, primary navigation, mega menu, mobile navigation, footer, and other global UI (e.g., global loading/error boundaries). Uses mock data for menu structure where backend categories don't exist yet.

**Non-goals:** No category management backend yet (mock data only, per `CLAUDE.md` Section 10).

**Dependencies:** Phase 2 complete.

**Exit criteria:** Header/nav/footer are responsive across all target breakpoints and present on all pages via layout composition.

---

## Phase 4 — Homepage

**Objective:** Build the homepage using the established design system and global UI.

**Scope:** Hero section, featured/new-arrival/sale product sections (mock data), promotional banners (static), newsletter signup UI (non-functional until backend exists).

**Non-goals:** No real banner management or newsletter backend yet — those are Admin/Phase 11+ concerns.

**Dependencies:** Phase 3 complete.

**Exit criteria:** Homepage is fully responsive and visually complete using mock data.

---

## Phase 5 — Product Catalog

**Objective:** Build product listing, filtering, sorting, and search — backend and frontend together, replacing mock data with real data.

**Scope:** `Product`, `Category`, `SubCategory` Mongoose models (embedded variants, per `ARCHITECTURE.md`); catalog API endpoints; product listing UI; filtering; sorting; search and search suggestions.

**Non-goals:** No product detail page yet (that's Phase 6). No cart/wishlist actions yet.

**Dependencies:** Phase 4 complete (design system and layout available to build against).

**Exit criteria:** Product listing is fully API-driven, filterable, sortable, and searchable; mock data fully replaced per `CLAUDE.md` Section 10.

---

## Phase 6 — Product Details

**Objective:** Build the single-product experience.

**Scope:** Product details page; variant selection (size/color) against embedded variant data; size guide; image gallery; related products; recently viewed products (client-side or lightweight backend tracking, to be scoped at phase start).

**Non-goals:** No cart persistence yet — "add to cart" UI may exist but full cart logic belongs to Phase 8.

**Dependencies:** Phase 5 complete.

**Exit criteria:** A product can be viewed with full variant selection and correct stock/state handling.

---

## Phase 7 — Authentication

**Objective:** Build customer authentication end-to-end.

**Scope:** `User` model; register, login, logout; JWT access/refresh token flow; email verification; forgot/reset password; customer profile and saved addresses. Admin authentication (`/admin/login`, `/api/admin/auth/...`) is scoped and built here as a structurally separate flow, per `ARCHITECTURE.md` Section 5 — but only the login mechanism, not the admin dashboard itself.

**Non-goals:** No admin dashboard UI yet (Phase 12). No role/permission expansion beyond the single `admin` role.

**Dependencies:** Phase 6 complete (not a hard technical dependency, but follows the approved phase order).

**Exit criteria:** Customers can fully register, verify, log in, log out, and reset passwords; admin login flow exists and is structurally separate; both are tested per `CLAUDE.md` Section 18.

---

## Phase 8 — Cart & Wishlist

**Objective:** Build cart and wishlist functionality for both guest and authenticated users.

**Scope:** `Cart` and `Wishlist` models; guest cart (client/session-based) and authenticated cart (DB-persisted), with merge-on-login behavior; mini cart; quantity/stock validation; wishlist add/remove.

**Non-goals:** No checkout, pricing finalization, or coupons yet.

**Dependencies:** Phase 7 complete (cart persistence requires authentication to exist).

**Exit criteria:** Cart and wishlist work correctly for both guest and logged-in users, including merge behavior, with backend-validated stock.

---

## Phase 9 — Checkout & Orders

**Objective:** Build the checkout flow and order creation, with backend-verified totals.

**Scope:** `Order`, `Address` models; guest checkout; address management; order creation with server-side recomputation of prices, stock, and totals (per `CLAUDE.md` Section 15); order confirmation; order history; order tracking status.

**Non-goals:** No real payment gateway integration yet — orders are created in a "pending payment" or COD-equivalent state during this phase; actual gateway wiring is Phase 10.

**Dependencies:** Phase 8 complete.

**Exit criteria:** An order can be placed end-to-end (as guest or authenticated) with all totals computed and verified server-side, and order snapshotting in place per `ARCHITECTURE.md` Section 11.

---

## Phase 10 — Payments

**Objective:** Integrate real payment methods behind the `paymentService` abstraction.

**Scope:** `Payment` model; Cash on Delivery and Bank Transfer workflows; sandbox integration of the chosen gateway(s) (gateway selection happens at the start of this phase, per `ARCHITECTURE.md` Section 7); server-side payment verification.

**Non-goals:** No production payment credentials (sandbox/test only, per `CLAUDE.md` Section 16).

**Dependencies:** Phase 9 complete.

**Exit criteria:** All approved payment methods work in sandbox mode; payment status is always verified server-side, never trusted from the frontend.

---

## Phase 11 — Notifications, Reviews & Coupons

**Objective:** Add post-purchase and engagement features.

**Scope:** `Review`, `Coupon`, `Notification` models; product reviews and ratings; coupon application at checkout (extending Phase 9's total calculation); customer-facing notifications.

**Non-goals:** No admin-side management UI for these yet (Phase 13).

**Dependencies:** Phase 10 complete.

**Exit criteria:** Customers can leave reviews/ratings, apply valid coupons with backend-verified discount calculation, and receive notifications.

---

## Phase 12 — Admin Dashboard

**Objective:** Build the core admin panel.

**Scope:** Admin dashboard overview; product management; category management; order management; customer management — all under `/admin`, lazy-loaded, protected by the single `admin` role.

**Non-goals:** No analytics/reports, banners, or inventory alerts yet (Phase 13).

**Dependencies:** Phase 11 complete.

**Exit criteria:** An admin can fully manage products, categories, orders, and customers through the admin panel.

---

## Phase 13 — Advanced Admin Features

**Objective:** Complete the remaining admin functionality.

**Scope:** `Banner` model and banner management; homepage content management; inventory management and low-stock alerts; coupon management UI; review management UI; analytics and sales reports; admin notifications.

**Non-goals:** No expansion of admin roles/permissions beyond what `ARCHITECTURE.md` Section 6 allows as a future extension point — still single-role unless explicitly revisited.

**Dependencies:** Phase 12 complete.

**Exit criteria:** All admin features listed in `CLAUDE.md` Section 3 are implemented and tested.

---

## Phase 14 — Testing, Security & Performance

**Objective:** Harden the application before deployment.

**Scope:** Cross-cutting testing pass across all features (loading/success/empty/error states per `CLAUDE.md` Section 14); accessibility review; performance review (bundle size, lazy loading verification, query efficiency); security review (auth, input validation, secrets handling, admin/customer boundary verification).

**Non-goals:** No new features.

**Dependencies:** Phase 13 complete.

**Exit criteria:** Known issues from prior phases are resolved or explicitly documented; the application is considered feature-complete and stable.

---

## Phase 15 — Deployment

**Objective:** Deploy the application.

**Scope:** Hosting decision made (deferred per `ARCHITECTURE.md` Section 10); production environment configuration; deployment pipeline; production environment variables set (no secrets committed).

**Non-goals:** None — this is the final phase.

**Dependencies:** Phase 14 complete.

**Exit criteria:** Application is live and accessible in a production environment matching the architecture defined in this documentation.

---

## Status

This phase order is approved as of Phase 0. Scope details for each phase may be refined at the start of that phase (per `CLAUDE.md` Section 5's requirement to inspect current state before work), but the phase order and boundaries themselves are not to be changed without explicit approval.