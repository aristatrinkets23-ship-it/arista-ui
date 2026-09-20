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

  isInCart(productId: number | string): boolean {
    if (!productId && productId !== 0) return false;
    return this.currentCart.items.some(
      item => String(item.product.id) === String(productId) || (item.product.slug && item.product.slug === String(productId))
    );
  }

  addToCart(product: ProductCardData, quantity: number = 1, selectedMetal?: string): void {
    const currentItems = [...this.currentCart.items];
    const addQty = Math.max(1, Number(quantity) || 1);

    // Fetch fresh product data from localStorage to capture image changes
    let freshImage = product.image;
    let freshPrice = product.price;
    let freshName = product.name;
    let freshCategory = product.category;

    try {
      if (typeof localStorage !== 'undefined') {
        const storedMockData = localStorage.getItem('arista_mock_products');
        if (storedMockData) {
          const parsed = JSON.parse(storedMockData);
          if (Array.isArray(parsed)) {
            const match = parsed.find(p => String(p.id) === String(product.id) || (product.slug && p.slug === product.slug));
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

    const updatedProduct = {
      ...product,
      name: freshName,
      price: freshPrice,
      image: freshImage || '/assets/images/placeholder-jewellery.svg',
      category: freshCategory
    };

    const existingIndex = currentItems.findIndex(item => 
      String(item.product.id) === String(product.id) || (product.slug && item.product.slug === product.slug)
    );

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = (Number(existing.quantity) || 0) + addQty;
      currentItems[existingIndex] = {
        ...existing,
        product: updatedProduct,
        selectedMetal: selectedMetal || existing.selectedMetal,
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

  updateQuantity(productId: number | string, quantity: number): void {
    const numericQty = Number(quantity) || 0;
    if (numericQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.currentCart.items.map(item => {
      if (String(item.product.id) === String(productId) || item.product.slug === productId) {
        return {
          ...item,
          quantity: numericQty,
          subtotal: (Number(item.product.price) || 0) * numericQty
        };
      }
      return item;
    });

    this.saveAndUpdate(currentItems);
  }

  removeFromCart(productId: number | string): void {
    const updatedItems = this.currentCart.items.filter(
      item => String(item.product.id) !== String(productId) && item.product.slug !== productId
    );
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
        const storedMockProductsData = localStorage.getItem('arista_mock_products');
        let mockProductsMap: Map<string, any> = new Map();

        if (storedMockProductsData) {
          try {
            const parsedMock = JSON.parse(storedMockProductsData);
            if (Array.isArray(parsedMock)) {
              parsedMock.forEach(p => {
                if (p.id !== undefined) mockProductsMap.set(String(p.id), p);
                if (p.slug) mockProductsMap.set(String(p.slug), p);
              });
            }
          } catch {}
        }

        if (savedCart !== null) {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            // Sync cart items with fresh product data from mockProductsMap
            const syncedItems: CartItem[] = parsedCart.map(item => {
              if (item && item.product) {
                const targetKey = String(item.product.id || item.product.slug);
                const freshProd = mockProductsMap.get(targetKey) || mockProductsMap.get(String(item.product.slug));
                if (freshProd) {
                  const updatedImage = freshProd.image || item.product.image;
                  const updatedPrice = freshProd.price !== undefined ? Number(freshProd.price) : item.product.price;
                  const updatedQty = Number(item.quantity) || 1;
                  return {
                    ...item,
                    product: {
                      ...item.product,
                      name: freshProd.name || item.product.name,
                      price: updatedPrice,
                      image: updatedImage,
                      category: freshProd.category || item.product.category,
                      badge: freshProd.badge || item.product.badge
                    },
                    subtotal: updatedPrice * updatedQty
                  };
                }
              }
              return item;
            });
            this.saveCartToStorage(syncedItems);
            return syncedItems;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load cart from localStorage:', e);
    }

    const defaultItems: CartItem[] = [];
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
