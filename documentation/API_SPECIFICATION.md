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
| `POST` | `/auth/forgot-password` | **IMPLEMENTED** | Public | Request 6-digit verification OTP sent via email |
| `POST` | `/auth/verify-otp` | **IMPLEMENTED** | Public | Verify 6-digit OTP code |
| `POST` | `/auth/reset-password-otp` | **IMPLEMENTED** | Public | Reset password using verified OTP |
| `PUT` | `/auth/update-profile` | **IMPLEMENTED** | Authenticated | Update user name and phone |
| `PUT` | `/auth/change-password` | **IMPLEMENTED** | Authenticated | Change user account password |

---

## 5. Product & Category Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/categories` | **IMPLEMENTED** | Public | Fetch all categories with live product item counts |
| `GET` | `/products` | **IMPLEMENTED** | Public | List products with optional `?category=`, `?sort=`, `?search=`, `?includeInactive=` filters |
| `GET` | `/products/:slug` | **IMPLEMENTED** | Public | Fetch single product detail by slug (with images, specs, materials) |

**Query Params for `GET /products`:**
- `?category=<slug>` — Filter by category slug or name
- `?sort=price-low` / `price-high` / `newest` — Sort order
- `?search=<term>` — Search by product name or description
- `?includeInactive=true` — Admin retrieval including hidden items

> **Storefront Integration Architecture**:
> Consumed by Angular's `ProductService` (`src/app/core/services/product.service.ts`) and `CategoryService` (`src/app/core/services/category.service.ts`) using Angular `HttpClient`. All storefront components (`ShopComponent`, `HomeComponent`, `ProductDetailComponent`, `CategoriesComponent`, `FooterComponent`) fetch live database records directly with loading, empty, and error states; zero local storage mock caching is used.

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
| `POST` | `/orders` | **IMPLEMENTED** | Guest / User | Atomically validate active stock, create order, insert order items, and deduct stock inside MySQL transaction (HTTP 400 on stock failure, 0 rows inserted) |
| `POST` | `/orders/razorpay-order` | **IMPLEMENTED** | Guest / User | Initialize Razorpay payment order (returns Razorpay `order_id` + `keyId`) |
| `POST` | `/orders/verify-payment` | **IMPLEMENTED** | Guest / User | Verify Razorpay HMAC SHA256 payment signature & update order to PAID |
| `GET` | `/orders/my-orders` | **IMPLEMENTED** | Authenticated | Fetch authenticated user's order history |
| `GET` | `/orders/:orderNumber` | **IMPLEMENTED** | Guest / User | Fetch order details and items by order number |
| `GET` | `/orders/:orderNumber/invoice-pdf` | **IMPLEMENTED** | Public | Download clean coordinate-rendered GST Tax Invoice PDF |
| `GET` | `/orders/track/:trackingCode` | **IMPLEMENTED** | Public | Track package delivery status using `TRK-` code |

---

## 9. Customer Address Book Endpoints (`/api/v1/addresses`)

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/addresses` | **IMPLEMENTED** | Authenticated | Fetch saved delivery addresses for authenticated customer |
| `POST` | `/addresses` | **IMPLEMENTED** | Authenticated | Save new shipping address to customer account |
| `PUT` | `/addresses/:id` | **IMPLEMENTED** | Authenticated | Update an existing delivery address |
| `DELETE` | `/addresses/:id` | **IMPLEMENTED** | Authenticated | Remove a saved shipping address |
| `PUT` | `/addresses/:id/default` | **IMPLEMENTED** | Authenticated | Mark address as customer's default shipping destination |

---

## 10. Store Settings Endpoints (`/api/v1/settings`)

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/settings` | **IMPLEMENTED** | Public | Fetch public store settings (GST rate, delivery fee, free delivery threshold) |

---

## 11. Enquiry / Contact Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/enquiries` | **IMPLEMENTED** | Public | Submit customer contact form (saves to DB + sends Nodemailer email notification) |
| `POST` | `/contact` | **IMPLEMENTED** | Public | Alias for `POST /enquiries` |

---

## 12. Homepage Config Endpoints

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/homepage-config` | **IMPLEMENTED** | Public | Fetch homepage section images (e.g., editorial photo key-value map) |

---

## 13. Admin Panel Endpoints (`/api/v1/admin`)

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
| `GET` | `/admin/orders` | **IMPLEMENTED** | Admin | List customer orders with search, status filters, and pagination |
| `PUT` | `/admin/orders/:id/status` | **IMPLEMENTED** | Admin | Update order `order_status` and `payment_status` |
| `PUT` | `/admin/orders/:id/payment-status` | **IMPLEMENTED** | Admin | Directly update order payment status |
| `GET` | `/admin/settings` | **IMPLEMENTED** | Admin | Fetch full administrative store configuration |
| `PUT` | `/admin/settings` | **IMPLEMENTED** | Admin | Update store configuration (GST, delivery fee, threshold, address) |
| `GET` | `/admin/enquiries` | **IMPLEMENTED** | Admin | Fetch all customer enquiries ordered by newest first |

---

## 14. Product Creation Contract (`POST /api/v1/admin/products`)

### Request Headers
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (Required, role: `ADMIN` or `SUPER_ADMIN`)

### Request Body
```json
{
  "name": "Aethelgard Solitaire Emerald Ring",
  "category": "Rings",
  "price": 18500,
  "compareAtPrice": 22000,
  "badge": "NEW",
  "metalType": "18K Warm Gold",
  "gemstone": "Colombian Emerald",
  "stockQuantity": 15,
  "description": "An exquisitely handcrafted emerald solitaire ring encased in solid 18K warm gold.",
  "materials": ["18K Warm Gold", "AAA Natural Emerald"],
  "careGuide": "Store in protective velvet pouch. Avoid abrasive cleaners.",
  "shippingInfo": "Complimentary insured express delivery across India.",
  "image": "/assets/images/emerald-ring-main.jpg",
  "images": [
    "/assets/images/emerald-ring-main.jpg",
    "/assets/images/emerald-ring-angle2.jpg"
  ],
  "specifications": [
    { "label": "Gemstone Weight", "value": "1.85 Carats" },
    { "label": "Gold Purity", "value": "18 Karat (750 Hallmarked)" }
  ]
}
```

### Response
- **HTTP 201 Created**:
```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": 12,
    "name": "Aethelgard Solitaire Emerald Ring",
    "slug": "aethelgard-solitaire-emerald-ring"
  }
}
```
- **HTTP 400 Bad Request**: Missing mandatory fields (`name`, `price`, `image`) or `price > compareAtPrice`.
- **HTTP 401 Unauthorized**: Missing or expired admin JWT.
- **HTTP 403 Forbidden**: Insufficient role privileges.
- **HTTP 500 Internal Server Error**: Database execution error (with full transaction rollback).

### Transactional Guarantees
- Handled inside an atomic MySQL transaction (`pool.getConnection()`, `beginTransaction()`, `commit()`, `rollback()`).
- Inserts `products` row, child rows in `product_specifications`, and child rows in `product_images`.
- Updates `categories.item_count` dynamically.
- Automatically handles slug collision with progressive suffix increments (`-2`, `-3`), preventing raw SQL collision errors.
- Guarantees zero partial records or orphaned images/specifications if any query step fails.

