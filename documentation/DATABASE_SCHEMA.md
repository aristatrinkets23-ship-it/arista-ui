# Arista Trinkets — Database Entity Relationship & Data Dictionary

## 1. Overview
The **Arista Trinkets** MySQL database (`arista_trinkets_db`) stores all entity records required for a multi-role jewellery e-commerce platform. It enforces relational constraints, normalized tables, and indexes for fast retrieval. Tables are auto-created on server startup via `ensureTablesExist()` in `database.ts`.

---

## 2. Entity Relationship Diagram (ERD)

```
+------------------+          +---------------------+
|      users       |          |      categories      |
+------------------+          +---------------------+
  |                                     | 1
  | 1                                   *
  *                               +------------------+
+---------------+                 |     products     |
|  cart_items   |                 +------------------+
+---------------+                  | 1         | 1
+-------------------+              *           *
|  wishlist_items   |   +------------------+  +------------------------+
+-------------------+   |  product_images  |  | product_specifications |
                         +------------------+  +------------------------+
+------------------+ 1 ---- * +--------------+
|     orders       |          |  order_items |
+------------------+          +--------------+
+------------------+
|  homepage_config |
+------------------+
+------------------+
|    enquiries     |
+------------------+
```

---

## 3. Data Dictionary

### 3.1 `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Unique user ID |
| `name` | VARCHAR(100) | NOT NULL | Full name |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE, Indexed | Login email |
| `password` | VARCHAR(255) | NOT NULL | bcrypt password hash (salt round 10–12) |
| `phone` | VARCHAR(20) | NULL | Optional contact phone |
| `role` | ENUM | NOT NULL, Default `CUSTOMER` | `CUSTOMER`, `ADMIN`, `SUPER_ADMIN` |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Account creation time |
| `updated_at` | TIMESTAMP | Auto on update | Last modification time |

> **Default Super Admin**: `admin@aristatrinkets.com` / `admin123` (seeded on first startup)

---

### 3.2 `categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Unique category ID |
| `name` | VARCHAR(100) | NOT NULL | Category display name |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE, Indexed | URL-safe slug |
| `description` | TEXT | NULL | Category description |
| `image` | LONGTEXT | NULL | Base64 image or URL path |
| `item_count` | INT | NOT NULL, Default `0` | Live product count (auto-updated) |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Creation time |
| `updated_at` | TIMESTAMP | Auto on update | Last modification time |

---

### 3.3 `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Unique product ID |
| `category_id` | INT | FK → `categories.id` ON DELETE SET NULL | Category reference |
| `name` | VARCHAR(150) | NOT NULL | Product title |
| `slug` | VARCHAR(150) | NOT NULL, UNIQUE, Indexed | URL slug |
| `price` | DECIMAL(10,2) | NOT NULL, Indexed | Current sale price (INR) |
| `compare_at_price` | DECIMAL(10,2) | NULL | Original/strike-through price |
| `badge` | VARCHAR(50) | NULL | Display badge (`NEW`, `SALE`, etc.) |
| `metal_type` | VARCHAR(100) | NULL | Metal type (e.g. `18K Warm Gold`) |
| `gemstone` | VARCHAR(100) | NULL | Gemstone (e.g. `Diamond`, `Ruby`) |
| `in_stock` | BOOLEAN | NOT NULL, Default `TRUE`, Indexed | Stock availability flag |
| `stock_quantity` | INT | NOT NULL, Default `10` | Available stock count |
| `description` | TEXT | NULL | Product description |
| `materials` | TEXT | NULL | JSON array of materials |
| `care_guide` | TEXT | NULL | Care instructions |
| `shipping_info` | TEXT | NULL | Shipping details |
| `image` | LONGTEXT | NOT NULL | Primary product image (Base64 or URL) |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Creation time |
| `updated_at` | TIMESTAMP | Auto on update | Last modification time |

---

### 3.4 `product_images`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Image record ID |
| `product_id` | INT | NOT NULL, FK → `products.id` ON DELETE CASCADE | Parent product |
| `image_url` | LONGTEXT | NOT NULL | Image URL or Base64 |
| `sort_order` | INT | Default `0` | Display order index |

---

### 3.5 `product_specifications`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Spec record ID |
| `product_id` | INT | NOT NULL, FK → `products.id` ON DELETE CASCADE | Parent product |
| `spec_label` | VARCHAR(100) | NOT NULL | Specification name (e.g. `Metal Purity`) |
| `spec_value` | VARCHAR(255) | NOT NULL | Specification value (e.g. `18K`) |

---

