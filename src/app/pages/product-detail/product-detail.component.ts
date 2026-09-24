import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Product } from '../../core/models/product.model';
import { MockDataService } from '../../core/mock/mock-data.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionHeadingComponent,
    ProductCardComponent,
    ButtonComponent,
    BadgeComponent
  ],
  template: `
    <div class="product-detail-page" *ngIf="product">
      <!-- Main Product Grid -->
      <section class="section-padding">
        <div class="container product-main-grid">
          <!-- Image Gallery Column (Interactive Slideshow) -->
          <div class="gallery-column">
            <div class="main-image-wrapper">
              <span *ngIf="product.badge" class="badge-overlay">
                <app-badge [variant]="getBadgeVariant(product.badge)">{{ product.badge }}</app-badge>
              </span>

              <!-- Slide Main Image -->
              <img [src]="selectedImage || '/assets/images/placeholder-jewellery.svg'" (error)="onImageError()" [alt]="product.name" class="main-img" />

              <!-- Prev / Next Navigation Arrows -->
              <ng-container *ngIf="productImages.length > 1">
                <button type="button" class="slide-nav-btn prev-btn" (click)="prevSlide()" aria-label="Previous product image">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button type="button" class="slide-nav-btn next-btn" (click)="nextSlide()" aria-label="Next product image">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <!-- Slide Counter Badge -->
                <span class="slide-counter-badge">
                  {{ currentImageIndex + 1 }} / {{ productImages.length }}
                </span>

                <!-- Slide Indicator Dots -->
                <div class="slide-dots">
                  <span
                    *ngFor="let img of productImages; let i = index"
                    class="dot-pill"
                    [class.active]="currentImageIndex === i"
                    (click)="selectSlide(i)"
                  ></span>
                </div>
              </ng-container>
            </div>

            <!-- Thumbnail Strip -->
            <div *ngIf="productImages.length > 1" class="thumb-list">
              <button
                *ngFor="let img of productImages; let i = index"
                type="button"
                [class.active]="currentImageIndex === i"
                (click)="selectSlide(i)"
                class="thumb-btn"
              >
                <img [src]="img" (error)="onImageError()" [alt]="product.name + ' image ' + (i + 1)" class="thumb-img" />
              </button>
            </div>
          </div>

          <!-- Product Details Column -->
          <div class="info-column">
            <span class="product-category">{{ product.category }}</span>
            <h1 class="product-title">{{ product.name }}</h1>

            <div class="price-box">
              <span class="current-price">₹{{ product.price | number:'1.2-2' }}</span>
              <span *ngIf="product.compareAtPrice && product.compareAtPrice > product.price" class="compare-price">
                ₹{{ product.compareAtPrice | number:'1.2-2' }}
              </span>
              <span *ngIf="product.compareAtPrice && product.compareAtPrice > product.price" class="savings-tag">
                Save ₹{{ (product.compareAtPrice - product.price) | number:'1.2-2' }}
              </span>
            </div>

            <p class="product-description">{{ product.description }}</p>

            <!-- Metal Type Selection -->
            <div class="option-group">
              <label class="option-label">Metal Selection: <strong>{{ selectedMetal }}</strong></label>
              <div class="metal-pills">
                <button
                  *ngFor="let metal of metalOptions"
                  type="button"
                  [class.active]="selectedMetal === metal"
                  (click)="selectedMetal = metal"
                  class="metal-pill"
                >
                  {{ metal }}
                </button>
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="purchase-box">
              <div class="quantity-control">
                <button type="button" class="qty-btn" (click)="decreaseQty()" [disabled]="quantity <= 1">-</button>
                <span class="qty-val">{{ quantity }}</span>
                <button type="button" class="qty-btn" (click)="increaseQty()">+</button>
              </div>

              <button type="button" class="btn-add-bag" (click)="addToBag()">
                Add to Shopping Bag &bull; ₹{{ (product.price * quantity) | number:'1.2-2' }}
              </button>

              <button
                type="button"
                class="btn-wishlist-detail"
                [class.active]="isFavorited"
                (click)="toggleWishlist()"
                [attr.aria-label]="isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'"
                [title]="isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" [attr.fill]="isFavorited ? '#D97706' : 'none'" [attr.stroke]="isFavorited ? '#D97706' : 'currentColor'" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <!-- Added to Cart Feedback Banner -->
            <div *ngIf="addedToBagNotice" class="added-notice">
              ✓ Added {{ quantity }} item(s) to your shopping bag!
              <a routerLink="/cart" class="notice-link">View Bag &rarr;</a>
            </div>

            <!-- Accordion / Specifications Tabs -->
            <div class="accordion-box">
              <div class="acc-item">
                <button type="button" class="acc-header" (click)="toggleAcc('spec')">
                  <span>Product Specifications</span>
                  <span>{{ openAcc === 'spec' ? '−' : '+' }}</span>
                </button>
                <div *ngIf="openAcc === 'spec'" class="acc-content">
                  <table class="spec-table">
                    <tr *ngFor="let spec of product.specifications">
                      <td class="spec-label">{{ spec.label }}</td>
                      <td class="spec-val">{{ spec.value }}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <div class="acc-item">
                <button type="button" class="acc-header" (click)="toggleAcc('care')">
                  <span>Care & Maintenance Guide</span>
                  <span>{{ openAcc === 'care' ? '−' : '+' }}</span>
                </button>
                <div *ngIf="openAcc === 'care'" class="acc-content">
                  <p>{{ product.careGuide }}</p>
                </div>
              </div>

              <div class="acc-item">
                <button type="button" class="acc-header" (click)="toggleAcc('ship')">
                  <span>Complimentary Shipping & Returns</span>
                  <span>{{ openAcc === 'ship' ? '−' : '+' }}</span>
                </button>
                <div *ngIf="openAcc === 'ship'" class="acc-content">
                  <p>{{ product.shippingInfo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products -->
      <section class="section-padding bg-pearl" *ngIf="relatedProducts.length > 0">
        <div class="container">
          <app-section-heading
            subtitle="Complete Your Look"
            title="You May Also Cherish"
            align="center"
          ></app-section-heading>

          <div class="grid-products">
            <app-product-card
              *ngFor="let rel of relatedProducts"
              [product]="rel"
            ></app-product-card>
          </div>
        </div>
      </section>
    </div>

    <!-- Fallback Empty State when product is null/not found -->
    <div class="product-detail-page empty-detail-page" *ngIf="!product">
      <section class="section-padding text-center" style="padding: 90px 24px;">
        <div class="container" style="max-width: 580px; margin: 0 auto; background: var(--brand-pearl-beige); padding: 48px 32px; border-radius: 16px; border: 1px dashed var(--brand-warm-gold);">
          <div style="font-size: 3.2rem; margin-bottom: 16px;">✨</div>
          <h2 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.8rem; margin-bottom: 12px;">No Product Found</h2>
          <p style="color: #666; font-size: 0.98rem; line-height: 1.6; margin-bottom: 28px;">
            There are currently no products in the catalog or the requested jewellery piece is not available. Please add categories and products from the admin dashboard.
          </p>
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
            <a routerLink="/admin" style="padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: 700; background: var(--brand-warm-gold); color: #1A120B; font-size: 0.9rem; transition: transform 0.2s;">
              ⚙ Go to Admin to Add Products & Categories
            </a>
            <a routerLink="/shop" style="padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: 600; background: #FFFFFF; color: var(--brand-mocha-brown); font-size: 0.9rem; border: 1px solid var(--color-border);">
              Return to Shop Catalog
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .product-main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
    }
    @media (min-width: 992px) {
      .product-main-grid {
        grid-template-columns: 1fr 1fr;
        gap: 56px;
      }
    }

    .gallery-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .main-image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }

    .slide-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 5;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(91, 70, 54, 0.15);
      color: var(--brand-mocha-brown);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(91, 70, 54, 0.12);
      transition: all var(--transition-fast);
      opacity: 0.85;
    }

    .main-image-wrapper:hover .slide-nav-btn {
      opacity: 1;
    }

    .slide-nav-btn:hover {
      background-color: var(--brand-warm-gold);
      color: #FFFFFF;
      border-color: var(--brand-warm-gold);
      transform: translateY(-50%) scale(1.08);
    }

    .prev-btn { left: 12px; }
    .next-btn { right: 12px; }

    .slide-counter-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 5;
      background-color: rgba(26, 18, 11, 0.72);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      color: #FFFFFF;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      letter-spacing: 1px;
    }

    .slide-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      display: flex;
      gap: 6px;
    }

    .dot-pill {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .dot-pill.active {
      width: 22px;
      border-radius: 10px;
      background-color: var(--brand-warm-gold);
    }

    .badge-overlay {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;
    }

    .thumb-list {
      display: flex;
      gap: 12px;
    }

    .thumb-btn {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
      background: #FFFFFF;
      cursor: pointer;
      overflow: hidden;
      padding: 0;
    }
    .thumb-btn.active {
      border-color: var(--brand-warm-gold);
      box-shadow: 0 0 0 2px var(--brand-warm-gold);
    }

    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .info-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .product-category {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
    }

    .product-title {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      color: var(--brand-mocha-brown);
      line-height: 1.2;
    }

    .price-box {
      display: flex;
      align-items: baseline;
      gap: 12px;
      flex-wrap: wrap;
    }

    .current-price {
      font-family: var(--font-sans);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
    }

    .compare-price {
      font-size: 1rem;
      text-decoration: line-through;
      color: #888888;
    }

    .savings-tag {
      font-size: 0.78rem;
      font-weight: 700;
      background-color: var(--brand-soft-blush);
      color: #C2410C;
      padding: 4px 8px;
      border-radius: var(--radius-full);
    }

    .product-description {
      font-size: 0.98rem;
      color: #555555;
      line-height: 1.65;
    }

    .option-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .option-label {
      font-size: 0.85rem;
      color: var(--brand-mocha-brown);
    }

    .metal-pills {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .metal-pill {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      padding: 8px 18px;
      min-height: 40px;
      border-radius: var(--radius-full);
      font-size: 0.84rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .metal-pill.active, .metal-pill:hover {
      border-color: var(--brand-warm-gold);
      background-color: var(--brand-pearl-beige);
    }

    .purchase-box {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    @media (max-width: 576px) {
      .purchase-box {
        flex-direction: column;
        align-items: stretch;
      }
      .quantity-control {
        justify-content: center;
      }
      .btn-add-bag {
        min-width: 100%;
        height: 46px;
        font-size: 0.88rem;
      }
      .btn-wishlist-detail {
        align-self: center;
      }
    }

    .quantity-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background-color: #FFFFFF;
      height: 42px;
      padding: 0 4px;
    }

    .qty-btn {
      background: transparent;
      border: none;
      width: 34px;
      height: 100%;
      font-size: 1.1rem;
      color: var(--brand-mocha-brown);
      cursor: pointer;
    }
    .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .qty-val {
      padding: 0 10px;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--brand-mocha-brown);
    }

    .btn-add-bag {
      flex: 1;
      min-width: 200px;
      height: 42px;
      padding: 8px 24px;
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.84rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }

    .btn-add-bag:hover {
      background-color: #E2B882;
      box-shadow: var(--shadow-gold);
      transform: translateY(-1px);
    }

    .btn-wishlist-detail {
      width: 44px;
      height: 44px;
      min-width: 44px;
      border-radius: 50%;
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      color: var(--brand-mocha-brown);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .btn-wishlist-detail:hover {
      border-color: var(--brand-warm-gold);
      background-color: var(--brand-pearl-beige);
      transform: scale(1.06);
    }
    .btn-wishlist-detail.active {
      border-color: #F59E0B;
      background-color: #FFFBEB;
      color: #D97706;
    }

    .added-notice {
      background-color: #F0F7ED;
      border: 1px solid #C8E6C9;
      color: #2E7D32;
      padding: 10px 16px;
      border-radius: var(--radius-full);
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notice-link {
      color: #2E7D32;
      text-decoration: underline;
      font-weight: 700;
    }

    /* Accordion Box */
    .accordion-box {
      margin-top: 16px;
      border-top: 1px solid var(--color-border);
    }

    .acc-item {
      border-bottom: 1px solid var(--color-border);
    }

    .acc-header {
      width: 100%;
      background: transparent;
      border: none;
      padding: 16px 0;
      min-height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-serif);
      font-size: 1.1rem;
      color: var(--brand-mocha-brown);
      cursor: pointer;
    }

    .acc-content {
      padding-bottom: 16px;
      font-size: 0.92rem;
      color: #555555;
      line-height: 1.6;
    }

    .spec-table {
      width: 100%;
      border-collapse: collapse;
    }
    .spec-table td {
      padding: 6px 0;
      border-bottom: 1px solid var(--brand-pearl-beige);
    }
    .spec-label {
      font-weight: 600;
      color: var(--brand-mocha-brown);
      width: 40%;
    }
    .spec-val { color: #555555; }

    .bg-pearl { background-color: var(--brand-pearl-beige); }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  relatedProducts: ProductCardData[] = [];
  selectedImage: string = '';
  currentImageIndex: number = 0;
  selectedMetal: string = '18K Warm Gold';
  quantity: number = 1;
  openAcc: string = 'spec';
  addedToBagNotice: boolean = false;
  isFavorited: boolean = false;

  metalOptions = ['18K Warm Gold', 'Sterling Silver', 'Rose Gold'];

  private route = inject(ActivatedRoute);
  private mockDataService = inject(MockDataService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private wishlistSub!: Subscription;

  get productImages(): string[] {
    if (this.product && this.product.images && this.product.images.length > 0) {
      return this.product.images;
    }
    if (this.product && this.product.image) {
      return [this.product.image];
    }
    return ['/assets/images/placeholder-jewellery.svg'];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'eternal-solitaire-diamond-ring';
      this.loadProduct(slug);
    });

    this.wishlistSub = this.wishlistService.wishlist$.subscribe(() => {
      this.checkWishlistStatus();
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  onImageError(): void {
    this.selectedImage = '/assets/images/placeholder-jewellery.svg';
  }

  loadProduct(slug: string): void {
    this.mockDataService.getProductBySlug(slug).subscribe(p => {
      if (p) {
        this.product = p;
        this.currentImageIndex = 0;
        const imgs = this.productImages;
        this.selectedImage = imgs[0] || p.image || '/assets/images/placeholder-jewellery.svg';

        if (p.materials && Array.isArray(p.materials) && p.materials.length > 0) {
          this.metalOptions = p.materials;
        } else if (typeof (p as any).materials === 'string' && (p as any).materials) {
          this.metalOptions = ((p as any).materials as string).split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
        } else {
          this.metalOptions = ['18K Warm Gold', 'Sterling Silver', 'Rose Gold'];
        }

        this.selectedMetal = p.metalType || (this.metalOptions.length > 0 ? this.metalOptions[0] : '18K Warm Gold');
        this.quantity = 1;
        this.addedToBagNotice = false;

        this.checkWishlistStatus();

        this.mockDataService.getRelatedProducts(p.slug).subscribe(rel => {
          this.relatedProducts = rel;
        });
      }
    });
  }

  private checkWishlistStatus(): void {
    if (this.product) {
      const targetId = this.product.id || this.product.slug;
      if (targetId !== undefined && targetId !== null) {
        this.isFavorited = this.wishlistService.isInWishlist(targetId);
      }
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      const cardData: ProductCardData = {
        id: this.product.id,
        name: this.product.name,
        slug: this.product.slug,
        price: this.product.price,
        compareAtPrice: this.product.compareAtPrice,
        image: this.product.image || (this.product.images && this.product.images[0]) || '',
        category: this.product.category,
        badge: this.product.badge as any,
        available: true,
        ratingAverage: (this.product as any).ratingAverage || (this.product as any).rating,
        reviewCount: (this.product as any).reviewCount
      };
      this.isFavorited = this.wishlistService.toggleWishlist(cardData);
    }
  }

  nextSlide(): void {
    const images = this.productImages;
    if (images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    this.selectedImage = images[this.currentImageIndex];
  }

  prevSlide(): void {
    const images = this.productImages;
    if (images.length <= 1) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
    this.selectedImage = images[this.currentImageIndex];
  }

  selectSlide(index: number): void {
    const images = this.productImages;
    if (index >= 0 && index < images.length) {
      this.currentImageIndex = index;
      this.selectedImage = images[index];
    }
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleAcc(tab: string): void {
    this.openAcc = this.openAcc === tab ? '' : tab;
  }

  addToBag(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity, this.selectedMetal);
      this.addedToBagNotice = true;
      setTimeout(() => {
        this.addedToBagNotice = false;
      }, 5000);
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

