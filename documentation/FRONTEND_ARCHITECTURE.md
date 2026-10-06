# Arista Trinkets — Frontend Architecture Specification

## 1. Overview
The Arista Trinkets frontend is built using **Angular 22** (`22.x`) with standalone components, TypeScript, RxJS state streams, and a modular architecture. The UI serves both a **Customer Storefront** and a full **Admin Dashboard** within the same Angular SPA.

---

## 2. Directory Structure

```
arista-ui/src/app/
├── core/                         # Singleton services, guards, interceptors & data models
│   ├── constants/
│   │   └── api-endpoints.ts      # Centralized REST API endpoint constants
│   ├── guards/
│   │   └── admin.guard.ts        # Route guard: blocks non-admin access to /admin
│   ├── mock/
│   │   └── mock-data.service.ts  # Mock data service for offline/dev fallback
│   ├── models/
│   │   ├── cart.model.ts         # CartItem, CartSummary interfaces
│   │   ├── category.model.ts     # Category interface
│   │   ├── contact.model.ts      # ContactForm interface
│   │   ├── product-card-data.model.ts  # ProductCardData with images[]
│   │   ├── product.model.ts      # Full Product interface
│   │   └── ui.model.ts           # UI state interfaces
│   ├── services/
│   │   ├── auth.service.ts       # JWT auth: login, register, getCurrentUser
│   │   ├── cart.service.ts       # Hybrid DB+localStorage cart with BehaviorSubject
│   │   ├── enquiry.service.ts    # POST /enquiries form submission
│   │   └── wishlist.service.ts   # Hybrid DB+localStorage wishlist with BehaviorSubject
│   └── utils/                    # Utility helpers
│
├── shared/                       # Shared stateless UI components
│   └── components/
│       ├── badge/
│       ├── button/
│       ├── empty-state/
│       ├── loading-spinner/
│       ├── product-card/         # Product card with multi-image slider
│       └── section-heading/
│
├── layout/                       # Persistent application shell
│   ├── header/                   # Sticky header with cart badge, auth links
│   ├── footer/                   # 4-column footer with newsletter form
│   └── main-layout/              # Root <router-outlet> shell
│
├── pages/                        # Page-level routed components
│   ├── home/                     # HomePage: Hero, Categories, Products, Editorial, Newsletter
│   ├── shop/                     # ShopPage: Category filter, sort, search, product grid
│   ├── categories/               # CategoriesPage: Category showcase cards
│   ├── about/                    # AboutPage: Brand story, pillars, craftsmanship
│   ├── contact/                  # ContactPage: Concierge info cards + enquiry form (live API)
│   ├── product-detail/           # ProductDetailPage: Gallery slideshow, specs, Add to Bag
│   ├── cart/                     # CartPage: Cart items, quantity, order summary, Checkout CTA
│   ├── checkout/                 # CheckoutPage: Shipping form, payment selector, Razorpay
│   ├── account/                  # AccountPage: Sign In, Create Account, Account Dashboard
│   ├── wishlist/                 # WishlistPage: Saved items, move to cart
│   ├── admin/                    # AdminPage: Full admin CRUD (Products, Categories, Orders, Users)
│   │   └── admin-login/          # AdminLoginPage: Admin-specific login form
│   └── placeholder-page/         # Generic placeholder (legacy)
│
├── app.routes.ts                 # Standalone Angular Router configuration
└── app.component.ts              # Root component
```

---

## 3. Modular Responsibilities

- **`core/`**: Application-wide singleton services, HTTP interceptors, JWT auth, route guards, and data models.
- **`shared/`**: Stateless, data-driven presentational components reused across all pages.
- **`layout/`**: Persistent header, footer, and shell with `<router-outlet>`.
- **`pages/`**: Feature page components with full business logic.

---

## 4. Standalone Routing Architecture

Routing uses Angular standalone route definitions with `MainLayoutComponent` as the shell (`app.routes.ts`):

| Route | Component | Guard |
|---|---|---|
| `/` | `HomeComponent` | — |
| `/shop` | `ShopComponent` | — |
| `/categories` | `CategoriesComponent` | — |
| `/about` | `AboutComponent` | — |
| `/contact` | `ContactComponent` | — |
| `/product/:slug` | `ProductDetailComponent` | — |
| `/cart` | `CartComponent` | — |
| `/checkout` | `CheckoutComponent` | — |
| `/account` | `AccountComponent` | — |
| `/wishlist` | `WishlistComponent` | — |
| `/admin/login` | `AdminLoginComponent` | — |
| `/admin` | `AdminComponent` | `adminGuard` |
| `**` | Redirect to `/` | — |

---

## 5. State Management

- **`CartService`**: Uses RxJS `BehaviorSubject<CartSummary>` — syncs with backend DB (authenticated) or `localStorage` (guest). Merges on login.
- **`WishlistService`**: Uses RxJS `BehaviorSubject` — same hybrid pattern as cart.
- **`AuthService`**: Stores JWT in `localStorage`; exposes `currentUser$` and `isLoggedIn$` observables.
- **`EnquiryService`**: Stateless HTTP service — `POST /enquiries` submits contact form to live backend.

---

## 6. API Integration

All endpoints are defined in `core/constants/api-endpoints.ts` using `environment.apiUrl` as base.

- **Implemented live**: Auth (login/register/me), Products, Categories, Cart (hybrid DB+session), Wishlist, Orders (Razorpay), Enquiries, Homepage Config, Admin CRUD.
- **Session header**: `X-Session-Id` sent with all cart/wishlist requests for guest support.

