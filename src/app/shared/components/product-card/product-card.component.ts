import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardData } from '../../../core/models/product-card-data.model';
import { BadgeComponent } from '../badge/badge.component';

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
        <button
          type="button"
          class="wishlist-btn"
          (click)="onWishlistToggle($event)"
          [attr.aria-label]="'Add ' + product.name + ' to wishlist'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
  `]
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductCardData;
  @Output() wishlistToggle = new EventEmitter<ProductCardData>();

  currentImage: string = DEFAULT_IMAGE;

  ngOnInit(): void {
    if (this.product && this.product.image && this.product.image.trim() !== '') {
      this.currentImage = this.product.image;
    } else {
      this.currentImage = DEFAULT_IMAGE;
    }
  }

  onImageError(): void {
    this.currentImage = DEFAULT_IMAGE;
  }

  onWishlistToggle(event: Event): void {
    event.stopPropagation();
    this.wishlistToggle.emit(this.product);
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
