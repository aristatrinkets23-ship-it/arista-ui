import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCardData } from '../models/product-card-data.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { CartService } from '../services/cart.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

const STORAGE_KEY_PRODUCTS = 'arista_mock_products_v3';
const STORAGE_KEY_CATEGORIES = 'arista_mock_categories_v3';

export function getDefaultCategoryImage(nameOrSlug?: string): string {
  if (!nameOrSlug) return '/assets/images/placeholder-jewellery.svg';
  const s = nameOrSlug.toLowerCase();
  if (s.includes('ring')) return '/assets/images/occasion-daily-wear.jpg';
  if (s.includes('necklace') || s.includes('pendant') || s.includes('choker')) return '/assets/images/occasion-wedding.jpg';
  if (s.includes('earring') || s.includes('stud') || s.includes('hoop')) return '/assets/images/occasion-gifting.jpg';
  if (s.includes('bracelet') || s.includes('bangle') || s.includes('cuff')) return '/assets/images/occasion-festive.jpg';
  return '/assets/images/placeholder-jewellery.svg';
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private categories: Category[] = [];
  private products: Product[] = [];

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private cartService = inject(CartService);

  constructor() {
    this.loadCategoriesFromStorage();
    this.loadProductsFromStorage();
    this.productsSubject.next(this.products);
    this.categoriesSubject.next(this.categories);
    this.refreshFromApi();
  }

  async refreshFromApi(): Promise<void> {
    try {
      const prodRes = await fetch(API_ENDPOINTS.PRODUCTS.LIST);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData && prodData.success && Array.isArray(prodData.data)) {
          const apiProducts = prodData.data.map((p: any) => {
            let img = p.image ? p.image.trim() : '';
            const catName = p.category_name || p.category || 'Rings';
            const fallbackImg = getDefaultCategoryImage(catName);
            if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
              img = '/' + img;
            }
            const finalImg = img || fallbackImg;
            return {
              id: Number(p.id) || p.id,
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
        if (catData && catData.success && Array.isArray(catData.data)) {
          const apiCategories = catData.data.map((c: any) => {
            let img = c.image ? c.image.trim() : '';
            const fallbackImg = getDefaultCategoryImage(c.slug || c.name);
            if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
              img = '/' + img;
            }
            const prodCountForCat = (this.products || []).filter(p =>
              p.category?.toLowerCase() === c.name?.toLowerCase() ||
              p.category?.toLowerCase() === c.slug?.toLowerCase() ||
              p.slug?.toLowerCase().includes(c.slug?.toLowerCase())
            ).length;

            const finalItemCount = (c.item_count !== undefined && c.item_count !== null && Number(c.item_count) > 0)
              ? Number(c.item_count)
              : prodCountForCat;

            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              image: img || fallbackImg,
              itemCount: finalItemCount,
              featured: true
            };
          });
          this.categories = apiCategories;
          this.updateCategoryItemCounts();
          this.saveCategoriesToStorage();
        }
      }
    } catch (err) {
      // Backend offline fallback
    }
  }

  private updateCategoryItemCounts(): void {
    if (!this.categories || this.categories.length === 0) return;
    this.categories = this.categories.map(cat => {
      const count = (this.products || []).filter(p =>
        p.category?.toLowerCase() === cat.name?.toLowerCase() ||
        p.category?.toLowerCase() === cat.slug?.toLowerCase() ||
        p.slug?.toLowerCase().includes(cat.slug?.toLowerCase())
      ).length;
      return {
        ...cat,
        itemCount: (cat.itemCount !== undefined && cat.itemCount > count) ? cat.itemCount : count
      };
    });
  }

  private loadCategoriesFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
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
          this.updateCategoryItemCounts();
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse arista_mock_categories from localStorage:', err);
    }
    this.categories = [];
    this.saveCategoriesToStorage();
  }

  private saveCategoriesToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(this.categories));
    } catch (err) {
      console.warn('Failed to save arista_mock_categories to localStorage:', err);
    }
    this.categoriesSubject.next(this.categories);
  }

  private loadProductsFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.products = parsed;
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse arista_mock_products_v2 from localStorage:', err);
    }
    this.products = [];
    this.saveProductsToStorage();
  }

  private saveProductsToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
    } catch (err) {
      console.warn('Failed to save arista_mock_products to localStorage:', err);
    }
    this.updateCategoryItemCounts();
    this.productsSubject.next(this.products);
  }

  getCategories(): Observable<Category[]> {
    this.refreshFromApi();
    return this.categoriesSubject.asObservable();
  }

  addCategory(newCat: Partial<Category>): Category {
    const rawName = (newCat.name || '').trim();
    const slug = (newCat.slug || rawName || 'category-' + Date.now()).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const lowerName = rawName.toLowerCase();

    // Check case-insensitive duplicate name or slug
    const duplicate = this.categories.find(c =>
      c.name.trim().toLowerCase() === lowerName || c.slug.toLowerCase() === slug
    );
    if (duplicate && duplicate.id !== newCat.id) {
      throw new Error(`Category "${rawName || slug}" already exists.`);
    }

    const id = newCat.id ? newCat.id : 'cat-' + slug;
    const defaultImg = getDefaultCategoryImage(slug);

    const fullCat: Category = {
      id,
      name: rawName || 'New Collection',
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
    const targetStr = String(id);
    this.categories = this.categories.filter(c => String(c.id) !== targetStr && c.slug !== targetStr);
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
    return this.productsSubject.pipe(
      map(prods => prods.slice(0, 4))
    );
  }

  getNewArrivals(): Observable<ProductCardData[]> {
    this.refreshFromApi();
    return this.productsSubject.pipe(
      map(prods => {
        const newOnly = prods.filter(p => p.badge && String(p.badge).toUpperCase() === 'NEW');
        return newOnly.slice(0, 4);
      })
    );
  }

  getBestsellers(): Observable<ProductCardData[]> {
    this.refreshFromApi();
    return this.productsSubject.pipe(
      map(prods => {
        const bestsellers = prods.filter(p => p.badge && String(p.badge).toUpperCase() === 'BESTSELLER');
        return bestsellers.slice(0, 6);
      })
    );
  }

  getProducts(categorySlug?: string, sortBy?: string): Observable<ProductCardData[]> {
    this.refreshFromApi();
    return this.productsSubject.pipe(
      map(prods => {
        let result = [...prods];
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

        return result;
      })
    );
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
    const id = newProd.id ? newProd.id : Date.now();
    const slug = (newProd.name || 'product-' + id).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const image = newProd.image || '/assets/images/placeholder-jewellery.svg';

    const fullProduct: Product = {
      id,
      name: newProd.name || 'New Jewellery Creation',
      slug,
      image,
      images: newProd.images && newProd.images.length > 0 ? newProd.images : [image],
      price: Number(newProd.price) || 0,
      compareAtPrice: newProd.compareAtPrice ? Number(newProd.compareAtPrice) : undefined,
      badge: (newProd.badge as any) || undefined,
      category: newProd.category || 'Rings',
      available: true,
      inStock: true,
      stockQuantity: newProd.stockQuantity || 10,
      description: newProd.description || 'Exquisite handcrafted fine jewellery piece by Arista Trinkets.',
      materials: newProd.materials && newProd.materials.length > 0 ? newProd.materials : ['18K Warm Gold', 'Sterling Silver', 'Rose Gold'],
      careGuide: newProd.careGuide || 'Handle with care. Store in protective velvet pouch after use.',
      shippingInfo: newProd.shippingInfo || 'Complimentary insured express delivery within 3-5 business days.',
      metalType: (newProd.materials && newProd.materials.length > 0) ? newProd.materials[0] : (newProd.metalType || '18K Warm Gold'),
      specifications: newProd.specifications && newProd.specifications.length > 0 ? newProd.specifications : [
        { label: 'Craftsmanship', value: 'Handcrafted Atelier Finish' },
        { label: 'Certification', value: 'BIS Hallmarked Gold' }
      ]
    };

    this.products.unshift(fullProduct);
    this.saveCategoriesToStorage();
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
        description: updated.description !== undefined ? updated.description : existing.description,
        materials: updated.materials !== undefined ? updated.materials : existing.materials,
        careGuide: updated.careGuide !== undefined ? updated.careGuide : existing.careGuide,
        shippingInfo: updated.shippingInfo !== undefined ? updated.shippingInfo : existing.shippingInfo,
        specifications: updated.specifications !== undefined ? updated.specifications : existing.specifications
      };
      this.saveProductsToStorage();
      try {
        this.cartService.syncCartWithMockProducts();
      } catch {}
    }
  }

  deleteProduct(id: number | string): void {
    const targetStr = String(id);
    this.products = this.products.filter(p => String(p.id) !== targetStr);
    this.saveProductsToStorage();
    try {
      this.cartService.syncCartWithMockProducts();
    } catch {}
  }
}
