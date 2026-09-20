# Arista Trinkets — Frontend Architecture Specification

## 1. Overview
The Arista Trinkets frontend is built using **Angular 22** (`22.1.7`) with standalone components, TypeScript 6 (`6.0.2`), RxJS state streams, and a modular architecture.

---

## 2. Directory Structure

```
frontend/src/app/
├── core/                     # Singleton services, interceptors, guards & core data models
│   ├── models/
│   │   ├── product-card-data.model.ts
│   │   └── ui.model.ts
│   └── services/
│       └── toast.service.ts
│
├── shared/                   # Shared reusable UI components, directives & pipes
│   ├── components/
│   │   ├── button/
│   │   ├── section-heading/
│   │   ├── badge/
│   │   ├── product-card/
│   │   ├── loading-spinner/
│   │   ├── empty-state/
│   │   ├── error-state/
│   │   └── form-field/
│   └── pipes/
│
├── layout/                   # Application layout structure
│   ├── header/
│   ├── footer/
│   └── main-layout/
│
├── pages/                    # Lightweight page shells for routing validation
│   ├── home/
│   └── placeholder-page/
│
├── app.routes.ts             # Standalone Angular Router configuration
└── app.component.ts          # Root component
```

---

## 3. Modular Responsibilities

- **`core/`**: Holds application-wide singleton services, state models, HTTP interceptors, and route guards.
- **`shared/`**: Contains stateless, data-driven presentational components (Buttons, Badges, Cards, Loaders, Form Fields) used across multiple features.
- **`layout/`**: Manages the persistent header, footer, and shell layout structure (`MainLayoutComponent`).
- **`pages/`**: Serves page-level views connected to the router.

---

## 4. Standalone Routing Architecture

Routing is configured using Angular standalone route definitions (`app.routes.ts`):

- `/` -> `HomeComponent`
- `/about` -> `PlaceholderPageComponent` (Title: "About Us")
- `/contact` -> `PlaceholderPageComponent` (Title: "Contact Us")
- `/shop` -> `PlaceholderPageComponent` (Title: "Shop Collections")
- `/categories` -> `PlaceholderPageComponent` (Title: "Jewellery Categories")
- `/product/:slug` -> `PlaceholderPageComponent` (Title: "Product Detail")
- `/cart` -> `PlaceholderPageComponent` (Title: "Shopping Bag")
- `/checkout` -> `PlaceholderPageComponent` (Title: "Checkout")
- `/account` -> `PlaceholderPageComponent` (Title: "Customer Account")
- `/admin` -> `PlaceholderPageComponent` (Title: "Admin Panel")
