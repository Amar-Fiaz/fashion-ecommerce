# PROGRESS.md

This file tracks the current development state of the project. It must be read at the start of every development session, per `CLAUDE.md` Section 5, before any code is written or inspected.

---

## Current Phase

**Phase 0 — Architecture & Documentation** — COMPLETE

**Phase 1 — MERN Project Foundation** — COMPLETE

**Phase 2 — Design System** — COMPLETE

**Phase 3 — Header, Navigation & Global UI** — COMPLETE

**Phase 4 — Homepage** — COMPLETE

**Phase 5 — Product Catalog** — COMPLETE

**Phase 6 — Product Details** — COMPLETE

**Phase 7 — Authentication** — COMPLETE

**Phase 8 — Cart & Wishlist** — COMPLETE

**Phase 9 — Checkout & Orders** — Not Started

---

## Open Decisions (not yet made — do not assume)

These decisions are intentionally deferred and must not be guessed at in any phase before the one listed:

| Decision | Deferred to | Notes |
|---|---|---|
| Payment gateway selection | Phase 10 — Payments | See `ARCHITECTURE.md` Section 7 |
| Hosting/deployment provider | Phase 15 — Deployment | See `ARCHITECTURE.md` Section 10 |

---

## Phase Log

### Phase 0 — Architecture & Documentation

**Status:** COMPLETE (approved)

**Completed:**
- Requirements analyzed from `CLAUDE.md`.
- Architectural decisions discussed and approved: monorepo structure, Zod for validation, no API versioning, embedded product variants (with documented revisit condition), structurally separate admin auth flow, payment-service abstraction with gateway selection deferred, admin panel built inside the same React app under `/admin`, single admin role with a documented extension point for future roles, hosting decision deferred, approved Phase 0–15 order.
- Full documentation set created: `docs/ARCHITECTURE.md`, `docs/PHASES.md`, `docs/PROJECT_SPEC.md`, `docs/PROGRESS.md`, `docs/DATABASE.md` (skeleton), `docs/DESIGN_SYSTEM.md` (skeleton), `docs/FEATURES.md` (template).
- `CLAUDE.md` updated with a documentation map (Section 23) and a summary of approved architectural decisions (Section 24). No original `CLAUDE.md` content was altered or removed.
- Full cross-document consistency check performed: no contradictions found between any of the seven docs files and `CLAUDE.md`; payment gateway and hosting confirmed consistently deferred and non-blocking across all files.
- No application code was created.
- No npm packages were installed.
- No `/client` or `/server` folders were created.

**Files Created:**
- `docs/ARCHITECTURE.md`
- `docs/PHASES.md`
- `docs/PROJECT_SPEC.md`
- `docs/PROGRESS.md`
- `docs/DATABASE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/FEATURES.md`

**Files Modified:**
- `CLAUDE.md` (documentation map and approved-decisions summary appended)

**Testing:** Not applicable — documentation-only phase. Consistency check performed in place of functional testing.

**Known Issues:** None.

**Next Phase:** Phase 1 — MERN Project Foundation. Approved to move into planning; implementation not yet started.

---

### Phase 1 — MERN Project Foundation

**Status:** COMPLETE

**Completed:**
- Client scaffolded with Vite + React (JavaScript template); default Vite boilerplate removed (demo assets, ESLint config, unused default files — none of which were part of the approved package list).
- Full client folder structure created per `ARCHITECTURE.md`: `app/`, `api/`, `routes/`, `layouts/`, `pages/`, `components/`, `features/`, `config/`.
- Redux Toolkit store configured (`app/store.js`); RTK Query base API slice created (`api/apiSlice.js`) with a single `getHealth` endpoint.
- React Router configured with one placeholder route rendering inside a minimal `BaseLayout`.
- `HomePlaceholder` page calls `/api/health` via RTK Query and displays the result.
- Minimal React error boundary added.
- Tailwind CSS v3 installed and configured with only the fixed breakpoints from `CLAUDE.md` Section 8 / `DESIGN_SYSTEM.md` — no color/typography/spacing/radius tokens defined (deferred to Phase 2, as required).
- Client `.env.example` created (`VITE_API_BASE_URL`).
- Server scaffolded with Express via `npm init`; full layered folder structure created: `routes/`, `controllers/`, `services/` (empty), `models/` (empty), `middlewares/`, `utils/` (empty), `config/`.
- MongoDB connection module (`config/db.js`) implemented using `MONGODB_URI`, connected successfully to MongoDB Atlas. No Mongoose models created, per `DATABASE.md`.
- Centralized error handling (`errorHandler.js`) and 404 handling (`notFound.js`) implemented, returning a consistent JSON envelope and never leaking raw stack traces.
- `/api/health` implemented through the full `routes/` → `controllers/` pattern.
- CORS configured with an explicit origin from `CLIENT_URL` and `credentials: true` (needed later for the Phase 7 httpOnly cookie flow — configured now to avoid revisiting CORS later).
- Server `.env.example` created (`PORT`, `MONGODB_URI`, `NODE_ENV`, `CLIENT_URL`).
- Root `.gitignore` and root `README.md` created.
- No root-level `package.json` created; no `concurrently`; no Axios; no auth-related packages (`jsonwebtoken`, `bcrypt`, `nodemailer`, `cookie-parser`) installed — per the four resolved decisions.

