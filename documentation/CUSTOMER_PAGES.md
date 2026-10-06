# Arista Trinkets — Customer-Facing Pages Specification

## 1. Overview
This document specifies the architecture, page responsibilities, reusable component integration, data flow, responsive layout strategy, and future API hookups for all customer-facing Angular 22 pages built during **Phase 04**.

---

## 2. Implemented Pages & Responsibilities

| Page Route | Component | Responsibilities & Sections | Reused Components |
|---|---|---|---|
| `/` | `HomeComponent` | Hero Banner, Brand Intro, Browse by Category, Featured Products, Editorial Story, Newsletter, Footer | `HeaderComponent`, `FooterComponent`, `SectionHeadingComponent`, `ProductCardComponent`, `ButtonComponent` |
| `/shop` | `ShopComponent` | Full product catalog with Category Filter Tabs (All, Rings, Necklaces, Earrings, Bracelets) and Sort Selector (Featured, Price Low-High, Price High-Low, Newest) | `SectionHeadingComponent`, `ProductCardComponent`, `EmptyStateComponent`, `LoadingSpinnerComponent` |
| `/categories` | `CategoriesComponent` | Dedicated category showcase cards with item counts, descriptions, and direct filter links | `SectionHeadingComponent`, `ButtonComponent` |
| `/about` | `AboutComponent` | Brand story, heritage positioning, 3 Core Pillars (Artisanal Mastery, Ethical Sourcing, Timeless Longevity), craftsmanship editorial | `SectionHeadingComponent`, `ButtonComponent` |
| `/contact` | `ContactComponent` | Concierge cards (Atelier, Email, Phone), interactive Contact Form UI, submit state, WhatsApp Concierge trigger | `SectionHeadingComponent`, `ButtonComponent` |
| `/product/:slug` | `ProductDetailComponent` | Product gallery slideshow (multi-image with arrows/dots/counter), metal options, quantity controls (`-`/`+`), Add to Bag trigger, Specs/Care/Shipping accordions, Related Products | `SectionHeadingComponent`, `ProductCardComponent`, `ButtonComponent`, `BadgeComponent` |
| `/cart` | `CartComponent` | Reactive shopping bag list, quantity controls, subtotal, shipping calculation, tax estimate, order summary, Checkout CTA, Empty Cart state | `SectionHeadingComponent`, `ButtonComponent`, `EmptyStateComponent` |
| `/account` | `AccountComponent` | Member portal shell: Sign In form, Create Account form, Account Dashboard placeholder with orders and addresses | `SectionHeadingComponent`, `ButtonComponent` |
| `/checkout` | `CheckoutComponent` | Shipping address form, Payment method selector (UPI, Card, Netbanking, COD, Razorpay), order summary sidebar, Razorpay payment integration | `SectionHeadingComponent`, `ButtonComponent` |
| `/wishlist` | `WishlistComponent` | Saved wishlist items grid, Move to Cart button, Remove from wishlist, Empty wishlist state | `SectionHeadingComponent`, `ButtonComponent`, `EmptyStateComponent` |
| `/admin` | `AdminComponent` | Full CRUD admin panel: Product management, Category management, Order management, Admin user management, Homepage config | Standalone — requires `adminGuard` |
| `/admin/login` | `AdminLoginComponent` | Admin-specific login form (separate from customer login) | — |

---

## 3. Data Architecture & Mock Strategy

All data models are in `arista-ui/src/app/core/models/`:

- **Models**: `Product`, `Category`, `CartItem`, `CartSummary`, `ContactForm`, `ProductCardData`
- **Live Services**:
  - **`CartService`**: Hybrid DB + `localStorage` BehaviorSubject — syncs with backend when authenticated, uses session ID for guest.
  - **`WishlistService`**: Same hybrid pattern as `CartService`.
  - **`AuthService`**: JWT-based — register, login, getCurrentUser backed by real MySQL DB.
  - **`EnquiryService`**: Live `POST /enquiries` — saves to DB and triggers admin email notification.
- **Mock Service (`MockDataService`)**: Provides RxJS `Observable` fallback streams for products and categories (used as dev fallback when DB is unavailable).

### REST API Hookup Status (Phase 05 — IMPLEMENTED)
- ✅ `ContactComponent.onSubmit()` → `HttpClient.post('/api/v1/enquiries')` — **LIVE**
- ✅ `CartService` → `GET/POST/PATCH/DELETE /api/v1/cart/items` — **LIVE**
- ✅ `WishlistService` → `GET/POST/DELETE /api/v1/wishlist` — **LIVE**
- ✅ `AuthService` → `POST /api/v1/auth/login` / `register` — **LIVE**
- ✅ `CheckoutComponent` → `POST /api/v1/orders` + `/orders/razorpay-order` + `/orders/verify-payment` — **LIVE**
- ✅ `ShopComponent` / `ProductDetailComponent` → `GET /api/v1/products` — **LIVE**
- ✅ `AdminComponent` → All `/api/v1/admin/*` endpoints — **LIVE**

---

## 4. Responsive & Accessibility Decisions

- **Breakpoints**: Validated across `320px`, `375px`, `390px`, `414px`, `768px`, `1024px`, `1280px`, `1440px`.
- **Touch Targets**: Minimum 44px x 44px clickable areas for all buttons, tab filters, quantity controls, and icon links.
- **Accessibility**: Semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), `:focus-visible` outline rings, `aria-label` attributes on icon triggers, and `prefers-reduced-motion` support.
