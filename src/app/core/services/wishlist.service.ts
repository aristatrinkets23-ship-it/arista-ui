import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductCardData } from '../models/product-card-data.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

const WISHLIST_STORAGE_KEY = 'arista_wishlist_items_v1';
const SESSION_STORAGE_KEY = 'arista_guest_session_id';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: ProductCardData[] = [];
  private wishlistSubject = new BehaviorSubject<ProductCardData[]>([]);

  readonly wishlist$ = this.wishlistSubject.asObservable();
  readonly itemCount = signal<number>(0);

  constructor() {
    this.loadWishlistFromStorage();
    this.refreshFromApi();
  }

  private getOrCreateSessionId(): string {
    if (typeof localStorage !== 'undefined') {
      let sid = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sid) {
        sid = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem(SESSION_STORAGE_KEY, sid);
      }
      return sid;
    }
    return 'guest-session';
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'x-session-id': this.getOrCreateSessionId()
    };
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('arista_auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async refreshFromApi(): Promise<void> {
    try {
      const res = await fetch(API_ENDPOINTS.WISHLIST.GET, {
        headers: this.getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          const apiItems: ProductCardData[] = json.data;
          const merged: ProductCardData[] = [];

          // 1. Add valid API items first
          for (const item of apiItems) {
            if (item && (item.slug || item.id !== undefined)) {
              if (!merged.some(existing => this.matchesProduct(existing, item))) {
                merged.push(item);
              }
            }
          }

          // 2. Add local items that might not be in API yet, and sync them to API
          for (const localItem of this.wishlistItems) {
            if (localItem && (localItem.slug || localItem.id !== undefined)) {
              if (!merged.some(existing => this.matchesProduct(existing, localItem))) {
                merged.push(localItem);
                this.syncItemToApi(localItem);
              }
            }
          }

          this.wishlistItems = merged;
          this.saveWishlistToStorage();
        }
      }
    } catch (err) {
      console.warn('Wishlist refresh from API warning:', err);
    }
  }

  private syncItemToApi(product: ProductCardData): void {
    fetch(API_ENDPOINTS.WISHLIST.TOGGLE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({
        productId: product.id,
        slug: product.slug,
        product
      })
    }).catch(e => console.warn('Wishlist sync item error:', e));
  }

  private loadWishlistFromStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            const cleanItems: ProductCardData[] = [];
            for (const item of parsed) {
              if (item && (item.slug || item.id !== undefined)) {
                if (!cleanItems.some(existing => this.matchesProduct(existing, item))) {
                  cleanItems.push(item);
                }
              }
            }
            this.wishlistItems = cleanItems;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load wishlist from storage:', err);
    }
    this.updateSubject();
  }

  private saveWishlistToStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlistItems));
      }
    } catch (err) {
      console.warn('Failed to save wishlist to storage:', err);
    }
    this.updateSubject();
  }

  private updateSubject(): void {
    this.itemCount.set(this.wishlistItems.length);
    this.wishlistSubject.next([...this.wishlistItems]);
  }

  getWishlist(): ProductCardData[] {
    return [...this.wishlistItems];
  }

  private matchesProduct(item: ProductCardData, idOrSlugOrProduct: string | number | ProductCardData): boolean {
    if (!item) return false;

    let targetId: string | number | undefined;
    let targetSlug: string | undefined;

    if (typeof idOrSlugOrProduct === 'object' && idOrSlugOrProduct !== null) {
      targetId = idOrSlugOrProduct.id;
      targetSlug = idOrSlugOrProduct.slug;
    } else if (typeof idOrSlugOrProduct === 'number' || typeof idOrSlugOrProduct === 'string') {
      const valStr = String(idOrSlugOrProduct).trim().toLowerCase();
      if (!valStr) return false;

      const itemSlugStr = item.slug ? String(item.slug).trim().toLowerCase() : '';
      const itemIdStr = item.id !== undefined && item.id !== null ? String(item.id).trim().toLowerCase() : '';

      if (itemSlugStr && itemSlugStr === valStr) return true;
      if (itemIdStr && itemIdStr === valStr) return true;
      return false;
    }

    const itemSlugStr = item.slug ? String(item.slug).trim().toLowerCase() : '';
    const targetSlugStr = targetSlug ? String(targetSlug).trim().toLowerCase() : '';

    if (itemSlugStr && targetSlugStr) {
      return itemSlugStr === targetSlugStr;
    }

    const itemIdStr = item.id !== undefined && item.id !== null ? String(item.id).trim().toLowerCase() : '';
    const targetIdStr = targetId !== undefined && targetId !== null ? String(targetId).trim().toLowerCase() : '';

    if (itemIdStr && targetIdStr) {
      return itemIdStr === targetIdStr;
    }

    return false;
  }

  isInWishlist(productIdOrSlug: string | number): boolean {
    if (productIdOrSlug === undefined || productIdOrSlug === null || productIdOrSlug === '') return false;
    return this.wishlistItems.some(p => this.matchesProduct(p, productIdOrSlug));
  }

  toggleWishlist(product: ProductCardData): boolean {
    if (!product) return false;

    const index = this.wishlistItems.findIndex(p => this.matchesProduct(p, product));
    let isNowFavorited = false;

    if (index !== -1) {
      // Remove from wishlist
      this.wishlistItems.splice(index, 1);
      isNowFavorited = false;
    } else {
      // Add to wishlist
      this.wishlistItems.unshift({ ...product });
      isNowFavorited = true;
    }

    this.saveWishlistToStorage();

    fetch(API_ENDPOINTS.WISHLIST.TOGGLE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({
        productId: product.id,
        slug: product.slug,
        product
      })
    }).catch(err => {
      console.warn('Backend wishlist toggle sync error:', err);
    });

    return isNowFavorited;
  }

  removeFromWishlist(productIdOrSlug: string | number): void {
    if (productIdOrSlug === undefined || productIdOrSlug === null || productIdOrSlug === '') return;
    this.wishlistItems = this.wishlistItems.filter(p => !this.matchesProduct(p, productIdOrSlug));
    this.saveWishlistToStorage();

    fetch(API_ENDPOINTS.WISHLIST.REMOVE(productIdOrSlug), {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    }).catch(err => {
      console.warn('Backend wishlist remove sync error:', err);
    });
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.saveWishlistToStorage();

    fetch(API_ENDPOINTS.WISHLIST.CLEAR, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    }).catch(err => {
      console.warn('Backend wishlist clear sync error:', err);
    });
  }
}