### 3.6 `cart_items`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Cart item ID |
| `user_id` | INT | NULL, Indexed | Authenticated user ID (or null for guest) |
| `session_id` | VARCHAR(100) | NULL, Indexed | Guest session ID via `X-Session-Id` header |
| `product_id` | INT | NULL, FK → `products.id` ON DELETE CASCADE | Product reference |
| `slug` | VARCHAR(150) | NULL, Indexed | Product slug (fallback lookup) |
| `product_data` | JSON | NULL | Snapshot of product data |
| `metal_type` | VARCHAR(100) | NULL | Selected metal type variant |
| `quantity` | INT | NOT NULL, Default `1` | Item quantity |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Added time |
| `updated_at` | TIMESTAMP | Auto on update | Last modification; used for 30-day expiry purge |

---

### 3.7 `orders`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Order record ID |
| `order_number` | VARCHAR(50) | NOT NULL, UNIQUE, Indexed | Human-readable order code (e.g. `ART-928471`) |
| `user_id` | INT | NULL, Indexed | Registered user or null for guest |
| `customer_name` | VARCHAR(100) | NOT NULL | Customer full name |
| `customer_email` | VARCHAR(150) | NOT NULL | Customer email |
| `customer_phone` | VARCHAR(20) | NOT NULL | Customer phone |
| `shipping_address` | TEXT | NOT NULL | Street address |
| `city` | VARCHAR(100) | NOT NULL | City |
| `state` | VARCHAR(100) | NOT NULL | State |
| `pincode` | VARCHAR(20) | NOT NULL | Postal code |
| `subtotal` | DECIMAL(10,2) | NOT NULL | Order subtotal |
| `shipping_fee` | DECIMAL(10,2) | NOT NULL, Default `0.00` | Shipping charge |
| `tax` | DECIMAL(10,2) | NOT NULL, Default `0.00` | Tax amount |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Grand total |
| `payment_method` | ENUM | NOT NULL, Default `RAZORPAY` | `RAZORPAY`, `UPI`, `CARD`, `NETBANKING`, `COD` |
| `payment_status` | ENUM | NOT NULL, Default `PENDING` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| `razorpay_order_id` | VARCHAR(100) | NULL | Razorpay order ID |
| `razorpay_payment_id` | VARCHAR(100) | NULL | Razorpay payment ID |
| `order_status` | ENUM | NOT NULL, Default `PENDING`, Indexed | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Order placed time |
| `updated_at` | TIMESTAMP | Auto on update | Last status update |

---

### 3.8 `order_items`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Order item ID |
| `order_id` | INT | NOT NULL, FK → `orders.id` ON DELETE CASCADE | Parent order |
| `product_id` | INT | NULL | Product reference (optional snapshot) |
| `product_name` | VARCHAR(150) | NOT NULL | Frozen product name at time of order |
| `unit_price` | DECIMAL(10,2) | NOT NULL | Frozen unit price at time of order |
| `metal_type` | VARCHAR(100) | NULL | Selected metal type |
| `quantity` | INT | NOT NULL, Default `1` | Ordered quantity |
| `total_price` | DECIMAL(10,2) | NOT NULL | `unit_price × quantity` |

---

### 3.9 `homepage_config`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Config record ID |
| `section_key` | VARCHAR(100) | NOT NULL, UNIQUE | Config key (e.g. `editorial_photo`) |
| `section_label` | VARCHAR(150) | NOT NULL | Human-readable label |
| `image` | LONGTEXT | NULL | Image URL or Base64 |
| `updated_at` | TIMESTAMP | Auto on update | Last update time |

---

### 3.10 `wishlist_items`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Wishlist item ID |
| `user_id` | INT | NULL, Indexed | Authenticated user ID or null for guest |
| `session_id` | VARCHAR(100) | NULL, Indexed | Guest session ID |
| `product_id` | INT | NULL | Product reference |
| `slug` | VARCHAR(150) | NOT NULL, Indexed | Product slug |
| `product_data` | JSON | NULL | Snapshot of product data |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Added time |

---

### 3.11 `enquiries`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, Auto Increment | Enquiry ID |
| `name` | VARCHAR(100) | NOT NULL | Customer name |
| `email` | VARCHAR(150) | NOT NULL, Indexed | Customer email |
| `phone` | VARCHAR(20) | NULL | Optional phone number |
| `subject` | VARCHAR(200) | NULL | Enquiry subject / category |
| `message` | TEXT | NOT NULL | Message body |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` | Submission time |

---

## 4. Indexing Strategy

| Table | Indexed Columns | Purpose |
|---|---|---|
| `users` | `email`, `role` | Fast authentication & role queries |
| `categories` | `slug` | Public store URL lookups |
| `products` | `slug`, `price`, `in_stock` | Store filter, sort & search |
| `cart_items` | `user_id`, `session_id`, `slug` | Hybrid guest/user cart retrieval |
| `wishlist_items` | `user_id`, `session_id`, `slug` | Hybrid guest/user wishlist retrieval |
| `orders` | `order_number`, `order_status`, `user_id` | Order tracking & admin listing |
| `enquiries` | `email` | Admin enquiry lookup by email |