**Decisions resolved during this phase:**
- Auth packages deferred to Phase 7 (not installed).
- MongoDB Atlas selected for Phase 1 development (development-environment choice only; production hosting remains deferred to Phase 15).
- No root-level `package.json`/`concurrently`; client and server run independently.
- RTK Query `fetchBaseQuery` only; Axios not installed.
- Tailwind v3 selected over the default-installed v4, to match the approved plan's `tailwind.config.js`/`postcss.config.js` setup exactly.

**Files Created:**
- Root: `.gitignore`, `README.md`
- Client: `client/package.json`, `client/vite.config.js`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/index.html`, `client/.env.example`, `client/src/main.jsx`, `client/src/App.jsx`, `client/src/index.css`, `client/src/app/store.js`, `client/src/api/apiSlice.js`, `client/src/routes/AppRoutes.jsx`, `client/src/layouts/BaseLayout.jsx`, `client/src/pages/HomePlaceholder.jsx`, `client/src/components/ErrorBoundary.jsx`, `client/src/config/env.js`
- Server: `server/package.json`, `server/server.js`, `server/.env.example`, `server/src/app.js`, `server/src/config/db.js`, `server/src/config/env.js`, `server/src/routes/health.routes.js`, `server/src/controllers/health.controller.js`, `server/src/middlewares/errorHandler.js`, `server/src/middlewares/notFound.js`

**Files Modified:**
- `docs/PROGRESS.md` (this entry)

**Testing:**
- Server boots successfully and connects to MongoDB Atlas (`MongoDB connected successfully.`).
- `/api/health` returns the correct `{ "success": true, "message": "API is healthy" }` envelope, verified in the browser.
- An undefined route (`/api/does-not-exist`) returns the correct `{ "success": false, "message": "Route not found - ..." }` envelope, verified in the browser.
- Client dev server boots and renders the placeholder page.
- Full client → RTK Query → server → MongoDB pipeline verified: the client displays "API is healthy" fetched live from the backend.
- CORS confirmed working between the two dev servers (client successfully calls the backend cross-origin).
- Tailwind build (`npm run build`) completed successfully with no errors, producing a compiled CSS bundle.
- Responsive breakpoints (360/390/430/768/1024/1280/1440/1920) checked via browser DevTools — no layout breakage.
- Browser console and backend terminal checked — no errors.
- All work committed incrementally to Git in logical groups (10 commits total), per `CLAUDE.md` Section 19.

**Known Issues:**
- None.

**Next Phase:** Phase 2 — Design System. Not started.


---

### Phase 2 — Design System

**Status:** COMPLETE

**Completed:**
- Design tokens defined in `client/tailwind.config.js`: monochrome color palette (white/neutral grayscale/black) with a single accent color (`#B8935A`), a minimal 7-step type scale, default Tailwind spacing scale (no custom override), a 5-step border radius scale, and a 3-step shadow scale.
- `docs/DESIGN_SYSTEM.md` fully populated with the actual token values, replacing the Phase 0 skeleton — colors, typography, spacing convention, border radius, shadows, and documented button/input variant intentions.
- Three foundational reusable components created in `client/src/components/`: `Button.jsx` (primary/secondary/ghost/destructive variants, disabled state), `Input.jsx` (default/focus/error/disabled states), `Container.jsx` (consistent content width/padding across breakpoints).
- All three components styled entirely from the design tokens — no hardcoded colors, spacing, or radius values outside the token set.
- `HomePlaceholder` page temporarily updated to render all component variants for visual verification (still placeholder/verification content, not real homepage content — that remains Phase 4 scope).

**Decisions resolved during this phase:**
- Visual direction: monochrome base with a single accent color (muted gold/bronze, `#B8935A`), chosen to avoid clashing with semantic success/error colors.
- Typography: single modern sans-serif using the system font stack — no external font file/dependency added.
- Token scale: minimal, intentionally small scale per token category, with Tailwind's default spacing scale reused as-is rather than a custom override.

**Files Created:**
- `client/src/components/Button.jsx`
- `client/src/components/Input.jsx`
- `client/src/components/Container.jsx`

**Files Modified:**
- `client/tailwind.config.js`
- `docs/DESIGN_SYSTEM.md`
- `client/src/pages/HomePlaceholder.jsx` (temporary verification content)
- `docs/PROGRESS.md` (this entry)

