-- ============================================================================
-- ARISTA TRINKETS JEWELLERY — COMPLETE LIVE DATABASE SCHEMA & SEED DUMP
-- Includes:
--   1. Full Schema for 16 Tables
--   2. Default Super Admin: admin@aristatrinkets.com / admin123
--   3. Store Settings & Business Details
--   4. 4 Official Luxury Collections (Rings, Necklaces, Earrings, Bracelets)
--   5. 10 Ready-to-Sell Luxury Products with Multi-Angle Galleries & Specs
--
-- HOW TO USE:
--   Option A: Open phpMyAdmin -> Select your Database -> Click "Import" -> Select this file -> Click "Go"
--   Option B: Run via terminal: mysql -h <host> -u <user> -p <database_name> < complete_demo_seed.sql
-- ============================================================================

-- ============================================================================
-- ARISTA TRINKETS JEWELLERY — MYSQL 8+ PRODUCTION SCHEMA (16 TABLES)
-- ============================================================================

-- (Database creation skipped so tables are created directly in your active database, e.g. defaultdb on Aiven)


-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `role` ENUM('CUSTOMER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DEFAULT SUPER ADMIN CREDENTIALS (Email: admin@aristatrinkets.com / Password: admin123)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Arista Trinkets Administrator', 'admin@aristatrinkets.com', '$2b$10$Ma0BxZV/lLcKHz3CUsIiB.7CslblkKouOTu6jyMJQ8k0PINhw1i9O', 'SUPER_ADMIN');

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `image` LONGTEXT DEFAULT NULL,
  `item_count` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `price` DECIMAL(10, 2) NOT NULL,
  `compare_at_price` DECIMAL(10, 2) DEFAULT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `metal_type` VARCHAR(100) DEFAULT NULL,
  `gemstone` VARCHAR(100) DEFAULT NULL,
  `in_stock` BOOLEAN NOT NULL DEFAULT TRUE,
  `stock_quantity` INT NOT NULL DEFAULT 10,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `description` TEXT DEFAULT NULL,
  `materials` TEXT DEFAULT NULL,
  `care_guide` TEXT DEFAULT NULL,
  `shipping_info` TEXT DEFAULT NULL,
  `image` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  INDEX `idx_product_slug` (`slug`),
  INDEX `idx_product_price` (`price`),
  INDEX `idx_product_stock` (`in_stock`),
  INDEX `idx_product_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` LONGTEXT NOT NULL,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PRODUCT SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS `product_specifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `spec_label` VARCHAR(100) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. HOMEPAGE CONFIG TABLE
CREATE TABLE IF NOT EXISTS `homepage_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_key` VARCHAR(100) NOT NULL UNIQUE,
  `section_label` VARCHAR(150) NOT NULL,
  `image` LONGTEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `homepage_config` (`section_key`, `section_label`, `image`) VALUES
('editorial_photo', 'Artisanal Excellence Photo', '/assets/images/editorial-artisanal-craft.jpg');

-- 7. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `session_id` VARCHAR(100) DEFAULT NULL,
  `product_id` INT DEFAULT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `product_data` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_wishlist_user` (`user_id`),
  INDEX `idx_wishlist_session` (`session_id`),
  INDEX `idx_wishlist_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CARTS TABLE
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `session_id` VARCHAR(100) DEFAULT NULL,
  `product_id` INT DEFAULT NULL,
  `slug` VARCHAR(150) DEFAULT NULL,
  `product_data` JSON DEFAULT NULL,
  `metal_type` VARCHAR(100) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cart_user` (`user_id`),
  INDEX `idx_cart_session` (`session_id`),
  INDEX `idx_cart_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `invoice_number` VARCHAR(50) UNIQUE DEFAULT NULL,
  `tracking_code` VARCHAR(20) UNIQUE DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `shipping_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('RAZORPAY', 'UPI', 'CARD', 'NETBANKING', 'COD') NOT NULL DEFAULT 'RAZORPAY',
  `payment_status` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `razorpay_order_id` VARCHAR(100) DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(100) DEFAULT NULL,
  `order_status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `processing_at` TIMESTAMP NULL DEFAULT NULL,
  `shipped_at` TIMESTAMP NULL DEFAULT NULL,
  `delivered_at` TIMESTAMP NULL DEFAULT NULL,
  `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
  `cancellation_reason` VARCHAR(255) DEFAULT NULL,
  `cancelled_by` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_number` (`order_number`),
  INDEX `idx_tracking_code` (`tracking_code`),
  INDEX `idx_invoice_number` (`invoice_number`),
  INDEX `idx_order_status` (`order_status`),
  INDEX `idx_order_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT DEFAULT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `metal_type` VARCHAR(100) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `total_price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `subject` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_enquiries_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. PASSWORD RESETS TABLE
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL,
  `otp` VARCHAR(6) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pwreset_email` (`email`),
  INDEX `idx_pwreset_otp` (`otp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. USER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `user_email` VARCHAR(150) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address_line` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_addr_user_id` (`user_id`),
  INDEX `idx_addr_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `store_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `store_settings` (`setting_key`, `setting_value`) VALUES
('gst_number', '24AAACA1234A1Z5'),
('gst_percentage', '3.0'),
('delivery_charge', '50.00'),
('free_delivery_threshold', '600.00'),
('company_name', 'Arista Trinkets'),
('company_address', 'Studio 101, Jewel Arcade, Near City Centre, Surat, Gujarat - 395001'),
('company_phone', '9016134899'),
('company_email', 'info@aristatrinkets.com'),
('company_timing', 'Mon – Sat: 10:00 AM – 7:00 PM IST'),
('invoice_prefix', 'INV-');

-- 15. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_newsletter_email` (`email`),
  INDEX `idx_newsletter_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- LUXURY CATEGORIES DATA SEED
-- ============================================================================

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`) VALUES (
  1,
  'Rings',
  'rings',
  'Solitaire, eternity bands, and handcrafted luxury statement rings in 18K gold and platinum.',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  0
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `image` = VALUES(`image`);

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`) VALUES (
  2,
  'Necklaces & Pendants',
  'necklaces',
  'Timeless pendants, gold chains, and regal gemstone chokers designed for effortless elegance.',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  0
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `image` = VALUES(`image`);

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`) VALUES (
  3,
  'Earrings',
  'earrings',
  'Diamond studs, South Sea pearl drops, and contemporary gold hoops for every occasion.',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
  0
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `image` = VALUES(`image`);

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `item_count`) VALUES (
  4,
  'Bracelets & Bangles',
  'bracelets',
  'Classic tennis bracelets, stacked gold bangles, and artisanal cuffs.',
  '/assets/images/occasion-festive.webp',
  0
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `description` = VALUES(`description`), `image` = VALUES(`image`);

-- ============================================================================
-- LUXURY PRODUCTS DATA SEED (10 LIVE PRODUCTS)
-- ============================================================================

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  1,
  1,
  'Celestial Solitaire Diamond Ring',
  'celestial-solitaire-diamond-ring',
  28500,
  34000,
  'BESTSELLER',
  '18K Warm Gold',
  'Solitaire Diamond (VVS1)',
  1,
  15,
  1,
  'A breathtaking 18K warm gold solitaire ring featuring a brilliant 0.50-carat VVS1 diamond held in a refined 4-prong setting. Designed to capture light from every angle.',
  '18K Warm Gold (750 Hallmarked), Conflict-Free VVS1 Diamond',
  'Clean gently with mild warm soapy water and a soft-bristled brush. Store individually in your velvet Arista box.',
  'Insured express shipping in 2-4 business days. Includes Certificate of Authenticity.',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  2,
  1,
  'Aura Emerald Cut Eternity Band',
  'aura-emerald-cut-eternity-band',
  19800,
  24000,
  'TRENDING',
  '18K Rose Gold',
  'Colombian Emerald & Diamonds',
  1,
  8,
  1,
  'An exquisite eternity ring featuring alternating emerald-cut Colombian emeralds and pavé-set round brilliant diamonds in 18K rose gold.',
  '18K Rose Gold, Natural Colombian Emeralds, Natural Diamonds',
  'Avoid direct exposure to harsh household chemicals, perfumes, or thermal shocks.',
  'Complimentary insured courier delivery with gift wrapping.',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  3,
  1,
  'Imperial Royal Sapphire Ring',
  'imperial-royal-sapphire-ring',
  32000,
  38500,
  'EXCLUSIVE',
  'Platinum 950',
  'Ceylon Royal Blue Sapphire',
  1,
  5,
  1,
  'A masterpiece of royal heritage. A deep Ceylon blue oval sapphire framed by a halo of micro-pave diamonds in pure Platinum 950.',
  'Platinum 950, Natural Ceylon Sapphire, VS Diamonds',
  'Store separately. Professional ultrasonic cleaning recommended annually.',
  'Delivered in a handcrafted wooden Arista Atelier vault case.',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  4,
  2,
  'Elysian Pearl & Diamond Pendant',
  'elysian-pearl-diamond-pendant',
  14500,
  18000,
  'BESTSELLER',
  '18K Warm Gold',
  'South Sea Pearl',
  1,
  12,
  1,
  'A lustrous 10mm South Sea pearl suspended from an intricate 18K warm gold motif encrusted with round accent diamonds. Includes an 18-inch adjustable chain.',
  '18K Warm Gold, Natural South Sea Pearl, Round Diamonds',
  'Pearls are organic. Put on your pearl jewellery after applying cosmetics, hairspray, and perfume.',
  'Ships within 48 hours. Includes velvet presentation box.',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  5,
  2,
  'Linked Venetian Gold Chain',
  'linked-venetian-gold-chain',
  12800,
  15000,
  'NEW',
  '18K Warm Gold',
  'Pure Gold',
  1,
  20,
  1,
  'Interlocking 18K warm gold oval links hand-polished to a high mirror sheen. A versatile luxury staple worn solo or layered.',
  'Solid 18K Warm Gold (750)',
  'Polishing cloth included. Safe for daily wear.',
  'Express delivery with tracking code.',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  6,
  2,
  'Artisan Emerald Choker Necklace',
  'artisan-emerald-choker-necklace',
  42000,
  48000,
  'EXCLUSIVE',
  '18K Yellow Gold',
  'Zambian Emerald & Diamonds',
  1,
  4,
  1,
  'A showstopping statement choker adorned with 5 pear-cut Zambian emeralds flanked by brilliant baguette-cut diamonds.',
  '18K Yellow Gold, Natural Emeralds, Baguette Diamonds',
  'Handle with extreme care. Keep away from water and oil.',
  'White-glove courier delivery with security seal.',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  7,
  3,
  'Estelle Pavé Diamond Gold Hoops',
  'estelle-pave-diamond-gold-hoops',
  8900,
  11500,
  'TRENDING',
  '18K Yellow Gold',
  'Pavé Diamonds',
  1,
  18,
  1,
  'Elegant 18K yellow gold huggie hoops encrusted with micro pavé diamonds along the outer curve for luminous shimmer.',
  '18K Yellow Gold, Round Diamonds',
  'Wipe with micro-fiber cloth after use.',
  'Standard 2-3 day shipping.',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  8,
  3,
  'Solstice Pearl Drop Earrings',
  'solstice-pearl-drop-earrings',
  6500,
  NULL,
  'NEW',
  'Sterling Silver 925',
  'Baroque Pearl',
  1,
  15,
  1,
  'Irregular natural baroque pearls suspended from textured sterling silver french wires. Every pair is uniquely one-of-a-kind.',
  'Sterling Silver 925, Natural Freshwater Baroque Pearls',
  'Keep away from moisture and direct sunlight.',
  'Ships in Arista eco-luxury pouch.',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  9,
  4,
  'Amora Diamond Tennis Bracelet',
  'amora-diamond-tennis-bracelet',
  38000,
  45000,
  'BESTSELLER',
  '18K White Gold',
  'Round Diamonds (2.0 ct)',
  1,
  7,
  1,
  'A seamless line of 52 matching round brilliant diamonds set in liquid-smooth 18K white gold. Secured with a double-safety lock.',
  '18K White Gold, 52 Round Diamonds',
  'Professional annual check for clasp tension recommended.',
  'Insured priority courier delivery.',
  '/assets/images/occasion-festive.webp'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `price`, `compare_at_price`, `badge`,
  `metal_type`, `gemstone`, `in_stock`, `stock_quantity`, `is_active`,
  `description`, `materials`, `care_guide`, `shipping_info`, `image`
) VALUES (
  10,
  4,
  'Knot of Love Bangle Set',
  'knot-of-love-bangle-set',
  16400,
  NULL,
  'NEW',
  '18K Rose Gold',
  'Cubic Zirconia Accents',
  1,
  14,
  1,
  'A set of three stackable 18K rose gold bangles tied together with a sparkling pavé knot motif symbolizing everlasting bonds.',
  '18K Rose Gold Plated Silver, Cubic Zirconia',
  'Avoid contact with harsh detergents and pool water.',
  'Arista gift box included.',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80'
) ON DUPLICATE KEY UPDATE
  `category_id` = VALUES(`category_id`),
  `name` = VALUES(`name`),
  `price` = VALUES(`price`),
  `compare_at_price` = VALUES(`compare_at_price`),
  `badge` = VALUES(`badge`),
  `metal_type` = VALUES(`metal_type`),
  `gemstone` = VALUES(`gemstone`),
  `in_stock` = VALUES(`in_stock`),
  `stock_quantity` = VALUES(`stock_quantity`),
  `is_active` = VALUES(`is_active`),
  `description` = VALUES(`description`),
  `materials` = VALUES(`materials`),
  `care_guide` = VALUES(`care_guide`),
  `shipping_info` = VALUES(`shipping_info`),
  `image` = VALUES(`image`);

