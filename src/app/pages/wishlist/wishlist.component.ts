import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, ProductCardComponent],
  template: `
    <!-- Wishlist Page Hero Header -->
    <section class="wishlist-hero">
      <div class="container">
        <div class="hero-content-card">
          <span class="hero-eyebrow">The Arista Private Vault</span>
          <h1 class="hero-title">Your Saved Favorites & Wishlist</h1>
        </div>
      </div>
    </section>

    <!-- Main Wishlist Content -->
    <section class="section-padding">
      <div class="container">
        <!-- Action Bar (Add All / Clear All) -->
        <div *ngIf="wishlistItems.length > 0" class="wishlist-action-bar">
          <div class="count-info">
            <span class="count-badge">❤️ {{ wishlistItems.length }} Item(s) Saved</span>
          </div>
          <div class="bar-actions">
            <button type="button" class="btn-add-all" (click)="addAllToBag()">
              🛍️ Add All Items to Shopping Bag
            </button>
            <button type="button" class="btn-clear-all" (click)="openClearModal()">
              Clear Wishlist
            </button>
          </div>
        </div>

        <!-- Wishlist Products Grid -->
        <div *ngIf="wishlistItems.length > 0" class="grid-products">
          <app-product-card
            *ngFor="let item of wishlistItems"
            [product]="item"
          ></app-product-card>
        </div>

        <!-- Empty Wishlist State -->
        <div *ngIf="wishlistItems.length === 0" class="empty-wishlist-card">
          <div class="empty-icon">💎</div>
          <h2 class="empty-title">Your Wishlist is Empty</h2>
          <p class="empty-desc">
            You haven't saved any pieces yet. Explore our demi fine, anti tarnish jewellery collections and click the heart icon on any product card to curate your private favorites vault!
          </p>
          <div class="empty-actions">
            <a routerLink="/shop" class="btn-shop-now">
              Explore Shop Catalog &rarr;
            </a>
          </div>
        </div>

        <!-- Clear Wishlist Confirmation Modal Popup -->
        <div *ngIf="showClearModal" class="wishlist-modal-backdrop">
          <div class="wishlist-modal-card" (click)="$event.stopPropagation()">
            <div class="modal-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3 class="modal-title">Clear Saved Favorites?</h3>
            <p class="modal-desc">
              Are you sure you want to clear all <strong>{{ wishlistItems.length }} item{{ wishlistItems.length > 1 ? 's' : '' }}</strong> from your saved wishlist?
            </p>
            <div class="modal-actions">
              <button type="button" class="modal-btn-cancel" (click)="closeClearModal()">Keep Wishlist</button>
              <button type="button" class="modal-btn-confirm" (click)="confirmClearWishlist()">
                Yes, Clear Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wishlist-hero {
      position: relative;
      background: linear-gradient(90deg, rgba(28, 18, 12, 0.8) 0%, rgba(28, 18, 12, 0.45) 45%, rgba(28, 18, 12, 0) 80%), url('/assets/images/wishlist-hero-bg.webp') center right/cover no-repeat;
      padding: 72px 0;
      border-bottom: 1px solid var(--color-border, #E4D5C7);
      min-height: 280px;
      display: flex;
      align-items: center;
    }

    .wishlist-hero .container {
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }

    .hero-content-card {
      max-width: 560px;
      text-align: left;
      padding: 10px 0;
    }

    .hero-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #E2B882;
      display: block;
      margin-bottom: 8px;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(1.9rem, 3.8vw, 2.8rem);
      font-weight: 700;
      color: #FFF6EC;
      margin: 0 0 10px 0;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-desc {
      font-size: 0.95rem;
      color: #E0D4C5;
      margin: 0;
    }

    .wishlist-action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-bottom: 24px;
    }

    .count-badge {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--brand-mocha-brown, #3B2A1E);
    }

    .bar-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn-add-all {
      background: var(--brand-warm-gold, #CFA874);
      color: var(--brand-mocha-brown, #3B2A1E);
      border: none;
      padding: 8px 18px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-add-all:hover {
      background: #E2B882;
      transform: translateY(-1px);
    }

    .btn-clear-all {
      background: transparent;
      border: 1px solid var(--color-border, #E4D5C7);
      color: #777777;
      padding: 8px 16px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-clear-all:hover {
      background: #FEE2E2;
      color: #DC2626;
      border-color: #FCA5A5;
    }


    /* Grid */
    .grid-products {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 20px;
    }
    @media (min-width: 576px) {
      .grid-products { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 992px) {
      .grid-products { grid-template-columns: repeat(4, 1fr); gap: 28px; }
    }

    /* Empty Card */
    .empty-wishlist-card {
      max-width: 620px;
      margin: 40px auto;
      background: var(--brand-pearl-beige, #F9F6F0);
      border: 1px dashed var(--brand-warm-gold, #CFA874);
      border-radius: 16px;
      padding: 56px 32px;
      text-align: center;
    }

    .empty-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }

    .empty-title {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      color: var(--brand-mocha-brown, #3B2A1E);
      margin-bottom: 12px;
    }

    .empty-desc {
      font-size: 0.96rem;
      color: #666666;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .empty-actions {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-shop-now {
      padding: 12px 28px;
      background: var(--brand-warm-gold, #CFA874);
      color: var(--brand-mocha-brown, #3B2A1E);
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    .btn-shop-now:hover {
      background: #E2B882;
      transform: translateY(-1px);
    }
    /* Wishlist Confirmation Modal Overlay */
    .wishlist-modal-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(26, 18, 11, 0.75) !important;
      backdrop-filter: blur(5px) !important;
      -webkit-backdrop-filter: blur(5px) !important;
      z-index: 999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .wishlist-modal-card {
      background: #FFFFFF !important;
      border: 1px solid var(--color-border) !important;
      border-radius: var(--radius-md, 16px) !important;
      padding: 32px 28px !important;
      max-width: 420px !important;
      width: 100% !important;
      text-align: center !important;
      margin: auto !important;
      position: relative !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25) !important;
      animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes popIn {
      from { transform: scale(0.9) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .modal-icon-wrap {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #FFEBEE;
      color: #C62828;
      border: 1px solid #FFCDD2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }

    .modal-title {
      font-family: var(--font-serif);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
    }

    .modal-desc {
      font-size: 0.9rem;
      color: #666666;
      line-height: 1.5;
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .modal-btn-cancel {
      flex: 1;
      background: #F4EFEA;
      border: 1px solid var(--color-border);
      color: var(--brand-mocha-brown);
      padding: 10px 18px;
      border-radius: 50px;
      font-size: 0.86rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .modal-btn-cancel:hover {
      background: #EAE3DA;
    }

    .modal-btn-confirm {
      flex: 1;
      background: #DC2626;
      color: #FFFFFF;
      border: none;
      padding: 10px 18px;
      border-radius: 50px;
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
    }

    .modal-btn-confirm:hover {
      background: #B91C1C;
    }
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: ProductCardData[] = [];
  showClearModal: boolean = false;
  private wishlistSub!: Subscription;

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.wishlistSub = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items || [];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  addAllToBag(): void {
    this.wishlistItems.forEach(item => {
      this.cartService.addToCart(item, 1);
    });
    this.router.navigate(['/cart']);
  }

  openClearModal(): void {
    this.showClearModal = true;
    this.cdr.detectChanges();
  }

  closeClearModal(): void {
    this.showClearModal = false;
    this.cdr.detectChanges();
  }

  confirmClearWishlist(): void {
    this.wishlistService.clearWishlist();
    this.showClearModal = false;
    this.cdr.detectChanges();
  }
}
