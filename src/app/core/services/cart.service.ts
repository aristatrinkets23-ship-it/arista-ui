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

  addToCart(product: ProductCardData, quantity: number = 1, selectedMetal?: string): void {
    if (!product) return;
    const currentItems = [...this.currentCart.items];
    const addQty = Math.max(1, Number(quantity) || 1);
    const metal = selectedMetal || '18K Warm Gold';

    // Fetch fresh product data from localStorage if available
    let freshImage = product.image;
    let freshPrice = Number(product.price) || 0;
    let freshName = product.name;
    let freshCategory = product.category;

    try {
      if (typeof localStorage !== 'undefined') {
        const storedMockData = localStorage.getItem('arista_mock_products_v3') || localStorage.getItem('arista_mock_products');
        if (storedMockData) {
          const parsed = JSON.parse(storedMockData);
          if (Array.isArray(parsed)) {
            const match = parsed.find(p => 
              (p.id !== undefined && p.id !== null && product.id !== undefined && product.id !== null && String(p.id) === String(product.id)) ||
              (p.slug && product.slug && p.slug === product.slug) ||
              (p.name && product.name && p.name.trim().toLowerCase() === product.name.trim().toLowerCase())
            );
            if (match) {
              if (match.image) freshImage = match.image;
              if (match.price !== undefined && !isNaN(Number(match.price))) freshPrice = Number(match.price);
              if (match.name) freshName = match.name;
              if (match.category) freshCategory = match.category;
            }
          }
        }
      }
    } catch {}

    const productId = (product.id !== undefined && product.id !== null && String(product.id) !== '')
      ? product.id
      : (product.slug || (product.name ? product.name.toLowerCase().replace(/\s+/g, '-') : 'prod-' + Date.now()));

    const updatedProduct: ProductCardData = {
      ...product,
      id: productId,
      name: freshName || product.name || 'Jewellery Item',
      price: freshPrice,
      image: freshImage || product.image || '/assets/images/placeholder-jewellery.svg',
      category: freshCategory || product.category || 'Jewellery'
    };

    const existingIndex = currentItems.findIndex(item => {
      const sameMetal = !selectedMetal || !item.selectedMetal || item.selectedMetal === metal;

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
        subtotal: freshPrice * newQty
      };
    } else {
      currentItems.push({
        product: updatedProduct,
        quantity: addQty,
        selectedMetal: metal,
        subtotal: freshPrice * addQty
      });
    }

    this.saveAndUpdate(currentItems);
  }

  updateQuantity(productId: number | string, quantity: number, selectedMetal?: string): void {
    if (productId === undefined || productId === null) return;
    const numericQty = Number(quantity) || 0;
    if (numericQty <= 0) {
      this.removeFromCart(productId, selectedMetal);
      return;
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

    this.saveAndUpdate(currentItems);
  }

  removeFromCart(productId: number | string, selectedMetal?: string): void {
    if (productId === undefined || productId === null) return;
    const strId = String(productId);
    const updatedItems = this.currentCart.items.filter(item => {
      const matchesId = (item.product.id !== undefined && item.product.id !== null && String(item.product.id) === strId) ||
                        (item.product.slug && item.product.slug === strId) ||
                        (item.product.name && item.product.name.trim().toLowerCase() === strId.trim().toLowerCase());
      const matchesMetal = !selectedMetal || item.selectedMetal === selectedMetal;

      return !(matchesId && matchesMetal);
    });

    this.saveAndUpdate(updatedItems);
  }

  clearCart(): void {
    this.saveAndUpdate([]);
  }

  syncCartWithMockProducts(): void {
    const currentItems = this.loadCartFromStorage();
    if (currentItems && currentItems.length > 0) {
      this.cartSubject.next(this.calculateSummary(currentItems));
    }
  }

  private saveAndUpdate(items: CartItem[]): void {
    this.saveCartToStorage(items);
    this.cartSubject.next(this.calculateSummary(items));
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedCart = localStorage.getItem(this.STORAGE_KEY);
        if (!savedCart) return [];

        let parsedCart: any[];
        try {
          parsedCart = JSON.parse(savedCart);
        } catch {
          return [];
        }

        if (!Array.isArray(parsedCart) || parsedCart.length === 0) return [];

        const storedMockProductsData = localStorage.getItem('arista_mock_products_v3') || localStorage.getItem('arista_mock_products');
        let mockProductsMap = new Map<string, any>();

        if (storedMockProductsData) {
          try {
            const parsedMock = JSON.parse(storedMockProductsData);
            if (Array.isArray(parsedMock)) {
              parsedMock.forEach(p => {
                if (p) {
                  if (p.id !== undefined && p.id !== null && String(p.id).trim() !== '') {
                    mockProductsMap.set(String(p.id), p);
                  }
                  if (p.slug && String(p.slug).trim() !== '') {
                    mockProductsMap.set(String(p.slug), p);
                  }
                  if (p.name && String(p.name).trim() !== '') {
                    mockProductsMap.set(p.name.trim().toLowerCase(), p);
                  }
                }
              });
            }
          } catch {}
        }

        const syncedItems: CartItem[] = parsedCart.map(item => {
          if (!item || !item.product) return item;

          let freshProd: any = null;
          if (item.product.id !== undefined && item.product.id !== null && String(item.product.id).trim() !== '') {
            freshProd = mockProductsMap.get(String(item.product.id));
          }
          if (!freshProd && item.product.slug) {
            freshProd = mockProductsMap.get(String(item.product.slug));
          }
          if (!freshProd && item.product.name) {
            freshProd = mockProductsMap.get(item.product.name.trim().toLowerCase());
          }

          if (freshProd) {
            const updatedImage = freshProd.image || item.product.image;
            const updatedPrice = (freshProd.price !== undefined && !isNaN(Number(freshProd.price))) 
              ? Number(freshProd.price) 
              : (Number(item.product.price) || 0);
            const updatedQty = Math.max(1, Number(item.quantity) || 1);
            return {
              ...item,
              quantity: updatedQty,
              selectedMetal: item.selectedMetal || '18K Warm Gold',
              product: {
                ...item.product,
                id: item.product.id !== undefined && item.product.id !== null ? item.product.id : freshProd.id,
                name: freshProd.name || item.product.name,
                price: updatedPrice,
                image: updatedImage || '/assets/images/placeholder-jewellery.svg',
                category: freshProd.category || item.product.category,
                badge: freshProd.badge || item.product.badge
              },
              subtotal: updatedPrice * updatedQty
            };
          }

          const itemPrice = Number(item.product.price) || 0;
          const itemQty = Math.max(1, Number(item.quantity) || 1);
          return {
            ...item,
            quantity: itemQty,
            selectedMetal: item.selectedMetal || '18K Warm Gold',
            subtotal: itemPrice * itemQty
          };
        }).filter(item => item && item.product && (item.product.name || item.product.id || item.product.slug));

        if (syncedItems.length > 0) {
          this.saveCartToStorage(syncedItems);
          return syncedItems;
        } else if (parsedCart.length > 0) {
          return parsedCart;
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