-- ============================================================================
-- PRODUCT GALLERY IMAGES
-- ============================================================================

DELETE FROM `product_images`;
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES
(1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80', 0),
(1, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80', 1),
(1, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80', 2),
(2, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80', 0),
(2, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80', 1),
(3, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=900&q=80', 0),
(3, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80', 1),
(4, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80', 0),
(4, '/assets/images/occasion-festive.webp', 1),
(5, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 0),
(5, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80', 1),
(6, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80', 0),
(6, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80', 1),
(7, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80', 0),
(7, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80', 1),
(8, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80', 0),
(8, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80', 1),
(9, '/assets/images/occasion-festive.webp', 0),
(9, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', 1),
(10, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80', 0),
(10, '/assets/images/occasion-festive.webp', 1);

-- ============================================================================
-- PRODUCT SPECIFICATIONS
-- ============================================================================

DELETE FROM `product_specifications`;
INSERT INTO `product_specifications` (`product_id`, `spec_label`, `spec_value`) VALUES
(1, 'Metal Purity', '18K Warm Gold (750)'),
(1, 'Diamond Carat Weight', '0.50 ct'),
(1, 'Diamond Clarity', 'VVS1 / Color E'),
(1, 'Certification', 'IGI & BIS Hallmarked'),
(2, 'Metal', '18K Rose Gold'),
(2, 'Gemstone Weight', '1.20 ct Total'),
(2, 'Band Width', '3.2 mm'),
(2, 'Hallmark', 'BIS 750 Stamped'),
(3, 'Metal', 'Platinum 950'),
(3, 'Center Stone', 'Ceylon Blue Sapphire (1.8 ct)'),
(3, 'Halo Stones', '32 Brilliant Diamonds'),
(3, 'Certification', 'GIA Certified'),
(4, 'Metal', '18K Warm Gold'),
(4, 'Pearl Size', '10 mm South Sea'),
(4, 'Chain Length', '18 inches (Adjustable)'),
(4, 'Clasp Type', 'Lobster Claw Clasp'),
(5, 'Material', 'Solid 18K Gold'),
(5, 'Link Width', '4.5 mm'),
(5, 'Weight', '8.4 grams'),
(5, 'Stamp', 'BIS 750 Hallmarked'),
(6, 'Metal', '18K Yellow Gold'),
(6, 'Total Emerald Carat', '3.50 ct'),
(6, 'Diamond Carat', '1.80 ct'),
(6, 'Necklace Length', '16 - 18 inches'),
(7, 'Metal', '18K Yellow Gold'),
(7, 'Hoop Diameter', '15 mm'),
(7, 'Closure', 'Snap Back Catch'),
(7, 'Diamond Weight', '0.35 ct Total'),
(8, 'Metal', '925 Sterling Silver'),
(8, 'Pearl Type', 'Freshwater Baroque'),
(8, 'Drop Length', '32 mm'),
(8, 'Earring Post', 'French Hook'),
(9, 'Metal', '18K White Gold'),
(9, 'Diamond Carat', '2.00 ct Total'),
(9, 'Bracelet Length', '7.0 inches'),
(9, 'Clasp', 'Double Safety Push Latch'),
(10, 'Metal Finish', '18K Rose Gold'),
(10, 'Quantity', 'Set of 3 Stackable Bangles'),
(10, 'Inner Diameter', '62 mm'),
(10, 'Weight', '14.2 grams');

-- ============================================================================
-- RECALCULATE & SYNC CATEGORY ITEM COUNTS
-- ============================================================================

UPDATE `categories` c
SET c.`item_count` = (
  SELECT COUNT(*) FROM `products` p WHERE p.`category_id` = c.`id` AND p.`is_active` = 1
);

-- ============================================================================
-- END OF SEED SCRIPT
-- ============================================================================
