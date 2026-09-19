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
  }

  get currentCart(): CartSummary {
    return this.cartSubject.getValue();
  }

  addToCart(product: ProductCardData, quantity: number = 1, selectedMetal?: string): void {
    const currentItems = [...this.currentCart.items];
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = existing.quantity + quantity;
      currentItems[existingIndex] = {
        ...existing,
        quantity: newQty,
        subtotal: product.price * newQty
      };
    } else {
      currentItems.push({
        product,
        quantity,
        selectedMetal: selectedMetal || '18K Warm Gold',
        subtotal: product.price * quantity
      });
    }

    this.saveAndUpdate(currentItems);
  }

  updateQuantity(productId: number | string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.currentCart.items.map(item => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          subtotal: item.product.price * quantity
        };
      }
      return item;
    });

    this.saveAndUpdate(currentItems);
  }

  removeFromCart(productId: number | string): void {
    const updatedItems = this.currentCart.items.filter(item => item.product.id !== productId);
    this.saveAndUpdate(updatedItems);
  }

  clearCart(): void {
    this.saveAndUpdate([]);
  }

  private saveAndUpdate(items: CartItem[]): void {
    this.saveCartToStorage(items);
    this.cartSubject.next(this.calculateSummary(items));
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved !== null) {
          return JSON.parse(saved);
        }
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    }
    const defaultItems: CartItem[] = [
      {
        product: {
          id: 1,
          name: 'Eternal Solitaire Diamond Ring',
          slug: 'eternal-solitaire-diamond-ring',
          image: '/assets/images/placeholder-rings.svg',
          price: 45000,
          badge: 'FEATURED',
          category: 'Rings',
          available: true
        },
        quantity: 1,
        selectedMetal: '18K Warm Gold',
        subtotal: 45000
      }
    ];
    this.saveCartToStorage(defaultItems);
    return defaultItems;
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
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
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
