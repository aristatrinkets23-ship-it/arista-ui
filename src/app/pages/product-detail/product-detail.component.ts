import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Product } from '../../core/models/product.model';
import { MockDataService } from '../../core/mock/mock-data.service';
import { CartService } from '../../core/services/cart.service';

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
          <!-- Image Gallery Column -->
          <div class="gallery-column">
            <div class="main-image-wrapper">
              <span *ngIf="product.badge" class="badge-overlay">
                <app-badge [variant]="getBadgeVariant(product.badge)">{{ product.badge }}</app-badge>
              </span>
              <img [src]="selectedImage || '/assets/images/placeholder-jewellery.svg'" (error)="onImageError()" [alt]="product.name" class="main-img" />
            </div>
            <div *ngIf="product.images && product.images.length > 1" class="thumb-list">
              <button
                *ngFor="let img of product.images"
                type="button"
                [class.active]="selectedImage === img"
                (click)="selectedImage = img"
                class="thumb-btn"
              >
                <img [src]="img" (error)="onImageError()" [alt]="product.name" class="thumb-img" />
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
      gap: 12px;
      margin-top: 12px;
      flex-wrap: wrap;
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
export class ProductDetailComponent implements OnInit {
  product?: Product;
  relatedProducts: ProductCardData[] = [];
  selectedImage: string = '';
  selectedMetal: string = '18K Warm Gold';
  quantity: number = 1;
  openAcc: string = 'spec';
  addedToBagNotice: boolean = false;

  metalOptions = ['18K Warm Gold', 'Sterling Silver', 'Rose Gold'];

  private route = inject(ActivatedRoute);
  private mockDataService = inject(MockDataService);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'] || 'eternal-solitaire-diamond-ring';
      this.loadProduct(slug);
    });
  }

  onImageError(): void {
    this.selectedImage = '/assets/images/placeholder-jewellery.svg';
  }

  loadProduct(slug: string): void {
    this.mockDataService.getProductBySlug(slug).subscribe(p => {
      if (p) {
        this.product = p;
        this.selectedImage = p.image || '/assets/images/placeholder-jewellery.svg';
        this.selectedMetal = p.metalType || '18K Warm Gold';
        this.quantity = 1;
        this.addedToBagNotice = false;

        this.mockDataService.getRelatedProducts(p.slug).subscribe(rel => {
          this.relatedProducts = rel;
        });
      }
    });
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
