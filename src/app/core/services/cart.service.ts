import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartSummary } from '../models/cart.model';
import { ProductCardData } from '../models/product-card-data.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'arista_cart_items_v1';
  private cartSubject: BehaviorSubject<CartSummary>;
  cart$: Observable<CartSummary>;

  constructor() {
    const loadedItems = this.loadCartFromStorage();
    this.cartSubject = new BehaviorSubject<CartSummary>(this.calculateSummary(loadedItems));
    this.cart$ = this.cartSubject.asObservable();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === this.STORAGE_KEY) {
          const freshItems = this.loadCartFromStorage();
          this.cartSubject.next(this.calculateSummary(freshItems));
        }
      });
    }
  }

  get currentCart(): CartSummary {
    return this.cartSubject.getValue();
  }

  private matchesProduct(item: CartItem, target: any): boolean {
    if (!item || !item.product || target === undefined || target === null || target === '') return false;

    let targetId: any = typeof target === 'object' && target !== null ? target.id : target;
    let targetSlug: any = typeof target === 'object' && target !== null ? target.slug : target;

    const itemSlugStr = item.product.slug ? String(item.product.slug).trim().toLowerCase() : '';
    const targetSlugStr = targetSlug ? String(targetSlug).trim().toLowerCase() : '';

    if (itemSlugStr && targetSlugStr && itemSlugStr === targetSlugStr) {
      return true;
    }

    const itemIdStr = item.product.id !== undefined && item.product.id !== null ? String(item.product.id).trim().toLowerCase() : '';
    const targetIdStr = targetId !== undefined && targetId !== null ? String(targetId).trim().toLowerCase() : '';

    if (itemIdStr && targetIdStr && itemIdStr === targetIdStr) {
      return true;
    }

    return false;
  }

  isInCart(productIdOrSlug: number | string): boolean {
    if (productIdOrSlug === undefined || productIdOrSlug === null || productIdOrSlug === '') return false;
    return this.currentCart.items.some(item => this.matchesProduct(item, productIdOrSlug));
  }

  addToCart(product: ProductCardData, quantity: number = 1, selectedMetal?: string): void {
    if (!product) return;

    const currentItems = [...this.currentCart.items];
    const addQty = Math.max(1, Number(quantity) || 1);

    // Fetch fresh product data from localStorage if custom created
    let freshImage = product.image;
    let freshPrice = Number(product.price) || 0;
    let freshName = product.name;
    let freshCategory = product.category;

    try {
      if (typeof localStorage !== 'undefined') {
        const storedMockData = localStorage.getItem('arista_mock_products');
        if (storedMockData) {
          const parsed = JSON.parse(storedMockData);
          if (Array.isArray(parsed)) {
            const match = parsed.find(p => 
              (p.id !== undefined && product.id !== undefined && String(p.id) === String(product.id)) ||
              (p.slug && product.slug && p.slug === product.slug)
            );
            if (match) {
              if (match.image) freshImage = match.image;
              if (match.price !== undefined) freshPrice = Number(match.price);
              if (match.name) freshName = match.name;
              if (match.category) freshCategory = match.category;
            }
          }
        }
      }
    } catch {}

    const updatedProduct: ProductCardData = {
      ...product,
      name: freshName || 'Arista Fine Jewellery',
      price: freshPrice,
      image: freshImage || '/assets/images/placeholder-jewellery.svg',
      category: freshCategory || 'Fine Jewellery'
    };

    const existingIndex = currentItems.findIndex(item => this.matchesProduct(item, product));

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = (Number(existing.quantity) || 0) + addQty;
      currentItems[existingIndex] = {
        ...existing,
        product: updatedProduct,
        selectedMetal: selectedMetal || existing.selectedMetal || '18K Warm Gold',
        quantity: newQty,
        subtotal: freshPrice * newQty
      };
    } else {
      currentItems.push({
        product: updatedProduct,
        quantity: addQty,
        selectedMetal: selectedMetal || '18K Warm Gold',
        subtotal: freshPrice * addQty
      });
    }

    this.saveAndUpdate(currentItems);
  }

  updateQuantity(productIdOrSlug: number | string, quantity: number): void {
    const numericQty = Number(quantity) || 0;
    if (numericQty <= 0) {
      this.removeFromCart(productIdOrSlug);
      return;
    }

    const currentItems = this.currentCart.items.map(item => {
      if (this.matchesProduct(item, productIdOrSlug)) {
        const unitPrice = Number(item.product.price) || 0;
        return {
          ...item,
          quantity: numericQty,
          subtotal: unitPrice * numericQty
        };
      }
      return item;
    });

    this.saveAndUpdate(currentItems);
  }

  removeFromCart(productIdOrSlug: number | string): void {
    const updatedItems = this.currentCart.items.filter(item => !this.matchesProduct(item, productIdOrSlug));
    this.saveAndUpdate(updatedItems);
  }

  clearCart(): void {
    this.saveAndUpdate([]);
  }

  syncCartWithMockProducts(): void {
    const currentItems = this.loadCartFromStorage();
    this.saveAndUpdate(currentItems);
  }

  private saveAndUpdate(items: CartItem[]): void {
    this.saveCartToStorage(items);
    this.cartSubject.next(this.calculateSummary(items));
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedCart = localStorage.getItem(this.STORAGE_KEY);
        if (savedCart !== null) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            const cleanItems: CartItem[] = [];
            for (const item of parsedCart) {
              if (item && item.product && (item.product.id !== undefined || item.product.slug)) {
                cleanItems.push({
                  ...item,
                  quantity: Math.max(1, Number(item.quantity) || 1),
                  subtotal: (Number(item.product.price) || 0) * (Math.max(1, Number(item.quantity) || 1))
                });
              }
            }
            return cleanItems;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }

  private calculateSummary(items: CartItem[]): CartSummary {
    const itemCount = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
    const subtotal = items.reduce((acc, item) => acc + ((Number(item.product?.price) || 0) * (Number(item.quantity) || 0)), 0);
    const estimatedShipping = subtotal > 5000 || subtotal === 0 ? 0 : 500;
    const estimatedTax = Math.round(subtotal * 0.03); // 3% GST placeholder
    const total = subtotal + estimatedShipping + estimatedTax;

    return {
      items,
      itemCount,
      subtotal,
      estimatedShipping,
      estimatedTax,
      total
    };
  }
}

