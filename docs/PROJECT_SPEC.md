# PROJECT_SPEC.md

This file defines **what** the Fashion E-Commerce Platform is. For **how** it is built, see `ARCHITECTURE.md`. For **when** each part is built, see `PHASES.md`.

---

## 1. Summary

A production-quality fashion e-commerce website built on the MERN stack, aiming for a premium, modern shopping experience comparable in quality and functionality to established fashion e-commerce stores (e.g., Outfitters), used only as general UX inspiration.

The platform must have entirely original branding, UI, UX, layout, components, content, and design system. No source code, branding, images, text, proprietary assets, or exact designs from any reference store may be copied.

---

## 2. Technology Stack

- **Frontend:** React, Vite, JavaScript, React Router, Tailwind CSS, Redux Toolkit, RTK Query, React Hook Form, Zod
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Services:** Cloudinary (media storage), Nodemailer (email), Payment gateway API (provider deferred — see `ARCHITECTURE.md` Section 7)
- **Tooling:** VS Code, Git, GitHub, Postman, Claude

Full technical rationale for these choices is in `ARCHITECTURE.md`.

---

## 3. Customer Features (full scope)

- Homepage
- Navigation and mega menu
- Product categories
- Product listing, filtering, sorting
- Search and search suggestions
- Product details, variants (size/color), size guide
- Wishlist
- Cart and mini cart
- Checkout, including guest checkout
- Customer registration, login, logout
- Forgot password, password reset, email verification
- Customer profile, saved addresses
- Order history, order tracking
- Product reviews and ratings
- Coupons and discounts
- Notifications
- Recently viewed products, related products
- Newsletter signup
- Static pages: Contact, About, FAQ, Shipping Policy, Return Policy, Privacy Policy, Terms and Conditions

---

## 4. Admin Features (full scope)

- Admin dashboard
- Product management
- Category management
- Inventory management, low-stock alerts
- Order management
- Customer management
- Coupon management
- Review management
- Banner management
- Homepage content management
- Notifications
- Analytics and sales reports
- Admin authentication
- Role-based permissions

Each feature above is implemented in the phase it's assigned to in `PHASES.md`, not all at once.

---

## 5. Non-Negotiable Business Rules

These rules constrain the feature scope and must not be violated by any phase's implementation:

- **Pricing and stock are always backend-verified.** The frontend never supplies a trusted price, discount, or stock value; the backend recomputes and validates all of these before an order is created.
- **Payment status is always backend/provider-verified.** A frontend-reported "payment successful" state is never sufficient to mark an order as paid.
- **No raw card data is ever stored.** Card handling, where applicable, is delegated entirely to the payment provider.
- **Guest checkout is required** — customers must be able to complete a purchase without creating an account.
- **Admin functionality is inaccessible to customers**, enforced via role-based authorization, not UI hiding alone.
- **Sandbox/test payment environments are used during development**; no production payment credentials until Phase 15 (Deployment) at the earliest.

---

## 6. Target Screen Sizes

Mobile-first, applied to every major feature:

- **Mobile:** 360px, 390px, 430px
- **Tablet:** 768px, 1024px
- **Desktop:** 1280px, 1440px, 1920px

---

## 7. Explicitly Out of Scope (for now)

These are acknowledged requirements or open questions that are **deliberately not decided or built yet**, to prevent accidental assumptions in any phase before their designated point:

- **Payment gateway selection** — deferred to Phase 10 (`ARCHITECTURE.md` Section 7).
- **Hosting/deployment target** — deferred to Phase 15 (`ARCHITECTURE.md` Section 10).
- **Granular admin roles/permissions beyond a single `admin` role** — the system is designed to allow this later (`ARCHITECTURE.md` Section 6), but it is not implemented now.
- **Separate `Variant` collection** for products — currently embedded in `Product`; only revisited if catalog needs justify it (`ARCHITECTURE.md` Section 8).
- Any feature not listed in Sections 3 or 4 above is out of scope unless explicitly added to this document.

---

## Status

This specification reflects the full intended scope of the platform as defined in `CLAUDE.md`. It is expanded into phase-by-phase detail in `PHASES.md` and `FEATURES.md`.