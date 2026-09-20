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
| `/product/:slug` | `ProductDetailComponent` | Product gallery, metal options, quantity controls (`-`/`+`), Add to Shopping Bag trigger, Specs/Care/Shipping accordions, Related Products | `SectionHeadingComponent`, `ProductCardComponent`, `ButtonComponent`, `BadgeComponent` |
| `/cart` | `CartComponent` | Reactive shopping bag list, quantity controls, subtotal, shipping calculation, tax estimate, order summary, Checkout CTA, Empty Cart state | `SectionHeadingComponent`, `ButtonComponent`, `EmptyStateComponent` |
| `/account` | `AccountComponent` | Member portal shell: Sign In form, Create Account form, Account Dashboard placeholder with orders and addresses | `SectionHeadingComponent`, `ButtonComponent` |
| `/checkout` | `CheckoutComponent` | Shipping address form, Payment method selector (UPI, Card, Netbanking, COD), order summary sidebar, place order demo feedback | `SectionHeadingComponent`, `ButtonComponent` |
| `/admin` | `AdminComponent` | Internal management shell placeholder reserved for Phase 05+ admin CRUD | Direct button links |

---

## 3. Data Architecture & Mock Strategy

All data models and mock repositories are strictly isolated in `frontend/src/app/core/`:

- **Models**: `Product`, `Category`, `CartItem`, `CartSummary`, `ContactForm`, `ProductCardData`
- **Mock Service (`MockDataService`)**: Provides RxJS `Observable` streams for categories, products, filtered shop products, detailed product by slug, and related products.
- **Reactive Cart (`CartService`)**: Uses RxJS `BehaviorSubject<CartSummary>` to maintain state across page navigation, updating the header badge count (`bag-count`) dynamically.

### Future REST API Hookup Points (Phase 05+)
- Replace `MockDataService.getProducts()` with `HttpClient.get<Product[]>('/api/v1/products')`
- Replace `MockDataService.getProductBySlug()` with `HttpClient.get<Product>('/api/v1/products/' + slug)`
- Replace `CartService` local state with `HttpClient.post('/api/v1/cart/items')`
- Connect `ContactComponent.onSubmit()` to `HttpClient.post('/api/v1/contact')`

---

## 4. Responsive & Accessibility Decisions

- **Breakpoints**: Validated across `320px`, `375px`, `390px`, `414px`, `768px`, `1024px`, `1280px`, `1440px`.
- **Touch Targets**: Minimum 44px x 44px clickable areas for all buttons, tab filters, quantity controls, and icon links.
- **Accessibility**: Semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), `:focus-visible` outline rings, `aria-label` attributes on icon triggers, and `prefers-reduced-motion` support.
