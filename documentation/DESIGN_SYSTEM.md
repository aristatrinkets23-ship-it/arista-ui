# Arista Trinkets — Design System & Visual Standards

## 1. Overview
The Arista Trinkets Design System defines the luxury visual identity, typography, color palette, responsive layout scales, elevation, and component architecture for the e-commerce application.

---

## 2. Color System & Brand Tokens

The Client Brand Board serves as the single source of truth for branding colors:

```css
:root {
  /* Official Brand Colors */
  --brand-warm-gold: #CFA874;       /* Primary Metallic Accent */
  --brand-mocha-brown: #5B4636;     /* Primary Luxury Dark & Heading */
  --brand-soft-blush: #F7E9E6;      /* Secondary Accent */
  --brand-sage-mist: #DDE3D5;       /* Gemstone & Nature Accent */
  --brand-lavender-haze: #E8E3F3;   /* Subtle Luxury Shimmer */
  --brand-pearl-beige: #F2EFE8;     /* Neutral Background & Cards */

  /* Semantic UI Tokens */
  --color-primary: var(--brand-warm-gold);
  --color-secondary: var(--brand-mocha-brown);
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: var(--brand-pearl-beige);
  --color-bg-alt: var(--brand-soft-blush);
  --color-accent-sage: var(--brand-sage-mist);
  --color-accent-lavender: var(--brand-lavender-haze);
  
  --color-text-primary: var(--brand-mocha-brown);
  --color-text-secondary: #4A3A2C;
  --color-text-muted: #666666;
  --color-border: #E5E0D8;
  
  /* Status Indicators */
  --color-success: #2E7D32;
  --color-error: #D32F2F;
  --color-warning: #ED6C02;
  --color-info: #0288D1;
}
```

---

## 3. Fluid Typography Hierarchy

- **Headings**: `Playfair Display` (Serif, elegant editorial look)
- **Body & Controls**: `Montserrat` (Sans-Serif, high readability)

| Role | Font Family | Size Token | Weight | Line Height |
|---|---|---|---|---|
| **Display Header** | Playfair Display | `clamp(2.15rem, 5.5vw, 3.75rem)` | 700 | 1.15 |
| **Heading 1 (H1)** | Playfair Display | `clamp(1.75rem, 4vw, 2.5rem)` | 700 | 1.20 |
| **Heading 2 (H2)** | Playfair Display | `clamp(1.25rem, 2.5vw, 1.75rem)`| 600 | 1.25 |
| **Category Title** | Playfair Display | `clamp(0.95rem, 1.5vw, 1.15rem)`| 600 | 1.25 |
| **Product Title**  | Playfair Display | `clamp(0.95rem, 1.5vw, 1.15rem)`| 600 | 1.30 |
| **Body Hero**      | Montserrat       | `clamp(0.95rem, 1.8vw, 1.15rem)`| 400 / 500 | 1.60 |
| **Body Regular**   | Montserrat       | `0.95rem (15.2px)` | 400 / 500 | 1.60 |
| **Footer / Meta**  | Montserrat       | `0.92rem (14.7px)` | 400 / 500 | 1.50 |
| **Category Label** | Montserrat       | `0.78rem (12.5px)` | 700 | 1.20 (Uppercase, +1px letter-spacing) |
| **Button Text**    | Montserrat       | `0.88rem (14px)`   | 600 / 700 | 1.00 (Uppercase, +1px letter-spacing, min 44px height) |

---

## 4. Spacing & Container Scale

```css
--container-max-width: 1280px;

/* Responsive Container Side Padding */
Mobile (<576px): 16px
Tablet (576px-1199px): 24px
Desktop (1200px+): 32px

/* Product Grid Gaps */
Mobile (<576px): 12px
Tablet (576px-991px): 20px
Desktop (992px+): 24px
```

---

## 5. Component Layout Standards

- **Header**: Sticky 64px (mobile) / 76px (desktop) bar with top announcement bar, logo, desktop navigation, and 44x44px action buttons.
- **Product Card**: 1:1 image aspect-ratio, absolute top-right 34x34px wishlist button, top-left overlay badge, compact details flex container with no arbitrary giant min-height.
- **Category Card**: 1:1 image container with SVG vector illustrations, category name, item count, and gold hover border.
- **Footer**: 4-column desktop / 1-column mobile layout. Newsletter form stacks vertically on viewports `<480px` with 44px min-height controls.

---

## 6. Elevation & Shadows

```css
--shadow-sm: 0 2px 6px rgba(91, 70, 54, 0.06);
--shadow-md: 0 6px 16px rgba(91, 70, 54, 0.09);
--shadow-lg: 0 10px 28px rgba(91, 70, 54, 0.14);
--shadow-gold: 0 4px 20px rgba(207, 168, 116, 0.35);
```
