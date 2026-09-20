# Arista Trinkets — REST API Specification

## 1. Implementation Status Overview

> [!IMPORTANT]
> **Implemented vs Planned Endpoints**:
> - **IMPLEMENTED (Phase 01)**: `GET /api/v1/health` (System health status check)
> - **PLANNED (Phase 02+)**: All business domain endpoints detailed below (`/auth`, `/products`, `/categories`, `/cart`, `/orders`, `/admin`) are fully specified and scheduled for incremental implementation in subsequent phases.

---

## 2. Global API Standards

- **Base URL**: `/api/v1`
- **Protocol**: HTTPS
- **Content-Type**: `application/json`
- **Standard Response Envelope**:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 12,
    "totalItems": 48,
    "totalPages": 4
  }
}
```

- **Error Response Envelope**:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 3. System & Health Check (IMPLEMENTED)

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/health` | **IMPLEMENTED** | Public | Returns system health, version `1.0.0`, and DB status |

---

## 4. Authentication Endpoints (`/api/v1/auth`) — PLANNED

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | PLANNED | Public | Register new customer account |
| `POST` | `/auth/login` | PLANNED | Public | Login & receive JWT access + refresh token |
| `POST` | `/auth/refresh-token` | PLANNED | Public (Cookie) | Obtain new JWT access token |
| `POST` | `/auth/logout` | PLANNED | Authenticated | Invalidate refresh session |
| `GET` | `/auth/me` | PLANNED | Authenticated | Retrieve current user profile |
| `PUT` | `/auth/profile` | PLANNED | Authenticated | Update user profile details |

---

## 5. Product & Category Endpoints (`/api/v1/products`, `/api/v1/categories`) — PLANNED

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/categories` | PLANNED | Public | Fetch category tree / list |
| `GET` | `/categories/:slug` | PLANNED | Public | Fetch single category by slug |
| `GET` | `/products` | PLANNED | Public | List products with pagination, search, price & metal filtering |
| `GET` | `/products/featured` | PLANNED | Public | Fetch featured items for home page slider |
| `GET` | `/products/new-arrivals`| PLANNED | Public | Fetch newest arrival products |
| `GET` | `/products/:slug` | PLANNED | Public | Fetch product details by slug including images & stock |
| `GET` | `/products/:id/related` | PLANNED | Public | Fetch related products in same category |

---

## 6. Shopping Cart Endpoints (`/api/v1/cart`) — PLANNED

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/cart` | PLANNED | Guest / User | Fetch current cart items & totals |
| `POST` | `/cart/items` | PLANNED | Guest / User | Add item to cart (`productId`, `quantity`) |
| `PUT` | `/cart/items/:id` | PLANNED | Guest / User | Update item quantity |
| `DELETE`| `/cart/items/:id` | PLANNED | Guest / User | Remove item from cart |
| `DELETE`| `/cart` | PLANNED | Guest / User | Clear cart |

---

## 7. Orders & Checkout Endpoints (`/api/v1/orders`) — PLANNED

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `POST` | `/orders` | PLANNED | Guest / User | Place new order with shipping details |
| `GET` | `/orders` | PLANNED | User | Get customer order history |
| `GET` | `/orders/:orderNumber`| PLANNED | Guest / User | Get order details & tracking |
| `POST` | `/orders/:orderNumber/cancel` | PLANNED | User | Cancel pending order |

---

## 8. Admin Panel Endpoints (`/api/v1/admin`) — PLANNED

| Method | Endpoint | Status | Access | Description |
|---|---|---|---|---|
| `GET` | `/admin/dashboard` | PLANNED | Admin | Get key metrics (Sales, Orders, Low Stock, Customers) |
| `GET` | `/admin/products` | PLANNED | Admin | List all products including disabled items |
| `POST` | `/admin/products` | PLANNED | Admin | Create product record |
| `PUT` | `/admin/products/:id` | PLANNED | Admin | Update product record |
| `DELETE`| `/admin/products/:id` | PLANNED | Admin | Soft-delete / deactivate product |
| `GET` | `/admin/orders` | PLANNED | Admin | Manage customer orders |
| `PATCH`| `/admin/orders/:id/status` | PLANNED | Admin | Update order status (`SHIPPED`, `DELIVERED`, etc.) |
| `GET` | `/admin/inventory` | PLANNED | Admin | View stock levels & update thresholds |
