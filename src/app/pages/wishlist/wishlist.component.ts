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
            <button type="button" class="btn-clear-all" (click)="clearWishlist()">
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
            You haven't saved any fine jewellery pieces yet. Explore our handcrafted collections and click the heart icon on any product card to curate your private favorites vault!
          </p>
          <div class="empty-actions">
            <a routerLink="/shop" class="btn-shop-now">
              Explore Shop Catalog &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .wishlist-hero {
      position: relative;
      background: linear-gradient(90deg, rgba(28, 18, 12, 0.8) 0%, rgba(28, 18, 12, 0.45) 45%, rgba(28, 18, 12, 0) 80%), url('/assets/images/wishlist-hero-bg.jpg') center right/cover no-repeat;
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
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: ProductCardData[] = [];
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

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistService.clearWishlist();
    }
  }
}
