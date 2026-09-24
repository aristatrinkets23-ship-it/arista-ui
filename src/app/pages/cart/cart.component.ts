import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CartSummary } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { resolveProductImage, getFallbackProductImage } from '../../core/utils/image-utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionHeadingComponent,
    ButtonComponent,
    EmptyStateComponent
  ],
  template: `
    <!-- Cart Hero -->
    <section class="cart-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow">Shopping Bag</span>
          <h1 class="hero-title">Your Curated Jewels</h1>
          <p class="hero-subtitle">Review your handpicked heirloom pieces and fine jewellery</p>
        </div>
      </div>
    </section>

    <!-- Main Cart Content -->
    <section class="section-padding">
      <div class="container">
        <!-- Empty Cart State -->
        <app-empty-state
          *ngIf="cart.items.length === 0"
          title="Your Shopping Bag is Empty"
          description="You have no items in your shopping bag yet. Explore our fine jewellery collections to find your signature piece."
          actionText="Explore Collections"
          actionPath="/shop"
        ></app-empty-state>

        <!-- Active Cart Content -->
        <div *ngIf="cart.items.length > 0" class="cart-layout">
          <!-- Cart Items List Column -->
          <div class="items-column">
            <div class="cart-header-row">
              <span class="col-product">Product</span>
              <span class="col-price">Price</span>
              <span class="col-qty">Quantity</span>
              <span class="col-total">Total</span>
            </div>

            <div *ngFor="let item of cart.items" class="cart-item-card">
              <div class="item-main">
                <a [routerLink]="['/product', item.product.slug]" class="item-img-link">
                  <img [src]="getItemImage(item)" (error)="onImageError($event, item)" [alt]="item.product.name" class="item-img" />
                </a>
                <div class="item-details">
                  <span class="item-cat">{{ item.product.category }}</span>
                  <h3 class="item-title">
                    <a [routerLink]="['/product', item.product.slug]">{{ item.product.name }}</a>
                  </h3>
                  <span *ngIf="item.selectedMetal" class="item-metal">Metal: {{ item.selectedMetal }}</span>
                  <button type="button" class="btn-remove" (click)="removeItem(item)">
                    Remove
                  </button>
                </div>
              </div>

              <div class="item-price">
                <span class="main-price">₹{{ item.product.price | number:'1.2-2' }}</span>
                <span *ngIf="item.product.compareAtPrice && item.product.compareAtPrice > item.product.price" class="compare-price-small" style="display: block; text-decoration: line-through; color: #888; font-size: 0.78rem;">
                  ₹{{ item.product.compareAtPrice | number:'1.2-2' }}
                </span>
                <span *ngIf="getDiscountPercentage(item.product) > 0" class="discount-tag" style="display: inline-block; background: #FEF2F2; color: #DC2626; font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; margin-top: 2px;">
                  {{ getDiscountPercentage(item.product) }}% OFF
                </span>
              </div>

              <div class="item-qty">
                <div class="qty-control">
                  <button type="button" class="qty-btn" (click)="updateQty(item, item.quantity - 1)">-</button>
                  <span class="qty-val">{{ item.quantity }}</span>
                  <button type="button" class="qty-btn" (click)="updateQty(item, item.quantity + 1)">+</button>
                </div>
              </div>

              <div class="item-subtotal">
                ₹{{ item.subtotal | number:'1.2-2' }}
              </div>
            </div>

            <div class="cart-actions-bar">
              <a routerLink="/shop" class="link-continue">&larr; Continue Shopping</a>
              <button type="button" class="btn-clear" (click)="clearCart()">Clear Bag</button>
            </div>
          </div>

          <!-- Order Summary Column -->
          <div class="summary-column">
            <div class="summary-card">
              <h3 class="summary-title">Order Summary</h3>

              <div class="summary-row">
                <span>Subtotal ({{ cart.itemCount }} item{{ cart.itemCount > 1 ? 's' : '' }})</span>
                <span>₹{{ cart.subtotal | number:'1.2-2' }}</span>
              </div>

              <div class="summary-row">
                <span>Estimated Shipping</span>
                <span *ngIf="cart.estimatedShipping === 0" class="free-tag">Complimentary</span>
                <span *ngIf="cart.estimatedShipping > 0">₹{{ cart.estimatedShipping | number:'1.2-2' }}</span>
              </div>

              <div class="summary-row">
                <span>Estimated Tax (GST)</span>
                <span>₹{{ cart.estimatedTax | number:'1.2-2' }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total-row">
                <span>Total Amount</span>
                <span class="total-val">₹{{ cart.total | number:'1.2-2' }}</span>
              </div>

              <a routerLink="/checkout" class="btn-checkout-link">
                <app-button variant="primary" size="lg">Proceed to Checkout &rarr;</app-button>
              </a>

              <div class="security-guarantee">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Insured Delivery & 100% Authentic Jewellery Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cart-hero {
      position: relative;
      background-image: url('/assets/images/cart-hero-banner.jpg');
      background-size: cover;
      background-position: center right;
      background-repeat: no-repeat;
      padding: 64px 0;
      min-height: 280px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--color-border, #E5E0D8);
      overflow: hidden;
    }

    .hero-bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(253, 249, 244, 0.96) 0%,
        rgba(253, 249, 244, 0.88) 35%,
        rgba(253, 249, 244, 0.35) 65%,
        rgba(253, 249, 244, 0) 90%
      );
      pointer-events: none;
    }

    .hero-container {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: var(--container-max-width, 1280px);
      margin: 0 auto;
      padding-left: 24px;
      padding-right: 24px;
    }

    .hero-content {
      max-width: 520px;
      margin: 0;
      text-align: left;
    }

    .hero-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold, #CFA874);
      display: block;
      margin-bottom: 8px;
      text-align: left;
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 700;
      color: var(--brand-mocha-brown, #5B4636);
      margin: 0 0 10px 0;
      line-height: 1.2;
      letter-spacing: -0.2px;
      text-align: left;
    }

    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: clamp(0.88rem, 1.6vw, 1rem);
      color: #6A5544;
      margin: 0;
      max-width: 480px;
      font-weight: 400;
      text-align: left;
      line-height: 1.5;
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
    }

    @media (min-width: 992px) {
      .cart-layout {
        grid-template-columns: 1fr 360px;
        gap: 48px;
      }
    }

    .cart-header-row {
      display: none;
      grid-template-columns: 3fr 1fr 1fr 1fr;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--brand-mocha-brown);
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
    }

    @media (min-width: 768px) {
      .cart-header-row { display: grid; }
    }

    .cart-item-card {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 20px 0;
      border-bottom: 1px solid var(--color-border);
      align-items: center;
    }

    @media (max-width: 576px) {
      .cart-item-card {
        grid-template-columns: 1fr 1fr;
        gap: 12px 10px;
      }
      .item-main {
        grid-column: 1 / -1;
      }
      .item-qty {
        justify-self: start;
      }
      .item-subtotal {
        justify-self: end;
        font-size: 1.05rem;
      }
    }

    @media (min-width: 768px) {
      .cart-item-card {
        grid-template-columns: 3fr 1fr 1fr 1fr;
      }
    }

    .item-main {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .item-img-link {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 1px solid var(--color-border);
      background: var(--brand-pearl-beige);
      flex-shrink: 0;
    }

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-cat {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--brand-warm-gold);
    }

    .item-title {
      font-family: var(--font-serif);
      font-size: 1.05rem;
      color: var(--brand-mocha-brown);
      margin: 2px 0;
    }

    .item-title a {
      color: var(--brand-mocha-brown);
      text-decoration: none;
    }

    .item-metal {
      display: block;
      font-size: 0.8rem;
      color: #777777;
      margin-bottom: 6px;
    }

    .btn-remove {
      background: transparent;
      border: none;
      color: var(--color-error);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }

    .item-price, .item-subtotal {
      font-weight: 700;
      font-size: 1rem;
      color: var(--brand-mocha-brown);
    }

    .qty-control {
      display: flex;
      align-items: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      width: fit-content;
      background: #FFFFFF;
    }

    .qty-btn {
      background: transparent;
      border: none;
      width: 32px;
      height: 36px;
      font-size: 1.1rem;
      cursor: pointer;
    }

    .qty-val {
      padding: 0 8px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .cart-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
    }

    .link-continue {
      color: var(--brand-warm-gold);
      font-weight: 700;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .btn-clear {
      background: transparent;
      border: 1px solid var(--color-border);
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      color: #666666;
      cursor: pointer;
    }

    /* Order Summary Card */
    .summary-card {
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 28px;
    }

    .summary-title {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.92rem;
      color: #555555;
      margin-bottom: 12px;
    }

    .free-tag {
      color: #2E7D32;
      font-weight: 700;
    }

    .summary-divider {
      height: 1px;
      background-color: var(--color-border);
      margin: 16px 0;
    }

    .total-row {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
    }

    .total-val {
      font-size: 1.3rem;
      color: var(--brand-mocha-brown);
    }

    .btn-checkout-link {
      display: block;
      margin-top: 24px;
      text-decoration: none;
    }

    .security-guarantee {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      font-size: 0.78rem;
      color: #666666;
      line-height: 1.4;
    }

    .security-guarantee svg {
      color: var(--brand-warm-gold);
      flex-shrink: 0;
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart!: CartSummary;
  private cartSub!: Subscription;

  private cartService = inject(CartService);

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(summary => {
      this.cart = summary;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  updateQty(item: any, qty: number): void {
    const targetId = (item?.product?.id !== undefined && item?.product?.id !== null) ? item.product.id : item?.product?.slug;
    this.cartService.updateQuantity(targetId, qty, item?.selectedMetal);
  }

  removeItem(item: any): void {
    const targetId = (item?.product?.id !== undefined && item?.product?.id !== null) ? item.product.id : item?.product?.slug;
    this.cartService.removeFromCart(targetId, item?.selectedMetal);
  }

  getDiscountPercentage(product: any): number {
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

  clearCart(): void {
    this.cartService.clearCart();
  }

  getItemImage(item: any): string {
    const img = item?.product?.image;
    const cat = item?.product?.category || item?.product?.name;
    return resolveProductImage(img, cat);
  }

  onImageError(event: Event, item: any): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = getFallbackProductImage(item?.product?.category || item?.product?.name);
    }
  }
}