**Testing:**
- `npm run build` completed successfully with no errors after each step (tokens, components, placeholder update).
- Visually verified in the browser: all four button variants (primary, secondary, ghost, destructive) render with correct token-based styling; disabled button shows reduced opacity and no pointer events; both input states (default and error) render correctly with appropriate border/message styling.
- Confirmed via browser DevTools that rendered colors match the defined token values (spot-checked the primary button's background against the `accent` token).
- Checked all required breakpoints (360/390/430/768/1024/1280/1440/1920) — no horizontal overflow or layout breakage.
- Browser console and backend terminal checked — no errors.
- Backend `/api/health` and undefined-route behavior re-confirmed unchanged from Phase 1.
- All work committed incrementally to Git in 3 logical groups, per `CLAUDE.md` Section 19.

**Known Issues:**
- None.

**Next Phase:** Phase 3 — Header, Navigation & Global UI. Not started.


---

### Phase 3 — Header, Navigation & Global UI

**Status:** COMPLETE

**Completed:**
- Mock navigation category data created (`navigationData.js`): Women, Men, Kids, Accessories, Sale, each with realistic subcategories (except Sale). Data shape mirrors the future `Category`/`SubCategory` models so it can be swapped for real API data in Phase 5 with minimal component changes.
- `MegaMenu` component built — fully data-driven desktop dropdown, renders whatever subcategories it's given.
- `MobileNav` component built — hamburger-triggered slide-in drawer with overlay, expandable/collapsible categories, data-driven from the same mock data as the desktop menu.
- `Header` component built — logo placeholder, desktop nav with mega menu (hover/click), mobile hamburger trigger, and non-functional search/account/cart icon placeholders (real behavior arrives in Phase 5, 7, and 8 respectively).
- `Footer` component built — links to static pages (About, Contact, FAQ, Shipping Policy, Return Policy, Privacy Policy, Terms and Conditions) as non-navigating placeholders, since those pages don't exist yet; includes a copyright line.
- `BaseLayout` updated to render the real `Header` and `Footer`, replacing the empty Phase 1 placeholder slots.
- Desktop/mobile navigation switch occurs at the `lg` (1280px) breakpoint.

**Decisions resolved during this phase:**
- Mock navigation taxonomy: Women, Men, Kids, Accessories, Sale, with realistic subcategories — mock data only, to be replaced with real API-driven categories in Phase 5.
- Mobile navigation pattern: hamburger icon with a slide-in drawer menu.

**Files Created:**
- `client/src/components/navigation/navigationData.js`
- `client/src/components/navigation/MegaMenu.jsx`
- `client/src/components/navigation/MobileNav.jsx`
- `client/src/components/navigation/Header.jsx`
- `client/src/components/Footer.jsx`

**Files Modified:**
- `client/src/layouts/BaseLayout.jsx`
- `docs/PROGRESS.md` (this entry)

**Testing:**
- `npm run build` completed successfully with no errors.
- Desktop mega menu verified: hovering Women/Men/Kids/Accessories shows the correct subcategories; Sale correctly shows no dropdown (no subcategories).
- Mobile drawer verified: hamburger opens the drawer with overlay; categories expand/collapse correctly; Sale shows no expand toggle; both the close button and overlay click dismiss the drawer.
- All required breakpoints (360/390/430/768/1024/1280/1440/1920) checked — no horizontal overflow; desktop/mobile nav switch confirmed clean at the 1280px breakpoint.
- Footer confirmed visible and correctly wrapping at all breakpoints.
- Browser console and backend terminal checked — no errors.
- Backend `/api/health` and undefined-route behavior re-confirmed unchanged from Phase 1.
- All work committed incrementally to Git in 5 logical groups, per `CLAUDE.md` Section 19.

**Known Issues:**
- None. Search, account, and cart icons are intentionally non-functional placeholders, as scoped — not a defect.

**Next Phase:** Phase 4 — Homepage. Not started.


---

### Phase 4 — Homepage

**Status:** COMPLETE

**Completed:**
- Mock product data created (`homepageMockProducts.js`), shaped to mirror the future `Product` model fields, with `image` intentionally left empty so `ProductCard` renders a CSS-only placeholder block until real photography exists in Phase 5+.
- `ProductCard` component built as a shared, reusable component (in `components/`, not `components/home/`) since it will also be used by Phase 5's product listing — data-driven, presentation-only, shows sale pricing (struck-through original + red sale price) when applicable.
- `ProductSection` component built — a titled, responsive grid of `ProductCard`s, reused for Featured, New Arrivals, and Sale sections.
- `Hero` component built — full-width CSS-only placeholder image block with a dark overlay, headline, subtext, and a non-functional CTA button.
- `PromoBanner` component built — static, accent-colored informational strip (non-functional; real admin-managed banners are Phase 13 scope).
- `NewsletterSignup` component built — client-side email validation via React Hook Form + Zod; submission is simulated locally (shows a success message) since no backend `NewsletterSubscriber` endpoint exists yet.
- `HomePage` assembled from all of the above, replacing the Phase 1–3 placeholder page (`HomePlaceholder.jsx`, deleted).
- `AppRoutes.jsx` updated to route `/` to the new `HomePage`.
- The visible "Backend connection status" / "API is healthy" block was removed from the homepage, since it's development-only verification content, not a real product feature. `/api/health` itself remains fully intact and functional on the backend.

**Decisions resolved during this phase:**
- Mock product images: CSS-only placeholder blocks (no external image service dependency).
- Hero section: full-width CSS-only placeholder image block with layered text/CTA content.
- Removed the visible homepage health-check display; kept `/api/health` itself unchanged.

**Files Created:**
- `client/src/components/home/homepageMockProducts.js`
- `client/src/components/ProductCard.jsx`
- `client/src/components/home/ProductSection.jsx`
- `client/src/components/home/Hero.jsx`
- `client/src/components/home/PromoBanner.jsx`
- `client/src/components/home/NewsletterSignup.jsx`
- `client/src/pages/HomePage.jsx`

**Files Modified:**
- `client/src/routes/AppRoutes.jsx`
- `docs/PROGRESS.md` (this entry)

**Files Deleted:**
- `client/src/pages/HomePlaceholder.jsx`

**Testing:**
- `npm run build` completed successfully with no errors.
- Hero, promo banner, and all three product sections (Featured: 3, New Arrivals: 4, Sale: 2) verified rendering correctly with accurate mock content.
- Sale pricing display (struck-through original + red sale price) verified correct.
- Newsletter form verified: invalid email blocks submission and shows a validation error; valid email shows a success message and clears the field.
- Confirmed no visible health-check text remains anywhere on the homepage.
- Header and footer from Phase 3 confirmed still present and correctly positioned around the new content.
- All required breakpoints (360/390/430/768/1024/1280/1440/1920) checked — product grid reflows correctly (2/3/4 columns), no horizontal overflow.
- Browser console and backend terminal checked — no errors.
- Backend `/api/health` and undefined-route behavior re-confirmed unchanged and still functional.
- All work committed incrementally to Git in 6 logical groups, per `CLAUDE.md` Section 19.

**Known Issues:**
- None. Hero CTA, promo banner, and product cards are intentionally non-navigating placeholders, as scoped — not a defect. Real linking arrives once catalog routes exist (Phase 5).

**Next Phase:** Phase 5 — Product Catalog. Not started.


---

### Phase 5 — Product Catalog

**Status:** COMPLETE

**Completed:**
- `Category`, `SubCategory`, and `Product` Mongoose models created, per `DATABASE.md`. Product variants (size/color/stock/sku) embedded as an array within `Product`, per `ARCHITECTURE.md` Section 8 — no separate `Variant` collection.
- Development-only seed script (`server/src/utils/seed.js`) created and run, populating MongoDB Atlas with 5 categories, 17 subcategories, and 8 products, reusing the Phase 3 mock navigation taxonomy (Women, Men, Kids, Accessories, Sale).
- Backend catalog API built through the full layered pattern: `product.service.js`/`category.service.js` (filtering, sorting, pagination, text search, search suggestions), `product.controller.js`/`category.controller.js`, `product.routes.js`/`category.routes.js`, wired into `app.js`.
- Filtering supports category, subcategory, brand, price range, size, and color (against embedded variants). Sorting supports price (asc/desc), newest, and name. Pagination is page-based with configurable limit.
- Search implemented via a MongoDB text index (`$text`) on `name`/`description`/`tags`; search suggestions implemented via a lightweight regex "starts with" query against product names.
- Frontend catalog built in `client/src/features/product/`: RTK Query endpoints (`productApi.js`), `ProductFilters`, `ProductSort`, `Pagination`, and `SearchBar` components.
- `ProductListingPage` created at the `/shop` route — fully API-driven, with filter/sort/page state held in the URL query string.
- Header's search icon wired to the new functional `SearchBar` with live, debounced suggestions; account and cart icons remain non-functional placeholders (Phase 7 and Phase 8 respectively).
- `ProductCard` (built in Phase 4) reused as-is for real product data via a small mapping function — no changes needed to the component itself, confirming the Phase 4 mock-data shape was designed well for this replacement.
- Homepage (Phase 4) re-verified working and unaffected by this phase's changes; it still uses its own separate mock data intentionally, since wiring the homepage's featured/new-arrival/sale sections to live data was not in Phase 5's scope.

**Decisions resolved during this phase:**
- Seed data via a versioned, manually-run script (not an admin UI, which doesn't exist until Phase 12).
- Category seed data reuses the Phase 3 mock taxonomy (Women, Men, Kids, Accessories, Sale).
- Filtering scope: category, subcategory, brand, price, size, color. Rating filter deferred until Phase 11 (reviews don't exist yet).
- Search implemented via native MongoDB text index and regex suggestions — no external search service added.
- Pagination: page-based (numbered pages), not infinite scroll.

**Files Created:**
- `server/src/models/Category.js`, `server/src/models/SubCategory.js`, `server/src/models/Product.js`
- `server/src/utils/seed.js`
- `server/src/services/product.service.js`, `server/src/services/category.service.js`
- `server/src/controllers/product.controller.js`, `server/src/controllers/category.controller.js`
- `server/src/routes/product.routes.js`, `server/src/routes/category.routes.js`
- `client/src/features/product/productApi.js`, `ProductFilters.jsx`, `ProductSort.jsx`, `Pagination.jsx`, `SearchBar.jsx`
- `client/src/pages/ProductListingPage.jsx`

**Files Modified:**
- `server/src/app.js`
- `client/src/routes/AppRoutes.jsx`
- `client/src/components/navigation/Header.jsx`
- `docs/DATABASE.md` (model statuses updated, field-level schemas added for Category/SubCategory/Product)
- `docs/PROGRESS.md` (this entry)

**Testing:**
- All catalog API endpoints tested directly and via the frontend: product listing, category/subcategory/brand/price/size/color filtering, all four sort options, pagination, text search, and search suggestions all verified returning correct results.
- Empty-state handling verified (`?minPrice=99999` correctly shows "No products match these filters.", not an error or blank page).
- Search debounce and suggestion-click-to-navigate flow verified working end-to-end.
- All required breakpoints (360/390/430/768/1024/1280/1440/1920) checked — filters stack correctly below `lg`, sit beside the grid at `lg`+.
- Homepage re-verified unaffected by this phase's backend/frontend changes.
- Browser console and backend terminal checked — no errors.
- All work committed incrementally to Git in 8 logical groups and pushed to GitHub, per `CLAUDE.md` Section 19.

**Known Issues:**
- The Phase 3 mega menu/mobile nav links and the Phase 4 homepage's product sections are not yet wired to real category/product data — both were explicitly out of scope for Phase 5 and remain intentional, not defects. `ProductCard`/Hero CTA remain non-navigating; product detail linking arrives in Phase 6.

**Next Phase:** Phase 6 — Product Details. Not started.


---

### Phase 6 — Product Details

**Status:** COMPLETE

**Completed:**
- Backend: `GET /api/products/:slug` added to `product.service.js`/`product.controller.js`/`product.routes.js`, returning a single product (with populated category/subcategory) plus its related products in one response. 404 handling returns the standard error envelope for unknown slugs.
- Related products logic: same subcategory first, falling back to same category if fewer than the target count exist — no new `Product` field required.
- Route ordering confirmed safe: `/search-suggestions` remains registered before `/:slug` in `product.routes.js`, preventing route shadowing.
- Frontend: `getProductBySlug` RTK Query endpoint added to `productApi.js`.
- `ProductCard` updated to navigate to `/shop/:slug` when a `slug` is present, wiring both the `/shop` listing and the Phase 4 homepage's product cards to real navigation.
- `ImageGallery` component built — renders a placeholder block when no product images exist yet (no Cloudinary upload flow until a later phase), with thumbnail-strip support ready for when real images are added.
- `VariantSelector` component built — derives size/color options from the product's actual embedded `variants` array, disables out-of-stock combinations, and shows live stock-availability messaging. "Add to Cart" is present but intentionally non-functional (Phase 8 scope).
- `SizeGuide` component built — generic static size chart (illustrative measurements), expandable/collapsible.
- `RecentlyViewed` utility (`client/src/utils/recentlyViewed.js`) and display component built — client-side only via `localStorage`, capped at the last 8 products, no backend model involved.
- `ProductDetailPage` assembled from all of the above and wired at the `/shop/:slug` route.

**Decisions resolved during this phase:**
- Detail page route: `/shop/:slug`.
- Size guide: generic static chart, not product-specific measurement data.
- Related products: same subcategory first, category fallback second.
- Recently viewed: `localStorage`, client-side only, capped at 8.

**Files Created:**
- `client/src/utils/recentlyViewed.js`
- `client/src/features/product/ImageGallery.jsx`, `VariantSelector.jsx`, `SizeGuide.jsx`, `RecentlyViewed.jsx`
- `client/src/pages/ProductDetailPage.jsx`

**Files Modified:**
- `server/src/services/product.service.js`, `server/src/controllers/product.controller.js`, `server/src/routes/product.routes.js`
- `client/src/features/product/productApi.js`
- `client/src/components/ProductCard.jsx`
- `client/src/pages/ProductListingPage.jsx`
- `client/src/routes/AppRoutes.jsx`
- `docs/PROGRESS.md` (this entry)

**Testing:**
- Product detail endpoint and 404 handling verified directly via API; search-suggestions regression-checked to confirm route ordering stayed correct.
- Navigation from both `/shop` and the homepage to `/shop/:slug` verified working.
- Variant selection, stock-aware disabling, and "not available"/"in stock"/"out of stock" messaging all verified against the seeded variant data.
- Size guide expand/collapse verified.
- Related products verified showing sensible same-subcategory/category results.
- Recently viewed verified populating, persisting across a full page refresh (confirming `localStorage`), and excluding the current product.
- Unknown slug (`/shop/does-not-exist`) verified showing a graceful "Product not found" message.
- Regression-checked: Phase 5's `/shop` listing/filter/sort/search/pagination and Phase 4's homepage both confirmed unaffected.
- One build error encountered and fixed during this phase: an incorrect relative import path in `RecentlyViewed.jsx` (`../home/ProductSection` → `../../components/home/ProductSection`); one user-side navigation confusion (visiting `/homepage` instead of `/`) clarified as expected router behavior, not a defect.
- All required breakpoints (360/390/430/768/1024/1280/1440/1920) checked — no horizontal overflow; gallery/details stack correctly below `lg`.
- Browser console and backend terminal checked — no errors.
- All work committed incrementally to Git in 7 logical groups and pushed to GitHub, per `CLAUDE.md` Section 19.

**Known Issues:**
- "Add to Cart" is present but intentionally non-functional — real cart logic is Phase 8 scope, not a defect.
- The header logo ("FASHION CO") is not yet wired as a link back to `/` — noted during this phase's testing but not part of Phase 6's scope; can be addressed as a small fix in a later phase if desired.

**Next Phase:** Phase 7 — Authentication. Not started.


---

### Phase 7 — Authentication

**Status:** COMPLETE

**Completed:**
- `User` model created with `role` (`customer`/`admin`), email verification fields, password reset fields, and an embedded `addresses` array (customer's personal address book, following the same embedding pattern as `Product.variants`).
- Auth utilities: password hashing/comparison (bcrypt), JWT access/refresh token signing/verification, and email-token generation/hashing.
- Ethereal Email (fake SMTP testing service) wired up via Nodemailer for development — verification and password-reset emails generate console-logged preview URLs rather than delivering anywhere real.
- Admin-creation CLI script (`createAdmin.js`) added, mirroring the Phase 5 seed-script pattern, since no admin dashboard UI exists yet.
- Full customer auth API built (`/api/auth/...`): register, login (with enforced email verification), logout, refresh, email verification, forgot/reset password — all through the layered service/controller/route pattern, with Zod request validation.
- Structurally separate admin auth API built (`/api/admin/auth/...`): login, logout, refresh — using a distinctly named cookie (`adminRefreshToken`) and confirmed to reject valid customer credentials, per `ARCHITECTURE.md` Section 5.
- `protect`/`authorize` middleware added for route protection (used by the profile/address endpoints, this phase's first real consumer).
- Frontend: separate Redux slices (`authSlice`, `adminAuthSlice`) holding in-memory access tokens only (never `localStorage`), per the approved security posture; RTK Query endpoints for both; a `baseQueryWithReauth` wrapper that automatically retries a request once after a silent token refresh on a 401, with a safeguard to prevent the refresh endpoint from retrying itself.
- `AuthInitializer` performs a silent refresh on app load using the httpOnly cookie, restoring a logged-in user's session across page refreshes.
- Customer-facing pages: register, login, forgot password, reset password, verify email.
- Admin login page and a temporary admin verification page (`AdminPlaceholderPage`, explicitly marked for replacement in Phase 12).
- Customer profile page: editable name, read-only email, and full saved-address management (add/edit/delete, with single-default enforcement).
- `BaseLayout` refactored to the `<Outlet />` pattern so admin routes can render without customer header/nav/footer, per the structural-separation principle.
- `ProtectedRoute` guard added for `/profile`, redirecting to `/login` if no active session (waiting for the initial silent-refresh check to complete first, to avoid a false redirect).
- Header account menu wired to real auth state (login/logout, "My Profile" link).

**Bugs found and fixed during this phase (via testing):**
- `Input.jsx` didn't forward refs, silently breaking React Hook Form's `register()` wiring — fixed with `forwardRef`.
- Access token expiry (15 minutes) caused silent `401`s on profile/address requests with no recovery — fixed by adding automatic reauth-on-401 retry logic.
- The reauth logic initially could retry the refresh endpoint against itself in a loop when the refresh itself failed — fixed by explicitly excluding refresh endpoints from the retry logic.
- `ProtectedRoute.jsx` briefly contained a mistaken copy of `AppRoutes.jsx`'s content instead of the actual guard component — corrected.
- `AddressForm.jsx` was missing the `isDefault` checkbox entirely, making the backend's default-address feature inaccessible from the UI — added.

**Decisions resolved during this phase:**
- Ethereal Email for development; real provider selection deferred (same pattern as payment gateway/hosting).
- Email verification enforced at login, not optional.
- Access token: in-memory Redux state only, with silent refresh via httpOnly cookie.
- Admin account creation via a manual CLI script, mirroring the Phase 5 seed pattern.
- Refresh tokens are stateless (signature-verified only, no server-side session store/revocation list) — noted as a future enhancement if forced session revocation is ever needed.
- Saved addresses embedded on `User` for Phase 7's profile scope; their relationship to Phase 9's checkout `Address` model is explicitly left as a Phase 9 decision.

**Files Created:**
- `server/src/models/User.js`
- `server/src/utils/password.js`, `jwt.js`, `emailTokens.js`, `sendEmail.js`, `createAdmin.js`
- `server/src/config/email.js`
- `server/src/validators/auth.validators.js`, `user.validators.js`
- `server/src/middlewares/validate.js`, `auth.js`
- `server/src/services/auth.service.js`, `adminAuth.service.js`, `user.service.js`
- `server/src/controllers/auth.controller.js`, `adminAuth.controller.js`, `user.controller.js`
- `server/src/routes/auth.routes.js`, `adminAuth.routes.js`, `user.routes.js`
- `client/src/features/auth/` (`authSlice.js`, `adminAuthSlice.js`, `authApi.js`, `adminAuthApi.js`, `AuthInitializer.jsx`)
- `client/src/features/user/` (`userApi.js`, `AddressForm.jsx`)
- `client/src/components/ProtectedRoute.jsx`
- `client/src/pages/RegisterPage.jsx`, `LoginPage.jsx`, `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`, `VerifyEmailPage.jsx`, `AdminLoginPage.jsx`, `AdminPlaceholderPage.jsx`, `ProfilePage.jsx`

**Files Modified:**
- `server/src/app.js` (cookie-parser, auth/admin-auth/user routes wired in)
- `server/.env.example`, `server/src/config/env.js` (JWT variables)
- `client/src/components/Input.jsx` (forwardRef fix)
- `client/src/layouts/BaseLayout.jsx` (Outlet pattern)
- `client/src/routes/AppRoutes.jsx` (auth routes, protected route)
- `client/src/api/apiSlice.js` (auth headers, reauth-on-401 logic)
- `client/src/app/store.js`, `client/src/main.jsx` (auth state wiring)
- `client/src/components/navigation/Header.jsx` (real auth state, profile link)
- `docs/DATABASE.md` (User model added)
- `docs/PROGRESS.md` (this entry)

**Testing:**
- Full backend auth flow (register/verify/login/refresh/forgot/reset/validation) tested exhaustively via Postman — 8 distinct test cases, all passing.
- Admin auth structural separation confirmed at the API level (customer credentials correctly rejected by admin endpoint) and re-confirmed in the actual UI.
- Full frontend flow tested end-to-end in-browser: register → verify → login → session persistence across refresh → logout; forgot/reset password; admin login → session persistence → logout; admin rejection of customer credentials.
- Profile and address management fully tested: name update with persistence, add/edit/delete addresses, single-default enforcement.
- Route protection tested: unauthenticated access to `/profile` redirects to `/login`; authenticated access works; refresh while authenticated does not incorrectly redirect.
- Cross-session isolation tested: simultaneous customer and admin sessions in the same browser do not interfere with each other; logging out of one leaves the other intact.
- Full regression pass confirmed Phases 1–6 (homepage, catalog, filtering/sorting/search, product details, variants, related/recently-viewed) all still function correctly.
- All required breakpoints checked across all new and existing pages.
- Browser console and backend terminal checked throughout — no unexplained errors.
- Five real bugs found and fixed during testing (listed above) — all retested and confirmed resolved after fixing.
- All work committed incrementally to Git across many logical commits and pushed to GitHub, per `CLAUDE.md` Section 19.

**Known Issues:**
- No server-side refresh token revocation (stateless refresh tokens) — acceptable for current scope; noted as a possible future enhancement.
- No "forgot password" equivalent for admin accounts — acceptable, since admin accounts are currently created only via the manual CLI script; can be revisited when Phase 12 builds the real admin panel.
- `AdminPlaceholderPage` is explicitly temporary and will be fully replaced in Phase 12.

**Next Phase:** Phase 8 — Cart & Wishlist. Not started.


---

### Phase 8 — Cart & Wishlist

**Status:** COMPLETE

**Completed:**
- `Cart` and `Wishlist` models created with embedded items (no separate item/product-line collections), matching the established embedding pattern from `Product.variants`/`User.addresses`.
- Backend cart API (`/api/cart/...`, protected): get cart, add item, update quantity, remove item, and merge (for guest→login transitions) — all with live-computed pricing (no stored price snapshots) and backend stock validation against the product's current embedded variant data on every mutation.
- Backend wishlist API (`/api/wishlist/...`, protected, login required per the approved decision): get, add, remove — product-level only, duplicate-add correctly guarded against.
- Guest cart implemented entirely client-side: Redux state persisted to `localStorage` (mirroring the Phase 6 `recentlyViewed.js` pattern), with add/update/remove reducers and stock-aware quantity capping.
- Merge-on-login: a dedicated hook watches the login transition and, if the guest cart has items, calls the backend merge endpoint and clears the guest cart on success (leaving it intact if the merge fails, rather than silently discarding items).
- `useCart()` hook unifies guest and authenticated cart access behind one consistent interface, so UI components don't need to branch on auth state themselves.
- Frontend UI: mini cart drawer (right-side slide-in, matching the `MobileNav` pattern), full `/cart` page (quantity editing, removal, subtotal), and `/wishlist` page — all with a non-functional "Checkout" button, correctly deferred to Phase 9.
- "Add to Cart" wired into `VariantSelector` (previously non-functional since Phase 6); wishlist toggle wired into the product detail page, redirecting to `/login` if attempted while logged out.
- Header cart icon shows a live item-count badge and opens the mini cart; account menu includes a "My Wishlist" link.

**Decisions resolved during this phase:**
- Guest cart storage: `localStorage`.
- Cart merge-on-login: sum quantities for matching lines, capped at current stock; append new lines; guest cart cleared only after a successful merge.
- Wishlist requires login — no guest wishlist support.
- Wishlist is product-level, not variant-level.
- Mini cart UX: right-side slide-in drawer.

**Files Created:**
- `server/src/models/Cart.js`, `Wishlist.js`
- `server/src/validators/cart.validators.js`, `wishlist.validators.js`
- `server/src/services/cart.service.js`, `wishlist.service.js`
- `server/src/controllers/cart.controller.js`, `wishlist.controller.js`
- `server/src/routes/cart.routes.js`, `wishlist.routes.js`
- `client/src/features/cart/guestCart.js`, `guestCartSlice.js`, `cartApi.js`, `useCart.js`, `useMergeCartOnLogin.js`, `MiniCart.jsx`
- `client/src/pages/CartPage.jsx`, `WishlistPage.jsx`

**Files Modified:**
- `server/src/app.js` (cart/wishlist routes wired in)
- `client/src/app/store.js` (guest cart reducer)
- `client/src/api/apiSlice.js` (Cart/Wishlist cache tags)
- `client/src/App.jsx` (merge-on-login hook wired in)
- `client/src/features/product/VariantSelector.jsx` (Add to Cart wired)
- `client/src/pages/ProductDetailPage.jsx` (wishlist toggle wired)
- `client/src/routes/AppRoutes.jsx` (`/cart`, `/wishlist` routes)
- `client/src/components/navigation/Header.jsx` (cart icon/badge, mini cart, wishlist link)
- `docs/DATABASE.md` (Cart and Wishlist models added)
- `docs/PROGRESS.md` (this entry)

**Testing:**
- Full backend cart/wishlist API tested via Postman: empty cart, add item, stock-limit rejection, quantity update, removal, merge, wishlist add/get/remove, and auth-requirement enforcement — all passing (8 test cases).
- Full guest cart → login → merge flow tested end-to-end in-browser multiple times, including confirming `localStorage`'s `guestCart` key is correctly populated while a guest and correctly cleared after a successful merge.
- Multi-tab consistency confirmed: a cart change in one authenticated tab is reflected in another tab after refresh, confirming the cart is genuinely backend-driven, not stale client state.
- Wishlist duplicate-add correctly prevented; UI correctly reflects wishlisted state on return visits.
- Stock validation confirmed working (rejecting over-quantity adds with a clean error, not a crash).
- Full regression pass confirmed Phases 1–7 unaffected (homepage, catalog, product details, auth, profile/addresses all still function correctly).
- All required breakpoints checked, including the new mini cart drawer, `/cart`, and `/wishlist` pages.
- Two false-alarm investigations during testing: browser-extension-injected console errors (unrelated to the app) and an initial `400` that did not reproduce on a clean retest (very likely a legitimate stock-validation response from edge-case testing, not a bug).
- Browser console and backend terminal checked throughout — no unexplained errors.
- All work committed incrementally to Git across logical commits and pushed to GitHub, per `CLAUDE.md` Section 19.

**Known Issues:**
- "Checkout" buttons (mini cart and `/cart` page) are intentionally non-functional — real checkout is Phase 9 scope, not a defect.

**Next Phase:** Phase 9 — Checkout & Orders. Not started.

---

## Phase History Template

Each future phase entry should follow this format when logged:

### Phase N — <Name>

**Status:** Not Started / In Progress / Complete

**Completed:**

**Files Created:**

**Files Modified:**

**Testing:**

**Known Issues:**

**Next Phase:**

---

## Status

Phase 0 through Phase 7 are all complete and verified. The client and server foundations, design system, global site chrome, product catalog, and product detail experience are all in place, and full authentication is now live — customer registration/login/logout with enforced email verification, forgot/reset password, structurally separate admin authentication, in-memory access tokens with automatic silent refresh, and customer profile/address management. Phase 8 — Cart & Wishlist has not started. This file will be updated again when Phase 8 begins.