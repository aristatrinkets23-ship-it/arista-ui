# Arista Trinkets — Database Entity Relationship & Data Dictionary

## 1. Overview
The **Arista Trinkets** MySQL database (`arista_trinkets_db`) stores all entity records required for a multi-role jewellery e-commerce platform. It enforces relational constraints, normalized tables, and indexes for fast retrieval.

---

## 2. Entity Relationship Diagram (ERD) Structure

```
+----------------+          +--------------------+          +--------------------+
|     users      | 1 ---- * |   user_addresses   |          |     categories     |
+----------------+          +--------------------+          +--------------------+
  |        |                                                    | (parent_id)
  | 1      | 1                                                  | 1
  *        *                                                    *
+------------+  +--------------+                    +--------------------+
|   carts    |  |  wishlists   |                    |      products      |
+------------+  +--------------+                    +--------------------+
  | 1                                                 | 1            | 1
  *                                                   *              *
+------------+                                  +--------------+  +--------------+
| cart_items |                                  |product_images|  |  inventory   |
+------------+                                  +--------------+  +--------------+
                                                      |
                                                      v
+----------------+ 1 ---- * +---------------+ * ---- 1 +--------------------+
|     orders     |          |  order_items  |          |      reviews       |
+----------------+          +---------------+          +--------------------+
```

---

## 3. Data Dictionary

### 3.1 `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Unique user ID |
| `first_name` | VARCHAR(50) | NOT NULL | Customer/Admin first name |
| `last_name` | VARCHAR(50) | NOT NULL | Customer/Admin last name |
| `email` | VARCHAR(100) | NOT NULL, Unique, Index | User login email |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt password hash |
| `role` | ENUM | NOT NULL, Default 'CUSTOMER' | `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`, `INVENTORY_MANAGER` |
| `is_active` | BOOLEAN | Default TRUE | Soft lock toggle |

### 3.2 `products`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Unique product ID |
| `category_id` | BIGINT UNSIGNED | FK -> `categories.id` | Category reference |
| `name` | VARCHAR(255) | NOT NULL | Product title |
| `slug` | VARCHAR(280) | NOT NULL, Unique, Index | URL slug |
| `sku` | VARCHAR(50) | NOT NULL, Unique, Index | Stock Keeping Unit identifier |
| `metal_type` | VARCHAR(50) | NULL | Metal type (Gold, Silver, Platinum) |
| `metal_purity` | VARCHAR(50) | NULL | Metal purity (18K, 22K, 925 Sterling) |
| `price` | DECIMAL(10,2) | NOT NULL, Index | Current sale price |
| `compare_at_price`| DECIMAL(10,2) | NULL | Original price before discount |

### 3.3 `orders`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PK, Auto Increment | Unique order record ID |
| `order_number` | VARCHAR(50) | NOT NULL, Unique, Index | Human-readable order code (e.g. `AT-2026-9041`) |
| `user_id` | BIGINT UNSIGNED | FK -> `users.id` (NULL) | Registered user reference or guest |
| `status` | ENUM | Default 'PENDING', Index | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED` |
| `payment_status` | ENUM | Default 'UNPAID' | `UNPAID`, `PAID`, `FAILED`, `REFUNDED` |
| `shipping_address`| JSON | NOT NULL | Frozen copy of shipping address |
| `total_amount` | DECIMAL(10,2) | NOT NULL | Grand total after tax & discounts |

---

## 4. Indexing Strategy
- **`products`**: `(is_active, is_featured)`, `price`, `slug`, `sku` for instantaneous store filter response.
- **`orders`**: `order_number`, `status`, `user_id` for fast portal lookup.
- **`users`**: `email` unique index for authentication lookup.
