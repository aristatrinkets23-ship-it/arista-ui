# Arista Trinkets — Jewellery E-Commerce Platform

A production-ready full-stack e-commerce web application for **Arista Trinkets Jewellery**, built with Angular 22 + Node.js + Express + MySQL.

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Runtime** | Node.js | v24.x LTS |
| **Package Manager** | npm | 11.x |
| **Backend API** | Express + TypeScript | `arista-server/` |
| **Database** | MySQL | 8.0+ (`arista_trinkets_db`) |
| **Frontend** | Angular | 22 (`arista-ui/`) |
| **Payment** | Razorpay SDK | ^2.x (HMAC SHA256) |
| **Email** | Nodemailer | ^6.x (SMTP) |
| **Design Tokens** | Vanilla CSS | `arista-ui/styles/tokens.css` |

## Project Structure

```
agam vadodra/
├── arista-server/               # Node.js Express TypeScript REST API
│   ├── src/
│   │   ├── config/              # MySQL pool + auto-table creation (database.ts)
│   │   ├── controllers/         # auth, product, cart, wishlist, order, enquiry, admin, homepage
│   │   ├── middlewares/         # JWT auth, error handler, validation
│   │   ├── routes/              # index.ts — all REST API routes
│   │   ├── services/            # emailService.ts, razorpay.service.ts
│   │   ├── utils/               # ApiResponse, Logger
│   │   ├── db/schema.sql        # MySQL 8 DDL schema (reference)
│   │   ├── app.ts               # Express app (CORS, helmet, rate limit)
│   │   └── server.ts            # Server entry point
│   ├── .env.example             # Required environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── arista-ui/                   # Angular 22 Customer + Admin SPA
│   ├── src/app/
│   │   ├── core/                # Services, models, guards, constants
│   │   ├── shared/              # Reusable components (button, badge, product-card, etc.)
│   │   ├── layout/              # Header, Footer, MainLayout
│   │   └── pages/               # All route pages (home, shop, cart, admin, etc.)
│   ├── styles/                  # tokens.css (Client Brand Board colors & typography)
│   ├── documentation/           # System & technical documentation
│   └── src/environments/        # environment.ts (apiUrl config)
│
└── documentation/               # (in arista-ui/documentation/)
    ├── ARCHITECTURE.md          # System architecture & stack specification
    ├── DATABASE_SCHEMA.md       # Data dictionary (16 relational tables)
    ├── COMPLETE_LIVE_DEMO_SEED.sql # Full 16-table seed script for demo & staging deployment
    ├── DATABASE_SCHEMA.sql      # MySQL 8 DDL script (in arista-ui/documentation/)
    ├── API_SPECIFICATION.md     # REST API endpoint documentation (all IMPLEMENTED)
    ├── FRONTEND_ARCHITECTURE.md # Angular frontend structure
    ├── CUSTOMER_PAGES.md        # Customer pages spec & API hookup status
    ├── DESIGN_SYSTEM.md         # Brand colors, typography, spacing
    ├── WEBSITE_AUDIT.md         # Reference site audit report
    └── CHANGELOG.md             # Master project history
```

## Getting Started

### Backend Setup (arista-server)

1. Copy `.env.example` to `.env` and fill in your MySQL credentials and SMTP details.
2. Run the server:

```bash
cd arista-server
npm install
npm run dev       # Development with ts-node-dev
# or
npm run build && npm start   # Production
```

Health check: `http://localhost:5000/api/v1/health`

### Frontend Setup (arista-ui)

```bash
cd arista-ui
npm install
npm run dev       # Dev server on http://localhost:4200
```

### Required Environment Variables (arista-server/.env)

| Variable | Description |
|---|---|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `JWT_SECRET` | JWT signing secret |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay payment credentials |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` | SMTP config |
| `ADMIN_NOTIFICATION_EMAIL` | Email address to receive enquiry notifications |

### Default Admin Login
- **Email**: `admin@aristatrinkets.com`
- **Password**: `admin123`
- **URL**: `http://localhost:4200/admin/login`

### Database-Backed Architecture
- **Catalog & Storefront**: Powered strictly by MySQL through `ProductService` and `CategoryService` using Angular `HttpClient`.
- **Order Pipeline**: Atomic pre-check verification for stock availability and product active status with atomic transaction rollbacks (`ART-000001` sequential orders).
- **Admin Product Creation**: Directly calls `POST /api/v1/admin/products` through `ProductService.createProduct()`. Zero mock/localStorage fallback. Handled inside atomic MySQL transactions with slug collision de-duplication, specification, image, and category count synchronization.
- **Newsletter Subscription**: Powered by MySQL `newsletter_subscribers` via `NewsletterService` and `POST /api/v1/newsletter`. Strict server validation, normalization, rate limiting, and inline UI feedback states (zero browser `alert()` popups).


