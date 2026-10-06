import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductCardData } from '../models/product-card-data.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { getDefaultCategoryImage } from './category.service';

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(categorySlug?: string, sortBy?: string, search?: string): Observable<ProductCardData[]> {
    let params = new HttpParams();
    if (categorySlug && categorySlug !== 'all') {
      params = params.set('category', categorySlug);
    }
    if (sortBy) {
      params = params.set('sort', sortBy);
    }
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCTS.LIST, { params }).pipe(
      retry(1),
      map(res => {
        if (!res || !res.success || !Array.isArray(res.data)) {
          return [];
        }
        return res.data.map(p => this.mapProductCardData(p));
      }),
      catchError(err => {
        console.error('Error fetching products from API:', err);
        return throwError(() => err);
      })
    );
  }

  getAdminProducts(): Observable<Product[]> {
    const params = new HttpParams().set('includeInactive', 'true');
    return this.http.get<ApiResponse<any[]>>(API_ENDPOINTS.PRODUCTS.LIST, { params }).pipe(
      retry(1),
      map(res => {
        if (!res || !res.success || !Array.isArray(res.data)) {
          return [];
        }
        return res.data.map(p => this.mapProduct(p));
      }),
      catchError(err => {
        console.error('Error fetching admin products from API:', err);
        return throwError(() => err);
      })
    );
  }

  getFeaturedProducts(): Observable<ProductCardData[]> {
    return this.getProducts().pipe(
      map(prods => {
        return [...prods]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, 4);
      })
    );
  }

  getNewArrivals(): Observable<ProductCardData[]> {
    return this.getProducts().pipe(
      map(prods => {
        const newOnly = prods.filter(p => p.badge && String(p.badge).trim().toUpperCase() === 'NEW');
        const list = newOnly.length > 0 ? newOnly : prods;
        return [...list]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, 4);
      })
    );
  }

  getBestsellers(): Observable<ProductCardData[]> {
    return this.getProducts().pipe(
      map(prods => {
        const bestsellers = prods.filter(p => p.badge && String(p.badge).trim().toUpperCase() === 'BESTSELLER');
        const list = bestsellers.length > 0 ? bestsellers : prods;
        return [...list]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, 6);
      })
    );
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    const url = API_ENDPOINTS.PRODUCTS.BY_SLUG(slug);
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(res => {
        if (!res || !res.success || !res.data) {
          return null;
        }
        return this.mapProduct(res.data);
      }),
      catchError(err => {
        if (err.status === 404) {
          return of(null);
        }
        console.error(`Error fetching product by slug "${slug}":`, err);
        return throwError(() => err);
      })
    );
  }

  getRelatedProducts(currentSlug: string, category?: string): Observable<ProductCardData[]> {
    return this.getProducts(category).pipe(
      map(prods => {
        return prods
          .filter(p => p.slug !== currentSlug)
          .slice(0, 4);
      })
    );
  }

  createProduct(payload: any): Observable<ApiResponse<{ id: number; name: string; slug: string }>> {
    const token = localStorage.getItem('arista_auth_token');
    let headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post<ApiResponse<{ id: number; name: string; slug: string }>>(
      API_ENDPOINTS.ADMIN.PRODUCTS,
      payload,
      { headers }
    );
  }

  private mapProductCardData(p: any): ProductCardData {
    let img = p.image ? String(p.image).trim() : '';
    const catName = p.category_name || p.category || '';
    const fallbackImg = getDefaultCategoryImage(catName);
    if (img && !img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/')) {
      img = '/' + img;
    }
    const finalImg = img || fallbackImg;

    const parsedStock = (p.stock_quantity !== undefined && p.stock_quantity !== null && String(p.stock_quantity).trim() !== '')
      ? Math.max(0, Number(p.stock_quantity))
      : (p.stockQuantity !== undefined && p.stockQuantity !== null ? Math.max(0, Number(p.stockQuantity)) : (p.in_stock === 0 || p.inStock === false ? 0 : 10));
    const inStock = Boolean(p.in_stock !== 0 && p.inStock !== false && parsedStock > 0);
    const isActive = Boolean(p.is_active !== 0 && p.is_active !== false && p.isActive !== false && p.available !== false);

    const imagesList = Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((i: string) => (i.startsWith('http') || i.startsWith('data:') || i.startsWith('/') ? i : '/' + i))
      : [finalImg];

    return {
      id: Number(p.id) || p.id,
      name: p.name || '',
      slug: p.slug || '',
      image: finalImg,
      images: imagesList,
      price: Number(p.price) || 0,
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : (p.compareAtPrice ? Number(p.compareAtPrice) : undefined),
      badge: p.badge || undefined,
      category: catName,
      available: isActive,
      isActive: isActive,
      inStock: inStock,
      stockQuantity: inStock ? parsedStock : 0
    };
  }

  private mapProduct(p: any): Product {
    const cardData = this.mapProductCardData(p);

    let parsedMaterials: string[] = ['18K Warm Gold'];
    if (Array.isArray(p.materials)) {
      parsedMaterials = p.materials;
    } else if (typeof p.materials === 'string' && p.materials.trim() !== '') {
      try {
        parsedMaterials = JSON.parse(p.materials);
      } catch {
        parsedMaterials = p.materials.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    return {
      ...cardData,
      images: cardData.images || [cardData.image],
      inStock: Boolean(cardData.inStock),
      stockQuantity: Number(cardData.stockQuantity) || 0,
      description: p.description || '',
      materials: parsedMaterials,
      careGuide: p.care_guide || p.careGuide || '',
      shippingInfo: p.shipping_info || p.shippingInfo || '',
      metalType: p.metal_type || p.metalType || '18K Warm Gold',
      gemstone: p.gemstone || undefined,
      specifications: Array.isArray(p.specifications) ? p.specifications : []
    };
  }
}
