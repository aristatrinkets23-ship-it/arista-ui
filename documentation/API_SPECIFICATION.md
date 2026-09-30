# Arista Trinkets — REST API Specification

## 1. Implementation Status Overview

> [!IMPORTANT]
> All endpoints listed below are **FULLY IMPLEMENTED** in `arista-server/`.
> Base API URL: `/api/v1` (served on port `5000`).
> Authentication uses **JWT Bearer tokens** (24-hour expiry).

---

## 2. Global API Standards

- **Base URL**: `/api/v1`
- **Protocol**: HTTP (dev) / HTTPS (prod)
- **Content-Type**: `application/json`
- **Standard Success Response Envelope**:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { }
}
```

- **Error Response Envelope**:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error"
}
```

---

## 3. System & Health Check

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/health` | **IMPLEMENTED** | Public | Returns system health and timestamp |

---

## 4. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | **IMPLEMENTED** | Public | Register new customer account (name, email, password, phone) |
| `POST` | `/auth/login` | **IMPLEMENTED** | Public | Login & receive JWT access token (24h expiry) |
| `GET` | `/auth/me` | **IMPLEMENTED** | Authenticated | Retrieve current user profile from JWT |

---

## 5. Product & Category Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/categories` | **IMPLEMENTED** | Public | Fetch all categories with live product item counts |
| `GET` | `/products` | **IMPLEMENTED** | Public | List products with optional `?category=`, `?sort=`, `?search=` filters |
| `GET` | `/products/:slug` | **IMPLEMENTED** | Public | Fetch single product detail by slug (with images, specs, materials) |

**Query Params for `GET /products`:**
- `?category=<slug>` — Filter by category slug or name
- `?sort=price-low` / `price-high` / `newest` — Sort order
- `?search=<term>` — Search by product name or description

---

## 6. Shopping Cart Endpoints (`/api/v1/cart`)

> Supports both **guest (session)** and **authenticated (user)** carts via `X-Session-Id` request header.

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/cart` | **IMPLEMENTED** | Guest / User | Fetch cart items with live DB prices |
| `GET` | `/cart/items` | **IMPLEMENTED** | Guest / User | Alias for `GET /cart` |
| `POST` | `/cart/items` | **IMPLEMENTED** | Guest / User | Add item to cart (`productId`, `slug`, `metalType`, `quantity`) |
| `POST` | `/cart` | **IMPLEMENTED** | Guest / User | Alias for `POST /cart/items` |
| `PATCH` | `/cart/items/:productId` | **IMPLEMENTED** | Guest / User | Update item quantity |
| `DELETE` | `/cart/items/:productId` | **IMPLEMENTED** | Guest / User | Remove item from cart |
| `DELETE` | `/cart` | **IMPLEMENTED** | Guest / User | Clear entire cart |
| `POST` | `/cart/merge` | **IMPLEMENTED** | Authenticated | Merge guest session cart into user account after login |

---

## 7. Wishlist Endpoints (`/api/v1/wishlist`)

> Supports both **guest (session)** and **authenticated (user)** wishlists via `X-Session-Id` header.

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/wishlist` | **IMPLEMENTED** | Guest / User | Fetch wishlist items |
| `POST` | `/wishlist/toggle` | **IMPLEMENTED** | Guest / User | Toggle item in/out of wishlist |
| `DELETE` | `/wishlist/clear` | **IMPLEMENTED** | Guest / User | Clear entire wishlist |
| `DELETE` | `/wishlist/:idOrSlug` | **IMPLEMENTED** | Guest / User | Remove specific item from wishlist |

---

## 8. Orders & Payment Endpoints (`/api/v1/orders`)

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/orders` | **IMPLEMENTED** | Guest / User | Create an order record in MySQL with items |
| `POST` | `/orders/razorpay-order` | **IMPLEMENTED** | Guest / User | Initialize Razorpay payment order (returns Razorpay `order_id` + `keyId`) |
| `POST` | `/orders/verify-payment` | **IMPLEMENTED** | Guest / User | Verify Razorpay HMAC SHA256 payment signature & update order to PAID |
| `GET` | `/orders/:orderNumber` | **IMPLEMENTED** | Guest / User | Fetch order details and items by order number |

---

## 9. Enquiry / Contact Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/enquiries` | **IMPLEMENTED** | Public | Submit customer contact form (saves to DB + sends Nodemailer email notification) |
| `POST` | `/contact` | **IMPLEMENTED** | Public | Alias for `POST /enquiries` |

---

## 10. Homepage Config Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/homepage-config` | **IMPLEMENTED** | Public | Fetch homepage section images (e.g., editorial photo key-value map) |

---

## 11. Admin Panel Endpoints (`/api/v1/admin`)

> All admin endpoints require `Authorization: Bearer <token>` with role `ADMIN` or `SUPER_ADMIN`.

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/admin/verify` | **IMPLEMENTED** | Admin | Verify active admin JWT session and return user info |
| `GET` | `/admin/dashboard` | **IMPLEMENTED** | Admin | Dashboard metrics: total products, orders, revenue, low-stock items |
| `PUT` | `/admin/profile` | **IMPLEMENTED** | Admin | Update admin name, email, and optional password |
| `GET` | `/admin/users` | **IMPLEMENTED** | Admin | List all `ADMIN` and `SUPER_ADMIN` accounts |
| `POST` | `/admin/users` | **IMPLEMENTED** | Admin | Create new admin user account |
| `PUT` | `/admin/users/:id/password` | **IMPLEMENTED** | Admin | Update an admin user's password |
| `DELETE` | `/admin/users/:id` | **IMPLEMENTED** | Admin | Delete an admin user account |
| `PUT` | `/admin/homepage-config` | **IMPLEMENTED** | Admin | Update homepage editorial section image |
| `POST` | `/admin/products` | **IMPLEMENTED** | Admin | Create new product with images and specifications |
| `PUT` | `/admin/products/:id` | **IMPLEMENTED** | Admin | Update product details, images, and specifications |
| `DELETE` | `/admin/products/:id` | **IMPLEMENTED** | Admin | Delete a product and all cascaded data |
| `POST` | `/admin/categories` | **IMPLEMENTED** | Admin | Create new category |
| `PUT` | `/admin/categories/:id` | **IMPLEMENTED** | Admin | Update category name, slug, description, image |
| `DELETE` | `/admin/categories/:id` | **IMPLEMENTED** | Admin | Delete category (blocked if products are assigned) |
| `PUT` | `/admin/orders/:id/status` | **IMPLEMENTED** | Admin | Update order `order_status` and `payment_status` |
| `GET` | `/admin/enquiries` | **IMPLEMENTED** | Admin | Fetch all customer enquiries ordered by newest first |
