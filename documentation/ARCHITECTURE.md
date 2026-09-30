# Arista Trinkets — System Architecture & Technical Specification

## 1. System Overview

Arista Trinkets is a production-ready, full-stack jewellery e-commerce platform comprising a responsive Customer Storefront, a full Admin Dashboard, a RESTful Node.js Backend API, and a relational MySQL database. Both the Customer SPA and Admin Dashboard are served from the same **Angular 22** app (`arista-ui/`). The backend is in `arista-server/`.

```
+--------------------------------------------+      +--------------------------------------------+
|       Customer Angular SPA (arista-ui)     |      |   Admin Dashboard (/admin in arista-ui)    |
|   (Angular 22, Port 4200 in dev)           |      |   (Same Angular app, /admin route + guard) |
+--------------------------------------------+      +--------------------------------------------+
                   \                                     /
                    \                                   /
                     v                                 v
          +-------------------------------------------------------+
          |         arista-server: Node.js 24 LTS / Express API   |
          |       (JWT Auth, Controllers, Services, Validation)   |
          +-------------------------------------------------------+
                                     |
                                     v
          +-------------------------------------------------------+
          |                   MySQL 8+ Database                   |
          |       (Relational Schema, Indexes, Foreign Keys)      |
          +-------------------------------------------------------+
```

---

## 2. Technology Stack & Target Environment

| Component | Technology | Target Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | v24.x LTS | API Server Execution Environment (Port 5000) |
| **Package Manager** | npm | 11.x | Dependency Management |
| **Framework** | Express.js | ^4.19.x | Web Application Framework & REST Routing |
| **Language** | TypeScript | ^5.4.x | Type Safety for Backend & Frontend |
| **Database** | MySQL | 8.0+ | Core Relational Persistence Store (`arista_trinkets_db`) |
| **Database Driver** | `mysql2` | ^3.9.x | High-performance MySQL client with Promise & Connection Pooling |
| **Payment Gateway** | Razorpay SDK | ^2.9.x | HMAC SHA256 Verified Payment Gateway (`razorpay_order_id`, `verify-payment`) |
| **Frontend** | Angular | 22 | Customer SPA + Admin Dashboard (`arista-ui/`, Port 4200 in dev) |
| **Payment Gateway** | Razorpay SDK | ^2.x | HMAC SHA256 payment, env vars: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Email** | Nodemailer | ^6.x | Enquiry notifications via SMTP: `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`, `ADMIN_NOTIFICATION_EMAIL` |
| **Styling** | Vanilla CSS | CSS3 / Custom Properties | Luxury Brand Design Tokens (`tokens.css`, `styles.css`) |

---

## 3. Layered Backend Architecture

The backend follows a strict **Layered Controller-Service-Repository** pattern:

```
[ HTTP Request ]
       |
       v
[ Routes & Router ] ---> [ Middleware Stack ] (CORS, Rate Limit, Helmet, Auth JWT, Validator)
                               |
                               v
                       [ Controllers ] (Parses req, invokes service, returns ApiResponse)
                               |
                               v
                        [ Services ] (Business rules, transactions, calculations)
                               |
                               v
                       [ Repositories / Data Access ] (MySQL pool queries, parameterization)
                               |
                               v
                       [ MySQL Database ]
```

### Layer Descriptions:
1. **Routes Layer (`src/routes/index.ts`)**: Defines all REST endpoints and binds middleware stacks & controllers.
2. **Middleware Layer (`src/middlewares/`)**: Handles JWT auth (`auth.middleware.ts`), Role-Based Access Control, and global error handling (`error.middleware.ts`).
3. **Controller Layer (`src/controllers/`)**: Parses request params/body and returns JSON responses using `ApiResponse` util.
4. **Service Layer (`src/services/`)**: Business logic — Razorpay payment (HMAC SHA256 verification), Nodemailer email notifications.
5. **Config Layer (`src/config/database.ts`)**: MySQL connection pool + `ensureTablesExist()` auto-migration on startup.

---

## 4. Security Architecture

1. **Authentication & Session**:
   - Stateless **JSON Web Tokens (JWT)**.
   - Access Token lifetime: **24 hours** (configurable via `JWT_EXPIRES_IN`).
   - No refresh tokens — re-login required after expiry.
2. **Password Security**:
   - Passwords hashed using **bcrypt** (salt rounds 10–12).
3. **Role-Based Access Control (RBAC)**:
   - Database Roles: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`.
   - Admin routes guarded by `requireRole(['ADMIN', 'SUPER_ADMIN'])` middleware.
4. **Data Protection & Sanitization**:
   - HTTP Header hardening via `helmet`.
   - Strict CORS policy (Whitelisted origins only).
   - SQL Injection protection via strictly parameterized `mysql2` queries.
   - Rate limiting via `express-rate-limit` on authentication and sensitive endpoints.

---

## 5. Database Design Philosophy

- **Strict Relational Integrity**: All entity relations enforced with Foreign Keys and foreign key constraints (`ON DELETE RESTRICT` / `CASCADE`).
- **Normalized Data Structure**: Core product and order tables normalized to 3NF.
- **Indexing Strategy**: Indexes created on high-cardinality search columns (`slug`, `category_id`, `user_id`, `order_number`, `status`, `sku`).
- **Auditability**: All transactional tables include `created_at` and `updated_at` standard timestamps. Order history tracked via `order_status_history`.

---

## 6. Frontend Design System & Client Brand Board

### Primary Client Brand Board Palette (Source of Truth)
- **Warm Gold**: `#CFA874` (Primary Metallic Accent)
- **Mocha Brown**: `#5B4636` (Primary Luxury Dark & Heading Color)
- **Soft Blush**: `#F7E9E6` (Secondary Feminine Accent)
- **Sage Mist**: `#DDE3D5` (Gemstone & Nature Accent)
- **Lavender Haze**: `#E8E3F3` (Subtle Luxury Shimmer Accent)
- **Pearl Beige**: `#F2EFE8` (Neutral Light Card & Background)

### Reference Site UI Distinction
- Reference site (`arista-jewelery.pages.dev`) uses Champagne Gold `#D4AF37` and Obsidian Black `#111111`.
- The **Client Brand Board palette (#CFA874 & #5B4636)** serves as the primary source of truth for branding, with reference site layout/UX structure adapted accordingly.

### Typography
- **Headings**: `Playfair Display` (Serif)
- **Body & Controls**: `Montserrat` (Regular 400, Medium 500, SemiBold 600, Bold 700)
