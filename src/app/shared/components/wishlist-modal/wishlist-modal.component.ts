import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductCardData } from '../../../core/models/product-card-data.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-wishlist-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wishlist-modal-backdrop">
      <div class="wishlist-modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-title-wrap">
            <span class="heart-icon-badge">❤️</span>
            <h2 class="modal-title">Your Saved Favorites</h2>
            <span class="count-pill">{{ items.length }} item(s)</span>
          </div>
          <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close wishlist">&times;</button>
        </div>

        <!-- Empty Wishlist State -->
        <div *ngIf="items.length === 0" class="empty-state">
          <div class="empty-icon">💎</div>
          <h3 class="empty-title">Your Wishlist is Empty</h3>
          <p class="empty-desc">
            Explore our artisanal jewellery collections and tap the heart icon on any piece to save your favorite trinkets!
          </p>
          <a routerLink="/shop" (click)="closeModal()" class="btn-explore">Explore Collections &rarr;</a>
        </div>

        <!-- Wishlist Items List -->
        <div *ngIf="items.length > 0" class="items-body">
          <div *ngFor="let item of items" class="wishlist-item-card">
            <a [routerLink]="['/product', item.slug]" (click)="closeModal()" class="item-img-link">
              <img [src]="item.image || '/assets/images/placeholder-jewellery.svg'" [alt]="item.name" class="item-img" />
            </a>

            <div class="item-details">
              <span class="item-cat">{{ item.category || 'Fine Jewellery' }}</span>
              <h4 class="item-name">
                <a [routerLink]="['/product', item.slug]" (click)="closeModal()">{{ item.name }}</a>
              </h4>
              <div class="item-price">
                <span>₹{{ item.price | number:'1.2-2' }}</span>
                <span *ngIf="item.compareAtPrice && item.compareAtPrice > item.price" style="text-decoration: line-through; color: #888; font-size: 0.8rem; margin-left: 6px;">
                  ₹{{ item.compareAtPrice | number:'1.2-2' }}
                </span>
                <span *ngIf="getDiscountPercentage(item) > 0" style="background: #FEF2F2; color: #DC2626; font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; margin-left: 6px; display: inline-block;">
                  {{ getDiscountPercentage(item) }}% OFF
                </span>
              </div>
            </div>

            <div class="item-actions">
              <button type="button" class="btn-add-cart" [class.in-cart]="isItemInCart(item)" (click)="addToCart(item)">
                {{ isItemInCart(item) ? 'Go to Cart' : '+ Add to Bag' }}
              </button>
              <button type="button" class="btn-remove" (click)="removeItem(item.id || item.slug)" aria-label="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div *ngIf="items.length > 0" class="modal-footer">
          <button type="button" class="btn-clear-all" (click)="clearAll()">Clear Wishlist</button>
          <a routerLink="/cart" (click)="closeModal()" class="btn-view-cart">View Shopping Bag &rarr;</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 18, 11, 0.75);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.2s ease-out;
    }

    .wishlist-modal-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border, #E4D5C7);
      border-radius: 16px;
      max-width: 520px;
      width: 100%;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      background: var(--brand-pearl-beige, #F9F6F0);
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(207, 168, 116, 0.25);
    }

    .header-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .heart-icon-badge {
      font-size: 1.4rem;
    }

    .modal-title {
      font-family: var(--font-serif, serif);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--brand-mocha-brown, #3B2A1E);
      margin: 0;
    }

    .count-pill {
      background: var(--brand-warm-gold, #CFA874);
      color: #1A120B;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
    }

    .btn-close {
      background: transparent;
      border: none;
      font-size: 1.8rem;
      color: #888;
      cursor: pointer;
      line-height: 1;
    }
    .btn-close:hover { color: #111; }

    .items-body {
      padding: 20px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .wishlist-item-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #FAFAFA;
      border: 1px solid var(--color-border, #E4D5C7);
      border-radius: 10px;
      padding: 10px 14px;
    }

    .item-img-link {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #EFEFEF;
    }

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-cat {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-warm-gold, #CFA874);
    }

    .item-name {
      font-family: var(--font-serif, serif);
      font-size: 0.95rem;
      margin: 0;
    }
    .item-name a {
      color: var(--brand-mocha-brown, #3B2A1E);
      text-decoration: none;
    }
    .item-name a:hover {
      color: var(--brand-warm-gold, #CFA874);
    }

    .item-price {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--brand-mocha-brown, #3B2A1E);
    }

    .item-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-add-cart {
      background: var(--brand-warm-gold, #CFA874);
      color: var(--brand-mocha-brown, #3B2A1E);
      border: none;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .btn-add-cart:hover {
      background: #E2B882;
      transform: translateY(-1px);
    }

    .btn-remove {
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .btn-remove:hover { color: #DC2626; background: #FEE2E2; }

    .modal-footer {
      padding: 16px 24px;
      background: var(--brand-pearl-beige, #F9F6F0);
      border-top: 1px solid rgba(207, 168, 116, 0.25);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-clear-all {
      background: transparent;
      border: none;
      color: #888;
      font-size: 0.8rem;
      text-decoration: underline;
      cursor: pointer;
    }
    .btn-clear-all:hover { color: #333; }

    .btn-view-cart {
      background: var(--brand-mocha-brown, #3B2A1E);
      color: #FFFFFF;
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-view-cart:hover {
      background: #2D1E14;
    }

    .empty-state {
      padding: 40px 24px;
      text-align: center;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-title {
      font-family: var(--font-serif, serif);
      font-size: 1.4rem;
      color: var(--brand-mocha-brown, #3B2A1E);
      margin-bottom: 8px;
    }
    .empty-desc {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .btn-explore {
      display: inline-block;
      padding: 10px 24px;
      background: var(--brand-warm-gold, #CFA874);
      color: var(--brand-mocha-brown, #3B2A1E);
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class WishlistModalComponent {
  @Input() items: ProductCardData[] = [];
  @Output() closed = new EventEmitter<void>();

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private router = inject(Router);

  closeModal(): void {
    this.closed.emit();
  }

  getDiscountPercentage(product: ProductCardData): number {
    if (
      product &&
      product.compareAtPrice !== undefined &&
      product.compareAtPrice !== null &&
      Number(product.compareAtPrice) > Number(product.price) &&
      Number(product.compareAtPrice) > 0
    ) {
      const price = Number(product.price) || 0;
      const compareAtPrice = Number(product.compareAtPrice) || 0;
      const savings = compareAtPrice - price;
      return Math.round((savings / compareAtPrice) * 100);
    }
    return 0;
  }

  isItemInCart(item: ProductCardData): boolean {
    const targetId = item.id || item.slug;
    return targetId ? this.cartService.isInCart(targetId) : false;
  }

  addToCart(item: ProductCardData): void {
    const targetId = item.id || item.slug;
    if (targetId && this.cartService.isInCart(targetId)) {
      this.closeModal();
      this.router.navigate(['/cart']);
      return;
    }
    this.cartService.addToCart(item, 1);
  }

  removeItem(idOrSlug: number | string): void {
    this.wishlistService.removeFromWishlist(idOrSlug);
  }

  clearAll(): void {
    this.wishlistService.clearWishlist();
  }
}
