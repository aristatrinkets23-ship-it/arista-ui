import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';
import { ProductCardData } from '../models/product-card-data.model';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

const GUEST_CART_EXPIRY_DAYS = 30;
const THIRTY_DAYS_MS = GUEST_CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

interface StoredCartData {
  items: CartItem[];
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'arista_cart_items_v1';
  private cartSubject: BehaviorSubject<CartSummary>;
  cart$: Observable<CartSummary>;

  private authService = inject(AuthService);

  constructor() {
    const loadedItems = this.loadCartFromStorage();
    this.cartSubject = new BehaviorSubject<CartSummary>(this.calculateSummary(loadedItems));
    this.cart$ = this.cartSubject.asObservable();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY && !this.authService.isAuthenticated()) {
          const freshItems = this.loadCartFromStorage();
          this.cartSubject.next(this.calculateSummary(freshItems));
        }
      });
    }

    // Initialize & sync authentication state
    this.initAuthSync();
  }

  private initAuthSync(): void {
    if (this.authService.isAuthenticated()) {
      this.syncWithBackendOrMerge();
    }

    let prevToken = this.authService.getToken();
    if (typeof window !== 'undefined') {
      setInterval(() => {
        const currentToken = this.authService.getToken();
        if (currentToken !== prevToken) {
          prevToken = currentToken;
          if (currentToken) {
            this.syncWithBackendOrMerge();
          } else {
            // User logged out: restore guest local cart
            const guestItems = this.loadCartFromStorage();
            this.cartSubject.next(this.calculateSummary(guestItems));
          }
        }
      }, 500);
    }
  }

  get currentCart(): CartSummary {
    return this.cartSubject.getValue();
  }

  isInCart(productId: number | string): boolean {
    if (productId === undefined || productId === null || productId === '') return false;
    const strId = String(productId);
    return this.currentCart.items.some(
      item => (item.product.id !== undefined && item.product.id !== null && String(item.product.id) === strId) ||
              (item.product.slug && item.product.slug === strId) ||
              (item.product.name && item.product.name.trim().toLowerCase() === strId.trim().toLowerCase())
    );
  }

  getItemQuantity(productId: number | string, selectedMetal?: string): number {
    if (productId === undefined || productId === null || productId === '') return 0;
    const strId = String(productId);
    const item = this.currentCart.items.find(
      i => ((i.product.id !== undefined && i.product.id !== null && String(i.product.id) === strId) ||
            (i.product.slug && i.product.slug === strId) ||
            (i.product.name && i.product.name.trim().toLowerCase() === strId.trim().toLowerCase())) &&
           (!selectedMetal || i.selectedMetal === selectedMetal)
    );
    return item ? item.quantity : 0;
  }

  async syncWithBackendOrMerge(): Promise<void> {
    const token = this.authService.getToken();
    if (!token) return;

    const guestItems = this.loadCartFromStorage();

    if (guestItems && guestItems.length > 0) {
      try {
        const response = await fetch(API_ENDPOINTS.CART.MERGE, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ guestItems })
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          this.clearLocalStorage();
          this.cartSubject.next(data.data);
          return;
        }
      } catch (err) {
        console.warn('Could not merge cart with backend:', err);
      }
    }

    this.fetchCartFromBackend();
  }

  async fetchCartFromBackend(): Promise<void> {
    const token = this.authService.getToken();
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.CART.GET, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      if (response.ok && data.success && data.data) {
        this.cartSubject.next(data.data);
      }
    } catch (err) {
      console.warn('Could not fetch cart from server:', err);
    }
  }

  async addToCart(product: ProductCardData, quantity: number = 1, selectedMetal?: string): Promise<void> {
    if (!product) return;
    const addQty = Math.max(1, Number(quantity) || 1);
    const metal = selectedMetal || '18K Warm Gold';

    // 1. Logged-in user: send API request to database backend
    if (this.authService.isAuthenticated()) {
      try {
        const response = await fetch(API_ENDPOINTS.CART.ADD, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            product,
            productId: product.id,
            quantity: addQty,
            selectedMetal: metal
          })
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          this.cartSubject.next(data.data);
          return;
        }
      } catch (err) {
        console.warn('Backend addToCart failed, fallback to local state:', err);
      }
    }

    // 2. Guest or Offline mode: Update local state & localStorage
    const currentItems = [...this.currentCart.items];
    const productId = (product.id !== undefined && product.id !== null && String(product.id) !== '')
      ? product.id
      : (product.slug || (product.name ? product.name.toLowerCase().replace(/\s+/g, '-') : 'prod-' + Date.now()));

    const updatedProduct: ProductCardData = {
      ...product,
      id: productId,
      name: product.name || 'Jewellery Item',
      price: Number(product.price) || 0,
      image: product.image || '/assets/images/placeholder-jewellery.svg',
      category: product.category || 'Jewellery'
    };

    const existingIndex = currentItems.findIndex(item => {
      const sameMetal = !metal || !item.selectedMetal || item.selectedMetal === metal;
      const sameId = (item.product.id !== undefined && item.product.id !== null && updatedProduct.id !== undefined && updatedProduct.id !== null)
        ? String(item.product.id) === String(updatedProduct.id)
        : false;
      const sameSlug = (item.product.slug && updatedProduct.slug)
        ? item.product.slug === updatedProduct.slug
        : false;
      const sameName = (item.product.name && updatedProduct.name)
        ? item.product.name.trim().toLowerCase() === updatedProduct.name.trim().toLowerCase()
        : false;

      return sameMetal && (sameId || sameSlug || sameName);
    });

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = (Number(existing.quantity) || 0) + addQty;
      currentItems[existingIndex] = {
        ...existing,
        product: updatedProduct,
        selectedMetal: metal,
        quantity: newQty,
        subtotal: (Number(updatedProduct.price) || 0) * newQty
      };
    } else {
      currentItems.push({
        product: updatedProduct,
        quantity: addQty,
        selectedMetal: metal,
        subtotal: (Number(updatedProduct.price) || 0) * addQty
      });
    }

    this.saveAndUpdateLocal(currentItems);
  }

  async updateQuantity(productId: number | string, quantity: number, selectedMetal?: string): Promise<void> {
    if (productId === undefined || productId === null) return;
    const numericQty = Number(quantity) || 0;
    if (numericQty <= 0) {
      await this.removeFromCart(productId, selectedMetal);
      return;
    }

    if (this.authService.isAuthenticated()) {
      try {
        const response = await fetch(API_ENDPOINTS.CART.UPDATE(productId), {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify({
            quantity: numericQty,
            selectedMetal
          })
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          this.cartSubject.next(data.data);
          return;
        }
      } catch (err) {
        console.warn('Backend updateQuantity failed:', err);
      }
    }

    const strId = String(productId);
    const currentItems = this.currentCart.items.map(item => {
      const matchesId = (item.product.id !== undefined && item.product.id !== null && String(item.product.id) === strId) ||
                        (item.product.slug && item.product.slug === strId) ||
                        (item.product.name && item.product.name.trim().toLowerCase() === strId.trim().toLowerCase());
      const matchesMetal = !selectedMetal || item.selectedMetal === selectedMetal;

      if (matchesId && matchesMetal) {
        const itemPrice = Number(item.product.price) || 0;
        return {
          ...item,
          quantity: numericQty,
          subtotal: itemPrice * numericQty
        };
      }
      return item;
    });

    this.saveAndUpdateLocal(currentItems);
  }

  async removeFromCart(productId: number | string, selectedMetal?: string): Promise<void> {
    if (productId === undefined || productId === null) return;

    if (this.authService.isAuthenticated()) {
      try {
        let url = API_ENDPOINTS.CART.REMOVE(productId);
        if (selectedMetal) {
          url += `?selectedMetal=${encodeURIComponent(selectedMetal)}`;
        }
        const response = await fetch(url, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          this.cartSubject.next(data.data);
          return;
        }
      } catch (err) {
        console.warn('Backend removeFromCart failed:', err);
      }
    }

    const strId = String(productId);
    const updatedItems = this.currentCart.items.filter(item => {
      const matchesId = (item.product.id !== undefined && item.product.id !== null && String(item.product.id) === strId) ||
                        (item.product.slug && item.product.slug === strId) ||
                        (item.product.name && item.product.name.trim().toLowerCase() === strId.trim().toLowerCase());
      const matchesMetal = !selectedMetal || item.selectedMetal === selectedMetal;

      return !(matchesId && matchesMetal);
    });

    this.saveAndUpdateLocal(updatedItems);
  }

  async clearCart(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      try {
        const response = await fetch(API_ENDPOINTS.CART.CLEAR, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          this.cartSubject.next(data.data);
          return;
        }
      } catch (err) {
        console.warn('Backend clearCart failed:', err);
      }
    }

    this.saveAndUpdateLocal([]);
  }

  syncCartWithMockProducts(): void {
    if (!this.authService.isAuthenticated()) {
      const currentItems = this.loadCartFromStorage();
      if (currentItems && currentItems.length > 0) {
        this.cartSubject.next(this.calculateSummary(currentItems));
      }
    }
  }

  private saveAndUpdateLocal(items: CartItem[]): void {
    this.saveCartToStorage(items);
    this.cartSubject.next(this.calculateSummary(items));
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedCart = localStorage.getItem(this.STORAGE_KEY);
        if (!savedCart) return [];

        let parsedData: any;
        try {
          parsedData = JSON.parse(savedCart);
        } catch {
          return [];
        }

        let parsedItems: any[] = [];
        let createdAt = Date.now();

        if (Array.isArray(parsedData)) {
          parsedItems = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
          parsedItems = Array.isArray(parsedData.items) ? parsedData.items : [];
          createdAt = Number(parsedData.createdAt) || Date.now();
        }

        // 30-DAY GUEST EXPIRATION CHECK
        if (Date.now() - createdAt > THIRTY_DAYS_MS) {
          console.info('Guest cart has expired (older than 30 days). Removing from localStorage.');
          this.clearLocalStorage();
          return [];
        }

        if (parsedItems.length === 0) return [];

        const syncedItems: CartItem[] = parsedItems.map(item => {
          if (!item || !item.product) return item;
          const itemPrice = Number(item.product.price) || 0;
          const itemQty = Math.max(1, Number(item.quantity) || 1);
          return {
            ...item,
            quantity: itemQty,
            selectedMetal: item.selectedMetal || '18K Warm Gold',
            subtotal: itemPrice * itemQty
          };
        }).filter(item => item && item.product && (item.product.name || item.product.id || item.product.slug));

        return syncedItems;
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    }

    return [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        if (!items || items.length === 0) {
          localStorage.removeItem(this.STORAGE_KEY);
        } else {
          let createdAt = Date.now();
          const existing = localStorage.getItem(this.STORAGE_KEY);
          if (existing) {
            try {
              const parsed = JSON.parse(existing);
              if (parsed && parsed.createdAt && !isNaN(Number(parsed.createdAt))) {
                createdAt = Number(parsed.createdAt);
              }
            } catch {}
          }

          const sanitizedItems: CartItem[] = items.map(item => {
            let img = item.product?.image || '/assets/images/placeholder-jewellery.svg';
            if (typeof img === 'string' && (img.startsWith('data:') || img.length > 500)) {
              img = '/assets/images/placeholder-jewellery.svg';
            }
            return {
              ...item,
              product: {
                ...item.product,
                image: img,
                images: undefined
              }
            };
          });

          const payload: StoredCartData = {
            items: sanitizedItems,
            createdAt
          };

          try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
          } catch (quotaErr) {
            console.warn('LocalStorage quota exceeded in cart. Pruning large storage keys and retrying...');
            localStorage.removeItem('arista_mock_products_v3');
            localStorage.removeItem('arista_mock_products');
            try {
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
            } catch (retryErr) {
              console.warn('Could not save cart after pruning:', retryErr);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }

  private clearLocalStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {}
  }

  private getSessionId(): string {
    let sid = typeof localStorage !== 'undefined' ? localStorage.getItem('arista_session_id') : null;
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('arista_session_id', sid);
      }
    }
    return sid;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-session-id': this.getSessionId()
    };
    const token = this.authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private calculateSummary(items: CartItem[]): CartSummary {
    const validItems = Array.isArray(items) ? items : [];
    const itemCount = validItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    const subtotal = validItems.reduce((acc, item) => acc + ((Number(item.product?.price) || 0) * (Number(item.quantity) || 0)), 0);
    const estimatedShipping = subtotal > 5000 || subtotal === 0 ? 0 : 500;
    const estimatedTax = Math.round(subtotal * 0.03); // 3% GST
    const total = subtotal + estimatedShipping + estimatedTax;

    return {
      items: validItems,
      itemCount,
      subtotal,
      estimatedShipping,
      estimatedTax,
      total
    };
  }
}
