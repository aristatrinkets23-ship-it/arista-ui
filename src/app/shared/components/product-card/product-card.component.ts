import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardData } from '../../../core/models/product-card-data.model';
import { BadgeComponent } from '../badge/badge.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

const DEFAULT_IMAGE = 'assets/images/placeholder-jewellery.svg';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent],
  template: `
    <div class="product-card" *ngIf="product">
      <div class="image-wrapper">
        <span *ngIf="product.badge" class="badge-overlay">
          <app-badge [variant]="getBadgeVariant(product.badge)">{{ product.badge }}</app-badge>
        </span>
        <a [routerLink]="['/product', product.slug]" class="image-link">
          <img
            [src]="currentImage"
            [alt]="product.name || 'Arista Jewellery Product'"
            (error)="onImageError()"
            loading="lazy"
            class="product-image"
          />
        </a>

        <!-- Card Image Slide Arrows & Dots -->
        <ng-container *ngIf="productImages.length > 1">
          <button type="button" class="card-slide-btn card-prev" (click)="prevCardSlide($event)" aria-label="Previous image">
            ‹
          </button>
          <button type="button" class="card-slide-btn card-next" (click)="nextCardSlide($event)" aria-label="Next image">
            ›
          </button>

          <div class="card-slide-dots">
            <span
              *ngFor="let img of productImages; let i = index"
              class="card-dot"
              [class.active]="currentImageIndex === i"
              (click)="selectCardSlide($event, i)"
            ></span>
          </div>
        </ng-container>

        <button
          type="button"
          class="wishlist-btn"
          [class.active]="isFavorited"
          (click)="onWishlistToggle($event)"
          [attr.aria-label]="(isFavorited ? 'Remove ' : 'Add ') + product.name + ' to favorites'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="isFavorited ? '#D97706' : 'none'" [attr.stroke]="isFavorited ? '#D97706' : 'currentColor'" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>


      <div class="card-details">
        <div class="meta-section">
          <span *ngIf="product.category" class="category">{{ product.category }}</span>
          <h3 class="product-title">
            <a [routerLink]="['/product', product.slug]">{{ product.name }}</a>
          </h3>
        </div>
        <div class="price-row">
          <span class="price">₹{{ product.price | number:'1.2-2' }}</span>
          <span *ngIf="product.compareAtPrice && product.compareAtPrice > product.price" class="compare-price">
            ₹{{ product.compareAtPrice | number:'1.2-2' }}
          </span>
        </div>
        <div class="add-btn-wrapper">
          <button
            type="button"
            class="quick-add-btn"
            [class.added]="isAdded"
            (click)="onQuickAdd($event)"
          >
            <ng-container *ngIf="!isAdded">
              + Add to Cart
            </ng-container>
            <ng-container *ngIf="isAdded">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display: inline-block; vertical-align: -2px; margin-right: 4px;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Added
            </ng-container>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background-color: #FFFFFF;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--brand-warm-gold);
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background-color: var(--brand-pearl-beige);
      overflow: hidden;
    }

    .image-link {
      display: block;
      width: 100%;
      height: 100%;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
      display: block;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .card-slide-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: var(--brand-mocha-brown);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      opacity: 0;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .product-card:hover .card-slide-btn {
      opacity: 0.9;
    }
    .card-slide-btn:hover {
      opacity: 1 !important;
      background-color: var(--brand-warm-gold);
      color: #FFFFFF;
      transform: translateY(-50%) scale(1.1);
    }
    .card-prev { left: 6px; }
    .card-next { right: 6px; }

    .card-slide-dots {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    .product-card:hover .card-slide-dots {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .card-slide-btn,
      .card-slide-dots {
        opacity: 0.85;
      }
    }
    .card-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .card-dot.active {
      width: 14px;
      border-radius: 6px;
      background-color: var(--brand-warm-gold);
    }

    .badge-overlay {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 2;
    }

    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 2;
      width: 34px;
      height: 34px;
      min-width: 34px;
      min-height: 34px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(91, 70, 54, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--brand-mocha-brown);
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .wishlist-btn:hover {
      background-color: var(--brand-warm-gold);
      color: #FFFFFF;
      border-color: var(--brand-warm-gold);
      transform: scale(1.08);
    }

    .card-details {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 6px;
    }

    @media (min-width: 768px) {
      .card-details {
        padding: 14px 16px;
        gap: 8px;
      }
    }

    .meta-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .category {
      display: block;
      font-size: var(--font-size-card-cat);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
      color: var(--brand-warm-gold);
      line-height: 1.2;
    }

    .product-title {
      font-family: var(--font-serif);
      font-size: var(--font-size-card-title);
      line-height: 1.3;
      font-weight: 600;
      margin: 0;
    }
    .product-title a {
      color: var(--brand-mocha-brown);
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .product-title a:hover {
      color: var(--brand-warm-gold);
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-top: auto;
      padding-top: 4px;
      flex-wrap: wrap;
    }

    .price {
      font-family: var(--font-sans);
      font-weight: 700;
      font-size: var(--font-size-card-price);
      color: var(--brand-mocha-brown);
    }

    .compare-price {
      font-size: 0.8rem;
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .add-btn-wrapper {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 6px;
    }

    .quick-add-btn {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      padding: 7px 18px;
      width: 100%;
      max-width: 180px;
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
      text-align: center;
    }
    .quick-add-btn:hover {
      background-color: #E2B882;
      transform: translateY(-1px) scale(1.04);
      box-shadow: var(--shadow-md);
    }
    .quick-add-btn.added {
      background-color: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
      box-shadow: 0 2px 8px rgba(91, 70, 54, 0.25);
    }
    .quick-add-btn.added:hover {
      background-color: #4A3A2C;
      transform: none;
    }

    @media (max-width: 480px) {
      .card-details { padding: 8px 10px; gap: 4px; }
      .product-title { font-size: 0.88rem; }
      .price { font-size: 0.88rem; }
      .quick-add-btn { padding: 6px 10px; font-size: 0.7rem; max-width: 100%; }
    }
  `]
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: ProductCardData;
  @Output() wishlistToggle = new EventEmitter<ProductCardData>();

  currentImage: string = DEFAULT_IMAGE;
  currentImageIndex: number = 0;
  isAdded: boolean = false;
  isFavorited: boolean = false;
  private cartSub!: Subscription;
  private wishlistSub!: Subscription;

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  get productImages(): string[] {
    if (this.product && this.product.images && this.product.images.length > 0) {
      return this.product.images;
    }
    if (this.product && this.product.image) {
      return [this.product.image];
    }
    return [DEFAULT_IMAGE];
  }

  ngOnInit(): void {
    if (this.product && this.product.image && this.product.image.trim() !== '') {
      this.currentImage = this.product.image;
    } else {
      this.currentImage = DEFAULT_IMAGE;
    }

    this.checkCartStatus();
    this.checkWishlistStatus();

    this.cartSub = this.cartService.cart$.subscribe(() => {
      this.checkCartStatus();
    });

    this.wishlistSub = this.wishlistService.wishlist$.subscribe(() => {
      this.checkWishlistStatus();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  private checkWishlistStatus(): void {
    if (this.product) {
      const targetId = this.product.id || this.product.slug;
      if (targetId !== undefined && targetId !== null) {
        this.isFavorited = this.wishlistService.isInWishlist(targetId);
        this.cdr.detectChanges();
      }
    }
  }

  private checkCartStatus(): void {
    if (this.product) {
      const targetId = this.product.id || this.product.slug;
      if (targetId !== undefined && targetId !== null) {
        this.isAdded = this.cartService.isInCart(targetId);
        this.cdr.detectChanges();
      }
    }
  }

  onImageError(): void {
    this.currentImage = DEFAULT_IMAGE;
  }

  nextCardSlide(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const imgs = this.productImages;
    if (imgs.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % imgs.length;
    this.currentImage = imgs[this.currentImageIndex];
  }

  prevCardSlide(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const imgs = this.productImages;
    if (imgs.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + imgs.length) % imgs.length;
    this.currentImage = imgs[this.currentImageIndex];
  }

  selectCardSlide(event: Event, index: number): void {
    event.stopPropagation();
    event.preventDefault();
    const imgs = this.productImages;
    if (index >= 0 && index < imgs.length) {
      this.currentImageIndex = index;
      this.currentImage = imgs[index];
    }
  }

  onWishlistToggle(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.product) {
      this.isFavorited = this.wishlistService.toggleWishlist(this.product);
      this.wishlistToggle.emit(this.product);
    }
  }


  onQuickAdd(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.isAdded = true;
    }
  }

  getBadgeVariant(badge: string): 'gold' | 'mocha' | 'blush' | 'sage' | 'lavender' {
    switch (badge?.toUpperCase()) {
      case 'NEW': return 'sage';
      case 'SALE': return 'blush';
      case 'FEATURED': return 'gold';
      case 'BESTSELLER': return 'mocha';
      default: return 'gold';
    }
  }
}
