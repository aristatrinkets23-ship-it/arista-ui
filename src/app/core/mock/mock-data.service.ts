import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductCardData } from '../models/product-card-data.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartService } from '../services/cart.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

const STORAGE_KEY_PRODUCTS = 'arista_mock_products_v2';
const STORAGE_KEY_CATEGORIES = 'arista_mock_categories_v2';

export function getDefaultCategoryImage(nameOrSlug?: string): string {
  if (!nameOrSlug) return '/assets/images/placeholder-jewellery.svg';
  const s = nameOrSlug.toLowerCase();
  if (s.includes('ring')) return '/assets/images/placeholder-rings.svg';
  if (s.includes('necklace') || s.includes('pendant') || s.includes('choker')) return '/assets/images/placeholder-necklaces.svg';
  if (s.includes('earring') || s.includes('stud') || s.includes('hoop')) return '/assets/images/placeholder-earrings.svg';
  if (s.includes('bracelet') || s.includes('bangle') || s.includes('cuff')) return '/assets/images/placeholder-bracelets.svg';
  return '/assets/images/placeholder-jewellery.svg';
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private initialCategories: Category[] = [
    {
      id: 'cat-rings',
      name: 'Rings',
      slug: 'rings',
      description: 'Handcrafted solitaire, halo, and eternity rings set in 18K gold and sterling silver.',
      image: '/assets/images/slideshow-couple-rings.jpg',
      itemCount: 42,
      featured: true
    },
    {
      id: 'cat-necklaces',
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Elegant chokers, pendants, and layered chains designed to accentuate every neckline.',
      image: '/assets/images/slideshow-girl-necklace.jpg',
      itemCount: 36,
      featured: true
    },
    {
      id: 'cat-earrings',
      name: 'Earrings',
      slug: 'earrings',
      description: 'Luminous freshwater pearl drop earrings, diamond studs, and handcrafted gold hoops.',
      image: '/assets/images/slideshow-earrings.jpg',
      itemCount: 28,
      featured: true
    },
    {
      id: 'cat-bracelets',
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Timeless diamond cuff bracelets, delicate tennis chains, and signature bangles.',
      image: '/assets/images/slideshow-bangles.jpg',
      itemCount: 24,
      featured: true
    }
  ];

  private categories: Category[] = [];

  private initialProducts: Product[] = [
    {
      id: 1,
      name: 'Eternal Solitaire Diamond Ring',
      slug: 'eternal-solitaire-diamond-ring',
      image: '/assets/images/slideshow-couple-rings.jpg',
      images: [
        '/assets/images/slideshow-couple-rings.jpg',
        '/assets/images/slideshow-rings.jpg'
      ],
      price: 45000,
      compareAtPrice: 52000,
      badge: 'FEATURED',
      category: 'Rings',
      available: true,
      inStock: true,
      stockQuantity: 12,
      description: 'A brilliant 1.2-carat ethically sourced round solitaire diamond crowned upon an 18K warm gold band with delicate diamond micro-pave detailing.',
      materials: ['18K Warm Gold', 'Ethically Sourced Diamond'],
      careGuide: 'Clean gently with lukewarm soapy water and a soft microfiber cloth. Store separately in velvet pouch.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days. Includes official Arista Certificate of Authenticity.',
      metalType: '18K Warm Gold',
      gemstone: 'Diamond (1.2 ct)',
      specifications: [
        { label: 'Metal', value: '18K Warm Gold' },
        { label: 'Gemstone Weight', value: '1.20 Carat' },
        { label: 'Clarity', value: 'VVS1' },
        { label: 'Color Grade', value: 'F (Colorless)' },
        { label: 'Certification', value: 'Arista Fine Jewellery Hallmark' }
      ]
    },
    {
      id: 2,
      name: 'Royal Heritage Gold Choker',
      slug: 'royal-heritage-gold-choker',
      image: '/assets/images/slideshow-girl-necklace.jpg',
      images: [
        '/assets/images/slideshow-girl-necklace.jpg',
        '/assets/images/slideshow-ref-1.jpg'
      ],
      price: 89000,
      compareAtPrice: 95000,
      badge: 'NEW',
      category: 'Necklaces',
      available: true,
      inStock: true,
      stockQuantity: 6,
      description: 'Inspired by classical royal heritage, this hand-engraved 18K solid gold choker features intricate filigree craftsmanship and subtle blush accents.',
      materials: ['18K Warm Gold', 'Filigree Wire Work'],
      careGuide: 'Avoid contact with perfumes, hairsprays, and harsh household chemicals.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Solid Gold',
      specifications: [
        { label: 'Metal', value: '18K Yellow Gold' },
        { label: 'Length', value: '16 Inches (Adjustable)' },
        { label: 'Finish', value: 'Satin & Polished Gold' },
        { label: 'Weight', value: '28.5 Grams' }
      ]
    },
    {
      id: 3,
      name: 'Celestial Pearl Drop Earrings',
      slug: 'celestial-pearl-drop-earrings',
      image: '/assets/images/slideshow-earrings.jpg',
      images: [
        '/assets/images/slideshow-earrings.jpg',
        '/assets/images/slideshow-1.jpg'
      ],
      price: 24500,
      compareAtPrice: 28000,
      badge: 'SALE',
      category: 'Earrings',
      available: true,
      inStock: true,
      stockQuantity: 15,
      description: 'Luminous Grade-AAA Japanese Akoya freshwater pearls suspended beneath sparkling star-set brilliant diamond studs.',
      materials: ['Grade AAA Akoya Pearl', 'Sterling Silver', 'Brilliant Diamond'],
      careGuide: 'Pearls love natural oils. Put on after cosmetics application.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: 'Sterling Silver with Gold Finish',
      gemstone: 'Freshwater Pearl & Diamond',
      specifications: [
        { label: 'Metal', value: 'Sterling Silver 925' },
        { label: 'Pearl Type', value: 'Natural Akoya Pearl 9mm' },
        { label: 'Diamond Weight', value: '0.15 Carat Total' },
        { label: 'Closure', value: 'Secure Push-Back Post' }
      ]
    },
    {
      id: 4,
      name: 'Classic Diamond Cuff Bracelet',
      slug: 'classic-diamond-cuff-bracelet',
      image: '/assets/images/slideshow-bangles.jpg',
      images: [
        '/assets/images/slideshow-bangles.jpg',
        '/assets/images/slideshow-2.jpg'
      ],
      price: 62000,
      compareAtPrice: 68000,
      badge: 'BESTSELLER',
      category: 'Bracelets',
      available: true,
      inStock: true,
      stockQuantity: 8,
      description: 'A sleek open-cuff bracelet featuring twin brilliant diamond solitaire terminals set in warm gold with high polish finish.',
      materials: ['18K Warm Gold', 'Brilliant Diamonds'],
      careGuide: 'Wipe down gently after wearing with included polishing cloth.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Warm Gold',
      gemstone: 'Diamond (0.45 ct)',
      specifications: [
        { label: 'Metal', value: '18K Warm Gold' },
        { label: 'Diamond Weight', value: '0.45 Carat Total' },
        { label: 'Inner Circumference', value: '6.5 Inches' },
        { label: 'Style', value: 'Flex Open Cuff' }
      ]
    },
    {
      id: 5,
      name: 'Rose Gold Eternity Band',
      slug: 'rose-gold-eternity-band',
      image: '/assets/images/slideshow-rings.jpg',
      images: [
        '/assets/images/slideshow-rings.jpg',
        '/assets/images/slideshow-couple-rings.jpg'
      ],
      price: 38500,
      badge: 'NEW',
      category: 'Rings',
      available: true,
      inStock: true,
      stockQuantity: 10,
      description: 'A continuous band of hand-selected round brilliant diamonds claw-set in soft warm rose gold.',
      materials: ['18K Rose Gold', 'Conflict-Free Diamonds'],
      careGuide: 'Clean with warm soapy water.',
      shippingInfo: 'Complimentary insured express delivery.',
      metalType: '18K Rose Gold',
      gemstone: 'Diamond (0.75 ct)',
      specifications: [
        { label: 'Metal', value: '18K Rose Gold' },
        { label: 'Diamond Weight', value: '0.75 Carat Total' },
        { label: 'Width', value: '2.5 mm' }
      ]
    },
    {
      id: 6,
      name: 'Layered Gold Coin Pendant',
      slug: 'layered-gold-coin-pendant',
      image: '/assets/images/slideshow-girl-necklace.jpg',
      images: [
        '/assets/images/slideshow-girl-necklace.jpg',
        '/assets/images/slideshow-ref-3.jpg'
      ],
      price: 31000,
      compareAtPrice: 35000,
      badge: 'SALE',
      category: 'Necklaces',
      available: true,
      inStock: true,
      stockQuantity: 14,
      description: 'A double-strand layered necklace holding a antique-inspired embossed gold medallion.',
      materials: ['14K Warm Gold Plated Sterling Silver'],
      careGuide: 'Keep dry and store in soft pouch.',
      shippingInfo: 'Complimentary insured express delivery.',
      metalType: '14K Gold Plated Silver',
      specifications: [
        { label: 'Metal', value: '14K Gold over 925 Silver' },
        { label: 'Chain Length', value: '18 + 20 Inches Layered' }
      ]
    }
  ];

  private products: Product[] = [];
  private cartService = inject(CartService);

  constructor() {
    this.loadCategoriesFromStorage();
    this.loadProductsFromStorage();
    this.refreshFromApi();
  }

  async refreshFromApi(): Promise<void> {
    try {
      const prodRes = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData && prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          const apiProducts = prodData.data.map((p: any) => {
            let img = p.image ? p.image.trim() : '';
            const catName = p.category_name || p.category || 'Rings';
            const fallbackImg = getDefaultCategoryImage(catName);
            if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
              img = '/' + img;
            }
            const finalImg = img || fallbackImg;
            return {
              id: Number(p.id),
              name: p.name,
              slug: p.slug,
              image: finalImg,
              images: p.images || [finalImg],
              price: Number(p.price),
              compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
              badge: p.badge || undefined,
              category: catName,
              available: true,
              inStock: Boolean(p.in_stock !== 0),
              stockQuantity: Number(p.stock_quantity || 10),
              description: p.description || '',
              materials: p.materials ? (typeof p.materials === 'string' ? p.materials.split(',') : p.materials) : ['18K Warm Gold'],
              careGuide: p.care_guide || '',
              shippingInfo: p.shipping_info || '',
              metalType: p.metal_type || '18K Warm Gold',
              gemstone: p.gemstone || '',
              specifications: p.specifications || []
            };
          });

          // Merge API products with local mock products (keep newly added local items if offline)
          this.products = apiProducts;
          this.saveProductsToStorage();
        }
      }
    } catch (err) {
      // Backend offline fallback
    }

    try {
      const catRes = await fetch(API_ENDPOINTS.PRODUCTS.CATEGORIES);
      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData && catData.success && Array.isArray(catData.data) && catData.data.length > 0) {
          const apiCategories = catData.data.map((c: any) => {
            let img = c.image ? c.image.trim() : '';
            const fallbackImg = getDefaultCategoryImage(c.slug || c.name);
            if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
              img = '/' + img;
            }
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              image: img || fallbackImg,
              itemCount: Number(c.item_count || 0),
              featured: true
            };
          });
          this.categories = apiCategories;
          this.saveCategoriesToStorage();
        }
      }
    } catch (err) {
      // Backend offline fallback
    }
  }

  private loadCategoriesFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.categories = parsed.map((cat: Category) => {
            let img = cat.image ? cat.image.trim() : '';
            if (!img || img === '') {
              img = getDefaultCategoryImage(cat.slug || cat.name);
            } else if (!img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
              img = '/' + img;
            }
            return {
              ...cat,
              image: img
            };
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse arista_mock_categories from localStorage:', err);
    }
    this.categories = [...this.initialCategories];
    this.saveCategoriesToStorage();
  }

  private saveCategoriesToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
    } catch (err) {
      console.warn('Failed to save arista_mock_categories to localStorage:', err);
    }
  }

  private loadProductsFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.products = parsed.map((p: Product) => {
            // Auto-migrate old SVG placeholders to high-res photography
            if (!p.image || p.image.endsWith('.svg') || p.image.includes('placeholder')) {
              const defaultMatch = this.initialProducts.find(ip => ip.id === p.id || ip.slug === p.slug);
              if (defaultMatch) {
                return { ...p, image: defaultMatch.image };
              }
            }
            return p;
          });
          this.saveProductsToStorage();
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse arista_mock_products_v2 from localStorage:', err);
    }
    this.products = [...this.initialProducts];
    this.saveProductsToStorage();
  }

  private saveProductsToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
    } catch (err) {
      console.warn('Failed to save arista_mock_products to localStorage:', err);
    }
  }

  getCategories(): Observable<Category[]> {
    this.refreshFromApi();
    return of(this.categories);
  }

  addCategory(newCat: Partial<Category>): Category {
    const slug = (newCat.slug || newCat.name || 'category-' + Date.now()).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const id = 'cat-' + slug;
    const defaultImg = getDefaultCategoryImage(slug);

    const fullCat: Category = {
      id,
      name: newCat.name || 'New Collection',
      slug,
      description: newCat.description || 'Exquisite fine jewellery collection by Arista Trinkets.',
      image: newCat.image && newCat.image.trim() !== '' ? newCat.image.trim() : defaultImg,
      itemCount: newCat.itemCount || 0,
      featured: newCat.featured !== undefined ? newCat.featured : true,
      heroBanner: newCat.heroBanner || newCat.image || defaultImg
    };

    const index = this.categories.findIndex(c => c.slug === slug || c.id === id);
    if (index !== -1) {
      this.categories[index] = fullCat;
    } else {
      this.categories.unshift(fullCat);
    }

    this.saveCategoriesToStorage();
    return fullCat;
  }

  deleteCategory(id: string | number): void {
    this.categories = this.categories.filter(c => c.id !== id && c.slug !== id);
    this.saveCategoriesToStorage();
  }

  updateCategory(id: string | number, updated: Partial<Category>): void {
    const index = this.categories.findIndex(c => c.id === id || c.slug === id);
    if (index !== -1) {
      const existing = this.categories[index];
      this.categories[index] = {
        ...existing,
        ...updated,
        heroBanner: updated.image || updated.heroBanner || existing.heroBanner
      };
      this.saveCategoriesToStorage();
    }
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const found = this.categories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    return of(found);
  }

  getFeaturedProducts(): Observable<ProductCardData[]> {
    this.refreshFromApi();
    return of(this.products.slice(0, 4));
  }

  getProducts(categorySlug?: string, sortBy?: string): Observable<ProductCardData[]> {
    this.refreshFromApi();
    let result = [...this.products];

    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === categorySlug.toLowerCase());
    }

    if (sortBy) {
      if (sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'newest') {
        result.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
      }
    }

    return of(result);
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    const lowerSlug = slug.toLowerCase();
    let found = this.products.find(p => p.slug.toLowerCase() === lowerSlug || p.id.toString() === slug);
    if (!found) {
      found = this.products.find(p => p.slug.includes(lowerSlug)) || this.products[0];
    }
    return of(found);
  }

  getRelatedProducts(currentSlug: string): Observable<ProductCardData[]> {
    const related = this.products.filter(p => p.slug !== currentSlug).slice(0, 4);
    return of(related);
  }

  addProduct(newProd: Partial<Product>): Product {
    const id = Date.now();
    const slug = (newProd.name || 'product-' + id).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const image = newProd.image || '/assets/images/placeholder-jewellery.svg';

    const fullProduct: Product = {
      id,
      name: newProd.name || 'New Jewellery Creation',
      slug,
      image,
      images: newProd.images && newProd.images.length > 0 ? newProd.images : [image, '/assets/images/placeholder-jewellery.svg'],
      price: Number(newProd.price) || 0,
      compareAtPrice: newProd.compareAtPrice ? Number(newProd.compareAtPrice) : undefined,
      badge: (newProd.badge as any) || undefined,
      category: newProd.category || 'Rings',
      available: true,
      inStock: true,
      stockQuantity: newProd.stockQuantity || 10,
      description: newProd.description || 'Exquisite handcrafted fine jewellery piece by Arista Trinkets.',
      materials: ['18K Warm Gold', 'Fine Gemstones'],
      careGuide: 'Handle with care. Store in protective velvet box.',
      shippingInfo: 'Complimentary insured express delivery within 3-5 business days.',
      metalType: '18K Warm Gold',
      specifications: [
        { label: 'Category', value: newProd.category || 'Rings' },
        { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' }
      ]
    };

    this.products.unshift(fullProduct);
    this.saveProductsToStorage();
    return fullProduct;
  }

  updateProduct(id: number, updated: Partial<Product>): void {
    const targetIdNum = Number(id);
    const index = this.products.findIndex(p => p.id === targetIdNum || p.id.toString() === id.toString());
    if (index !== -1) {
      const existing = this.products[index];
      const name = updated.name !== undefined ? updated.name : existing.name;
      const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : existing.slug;
      const image = updated.image !== undefined ? updated.image : existing.image;
      const images = updated.images && updated.images.length > 0 ? updated.images : (image ? [image, ...(existing.images || []).slice(1)] : existing.images);

      this.products[index] = {
        ...existing,
        ...updated,
        name,
        slug,
        image,
        images,
        price: updated.price !== undefined ? Number(updated.price) : existing.price,
        compareAtPrice: updated.compareAtPrice !== undefined ? (updated.compareAtPrice ? Number(updated.compareAtPrice) : undefined) : existing.compareAtPrice,
        badge: updated.badge !== undefined ? (updated.badge as any) : existing.badge,
        category: updated.category !== undefined ? updated.category : existing.category,
        stockQuantity: updated.stockQuantity !== undefined ? Number(updated.stockQuantity) : existing.stockQuantity,
        description: updated.description !== undefined ? updated.description : existing.description
      };
      this.saveProductsToStorage();
      try {
        this.cartService.syncCartWithMockProducts();
      } catch {}
    }
  }

  deleteProduct(id: number): void {
    const targetIdNum = Number(id);
    this.products = this.products.filter(p => p.id !== targetIdNum && p.id.toString() !== id.toString());
    this.saveProductsToStorage();
    try {
      this.cartService.syncCartWithMockProducts();
    } catch {}
  }
}
