# Arista Trinkets — System Architecture & Technical Specification

## 1. System Overview

Arista Trinkets is a production-ready, full-stack jewellery e-commerce platform comprising a responsive Customer Storefront, an Administrative Dashboard, a RESTful Node.js Backend API, and a relational MySQL database.

```
+------------------------------------+      +------------------------------------+
|       Customer Angular App         |      |        Admin Angular Dashboard     |
|     (Angular 22 SPA Customer)      |      |     (Angular 22 Admin Dashboard)   |
+------------------------------------+      +------------------------------------+
                   \                                     /
                    \                                   /
                     v                                 v
          +-------------------------------------------------------+
          |                 Node.js 24 LTS / Express API          |
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
| **Frontend Customer** | Angular | 22 | Customer E-Commerce Single-Page Application (Port 4200) |
| **Frontend Admin** | Angular | 22 | Back-office Management Console (`/admin`) |
| **Brand Assets** | Logo Mark & Icon | Official JPGs | Client Logo ([logo.jpeg](file:///c:/Jimil/Clients/arista/arista%20trinkets/logo.jpeg)) & Icon ([logo-icon.jpeg](file:///c:/Jimil/Clients/arista/arista%20trinkets/logo-icon.jpeg)) |
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
1. **Routes Layer (`src/routes/`)**: Defines REST endpoints and binds middlewares & controllers.
2. **Middleware Layer (`src/middlewares/`)**: Handles cross-cutting concerns (JWT authentication, Role-Based Access Control, request schema validation, global error handling).
3. **Controller Layer (`src/controllers/`)**: Extracts request params/body, delegates to services, formats responses using `ApiResponse`.
4. **Service Layer (`src/services/`)**: Implements business rules (e.g., price calculation, stock reservation, order total with discount codes, payment status transition).
5. **Database Access Layer (`src/db/`)**: Direct SQL queries using prepared statements via `mysql2` pool to prevent SQL injection.

---

## 4. Security Architecture

1. **Authentication & Session**:
   - Stateless **JSON Web Tokens (JWT)**.
   - Access Token lifetime: **15 minutes**.
   - Refresh Token (stored securely in HttpOnly, SameSite cookie): **7 days**.
2. **Password Security**:
   - Passwords hashed using **bcrypt** (salt round 12).
3. **Role-Based Access Control (RBAC)**:
   - System Roles: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`, `INVENTORY_MANAGER`.
   - Admin routes guarded by `requireRole(['ADMIN', 'SUPER_ADMIN'])`.
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
