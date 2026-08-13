# CLAUDE.md

# Fashion E-Commerce Platform

## 1. PROJECT OVERVIEW

We are building a production-quality fashion e-commerce website using the MERN stack.

The website should provide a premium, modern shopping experience similar in overall quality and functionality to established fashion e-commerce stores such as Outfitters.

The website must have its own original:
- Branding
- UI
- UX
- Layout
- Components
- Content
- Design system

Do NOT copy Outfitters' source code, branding, images, text, proprietary assets, or exact design.

Outfitters and other fashion stores may only be used as general UX inspiration.

---

# 2. TECHNOLOGY STACK

## Frontend

- React
- Vite
- JavaScript
- React Router
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Hook Form

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt

## Services

- Cloudinary for product/media storage
- Nodemailer for email
- Payment gateway APIs

## Development Tools

- VS Code
- Git
- GitHub
- Postman
- Claude

---

# 3. PROJECT GOAL

The final application should be a complete fashion e-commerce platform.

It should eventually include:

### Customer Features

- Homepage
- Navigation
- Mega menu
- Product categories
- Product listing
- Product filtering
- Product sorting
- Search
- Search suggestions
- Product details
- Product variants
- Size selection
- Color selection
- Size guide
- Wishlist
- Cart
- Mini cart
- Checkout
- Guest checkout
- Customer registration
- Login
- Logout
- Forgot password
- Password reset
- Email verification
- Customer profile
- Saved addresses
- Order history
- Order tracking
- Product reviews
- Ratings
- Coupons
- Discounts
- Notifications
- Recently viewed products
- Related products
- Newsletter
- Contact page
- About page
- FAQ
- Shipping policy
- Return policy
- Privacy policy
- Terms and conditions

### Admin Features

- Admin dashboard
- Product management
- Category management
- Inventory management
- Order management
- Customer management
- Coupon management
- Review management
- Banner management
- Homepage content management
- Notifications
- Analytics
- Sales reports
- Low-stock alerts
- Admin authentication
- Role-based permissions

---

# 4. DEVELOPMENT PHILOSOPHY

The project must be developed in phases.

Do NOT attempt to build the entire application at once.

Each phase should:

1. Have a clearly defined objective.
2. Build on the previous phase.
3. Preserve existing functionality.
4. Be tested before moving forward.
5. Update project documentation.
6. Update project progress.

Never implement future phases unless explicitly requested.

---

# 5. CURRENT DEVELOPMENT PHASE

The current phase will always be defined in:

docs/PROGRESS.md

Before doing any development work:

1. Read CLAUDE.md.
2. Read docs/PROGRESS.md.
3. Read the relevant project documentation.
4. Inspect the existing codebase.
5. Understand the current architecture.
6. Then make changes.

Do not assume that a feature exists.

Inspect the existing implementation first.

---

# 6. IMPORTANT DEVELOPMENT RULE

NEVER rewrite the entire project unnecessarily.

Before modifying code:

1. Inspect the existing files.
2. Understand dependencies.
3. Identify the smallest required change.
4. Preserve working functionality.
5. Modify only what is necessary.

Do not create duplicate:
- Components
- Routes
- API endpoints
- Database models
- State management
- Utility functions

If something already exists, reuse it.

---

# 7. CODE QUALITY

All code must prioritize:

- Maintainability
- Readability
- Reusability
- Security
- Performance
- Accessibility
- Responsive design
- Scalability

Avoid:

- Giant components
- Giant functions
- Duplicate code
- Hardcoded repeated values
- Unnecessary dependencies
- Temporary hacks
- Unexplained architecture changes

Use meaningful names for:
- Components
- Variables
- Functions
- API endpoints
- Database fields

---

# 8. FRONTEND RULES

The frontend must be:

- Responsive
- Mobile-first
- Accessible
- Fast
- Component-based
- Consistent

Target screen sizes:

### Mobile
- 360px
- 390px
- 430px

### Tablet
- 768px
- 1024px

### Desktop
- 1280px
- 1440px
- 1920px

Every major feature should be considered for all of these sizes.

---

# 9. UI/UX RULES

The website should feel:

- Premium
- Modern
- Minimal
- Fashion-focused
- Professional
- Clean
- Spacious

Use a consistent design system.

Do not randomly change:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Button styles
- Input styles

Create reusable components instead of designing every section independently.

---

# 10. DATA RULES

Do not hardcode production data inside React components once the backend feature exists.

Frontend data should come from APIs.

During early UI development, mock data may be used temporarily.

When the backend feature is implemented, replace mock data with API-driven data.

---

# 11. API RULES

The frontend communicates with the backend through APIs.

Do NOT:

- Put database logic in React.
- Put MongoDB logic in React.
- Expose secrets to the frontend.
- Trust prices supplied by the frontend.
- Trust payment status supplied by the frontend.

Sensitive business logic must be handled by the backend.

---

# 12. DATABASE RULES

Use MongoDB with Mongoose.

Before creating a new model:

1. Check docs/DATABASE.md.
2. Check whether the model already exists.
3. Reuse existing models where appropriate.
4. Do not create duplicate schemas.

Potential core models include:

- User
- Product
- Category
- SubCategory
- Cart
- Wishlist
- Order
- Review
- Coupon
- Address
- Payment
- Notification
- Banner
- NewsletterSubscriber

Do not create all models immediately.

Create models only when required by the current development phase.

---

# 13. SECURITY RULES

Never expose:

- MongoDB credentials
- JWT secrets
- Payment secrets
- Cloudinary secrets
- Email credentials
- API keys

Use environment variables.

Never commit .env files.

Always maintain:

.env.example

Sensitive operations must be performed on the backend.

---

# 14. ERROR HANDLING

Every feature should consider:

- Loading state
- Success state
- Empty state
- Error state

APIs should properly handle:

- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Database errors
- Unexpected errors

Do not expose raw backend errors to customers.

---

# 15. E-COMMERCE RULES

Product functionality must eventually support:

- Product name
- Slug
- Description
- Images
- Price
- Sale price
- Category
- Subcategory
- Brand
- SKU
- Colors
- Sizes
- Variant stock
- Tags
- Featured status
- New arrival status
- Sale status
- Ratings
- Reviews

Cart functionality must eventually support:

- Product
- Variant
- Size
- Color
- Quantity
- Stock validation
- Price calculation
- Discount calculation
- Coupon calculation
- Shipping calculation
- Final total

IMPORTANT:

Never trust the frontend for final product prices or order totals.

The backend must verify product prices, stock and totals before creating an order.

---

# 16. PAYMENT RULES

Payment integrations must be designed securely.

Never store raw card information.

Payment status must be verified by the backend/payment provider.

The application should eventually support an architecture for:

- Cash on Delivery
- Bank Transfer
- Local Pakistani payment gateways
- Card payments where supported

Do not implement real payment credentials during development.

Use sandbox/test environments first.

---

# 17. ADMIN RULES

Admin functionality must be protected.

Normal customers must not be able to access admin functionality.

Use role-based authorization.

Admin features will eventually include:

- Dashboard
- Products
- Categories
- Orders
- Customers
- Inventory
- Coupons
- Reviews
- Banners
- Notifications
- Analytics
- Settings

---

# 18. TESTING RULES

Before declaring a phase complete:

- Start the frontend.
- Start the backend if applicable.
- Test the feature.
- Check browser console.
- Check backend console.
- Check API responses.
- Check responsive behavior.
- Check loading state.
- Check empty state.
- Check error state.

Do not claim that a feature works without testing it.

---

# 19. GIT RULES

Use Git throughout development.

Create meaningful commits such as:

feat: add homepage hero section

feat: add product listing

feat: add authentication

fix: resolve cart quantity issue

refactor: improve product service

Do not make one huge commit containing the entire project.

---

# 20. CLAUDE BEHAVIOR

Claude must act as a development assistant and senior engineering partner.

Claude must NOT blindly follow a request if it conflicts with the project architecture.

If a requested change creates an architectural problem:

1. Explain the problem.
2. Explain the options.
3. Recommend the best approach.
4. Wait for approval if the change is significant.

If uncertain:

DO NOT GUESS.

Clearly explain what information is missing.

Never silently invent:
- APIs
- Database fields
- Business rules
- Payment behavior
- Existing files
- Existing functionality

---

# 21. PHASE COMPLETION

At the end of each phase, report:

## Completed
- List completed work.

## Files Created
- List files.

## Files Modified
- List files.

## Testing
- List tests performed.

## Known Issues
- List remaining issues.

## Next Phase
- State the next phase.

Also update:

docs/PROGRESS.md

---

# 22. CURRENT RULE

Only work on the current phase.

Do not implement future functionality unless explicitly requested.

Always inspect the existing project before making changes.

Always preserve existing working functionality.

Always prioritize a clean, maintainable, production-quality implementation.