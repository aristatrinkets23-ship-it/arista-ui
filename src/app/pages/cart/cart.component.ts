import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CartSummary } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
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

    <!-- ─── Auth Modal Popup ──────────────────────────────────────────────── -->
    <div *ngIf="showAuthBanner()" class="auth-modal-backdrop" (click)="onBackdropClick($event)">
      <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">

        <!-- Close Button -->
        <button type="button" class="auth-modal-close" (click)="showAuthBanner.set(false)" aria-label="Close dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Icon -->
        <div class="auth-modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>

        <!-- Content -->
        <h2 id="authModalTitle" class="auth-modal-title">Sign In to Continue</h2>
        <p class="auth-modal-desc">
          Please sign in or create an account to securely proceed to checkout.
        </p>

        <!-- Actions -->
        <div class="auth-modal-actions">
          <a
            [routerLink]="['/account']"
            [queryParams]="{ redirect: 'checkout' }"
            class="auth-modal-btn-primary"
            (click)="showAuthBanner.set(false)"
          >
            Sign In to Continue &rarr;
          </a>
          <button
            type="button"
            class="auth-modal-btn-secondary"
            (click)="proceedAsGuest()"
          >
            Maybe Later
          </button>
        </div>

        <!-- Divider hint -->
        <p class="auth-modal-hint">New here? <a [routerLink]="['/account']" [queryParams]="{ redirect: 'checkout', tab: 'register' }" (click)="showAuthBanner.set(false)">Create an account</a></p>
      </div>
    </div>

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
                  <button type="button" class="btn-remove" (click)="promptRemoveItem(item)">
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
              <button type="button" class="btn-clear" (click)="openClearCartModal()">Clear Bag</button>
            </div>
          </div>

          <!-- Order Summary Column -->
          <div class="summary-column">
            <div class="summary-card">
              <h3 class="summary-title">Order Summary</h3>

              <!-- Free Delivery Dynamic Tracker -->
              <div class="free-delivery-tracker" *ngIf="cart && cart.freeDeliveryThreshold">
                <div class="delivery-status-msg" *ngIf="!cart.isFreeDeliveryUnlocked">
                  <span>🚚 Add <strong>₹{{ (cart.remainingForFreeDelivery || 0) | number:'1.0-0' }}</strong> more to get <strong>FREE delivery</strong>!</span>
                </div>
                <div class="delivery-status-msg unlocked" *ngIf="cart.isFreeDeliveryUnlocked">
                  <span>🎉 <strong>Congratulations!</strong> You’ve unlocked <strong>FREE delivery</strong>!</span>
                </div>
                <div class="delivery-progress-bar">
                  <div
                    class="delivery-progress-fill"
                    [style.width.%]="getProgressPercent()"
                  ></div>
                </div>
              </div>

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
                <span class="total-label">Total Amount</span>
                <span class="total-val">₹{{ cart.total | number:'1.2-2' }}</span>
              </div>

              <!-- Proceed to Checkout Button -->
              <button
                type="button"
                class="btn-checkout"
                (click)="proceedToCheckout()"
              >
                PROCEED TO CHECKOUT &rarr;
              </button>

              <div class="security-guarantee">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#CFA874" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Insured Delivery &amp; 100% Authentic Jewellery Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clear Bag Confirmation Modal Popup -->
    <div *ngIf="showClearCartModal()" class="auth-modal-backdrop" (click)="onConfirmBackdropClick($event, 'clear')">
      <div class="auth-modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="clearModalTitle">
        <button type="button" class="auth-modal-close" (click)="showClearCartModal.set(false)" aria-label="Close dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="confirm-modal-icon danger">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>

        <h2 id="clearModalTitle" class="auth-modal-title">Clear Shopping Bag?</h2>
        <p class="auth-modal-desc">
          Are you sure you want to remove all <strong>{{ cart.itemCount }} item{{ cart.itemCount > 1 ? 's' : '' }}</strong> from your shopping bag? This action cannot be undone.
        </p>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-confirm-cancel" (click)="showClearCartModal.set(false)">
            Keep Items
          </button>
          <button type="button" class="btn-confirm-danger" (click)="confirmClearCart()">
            Yes, Clear Bag
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Single Item Confirmation Modal Popup -->
    <div *ngIf="itemToRemove()" class="auth-modal-backdrop" (click)="onConfirmBackdropClick($event, 'remove')">
      <div class="auth-modal confirm-modal" role="dialog" aria-modal="true" aria-labelledby="removeModalTitle">
        <button type="button" class="auth-modal-close" (click)="itemToRemove.set(null)" aria-label="Close dialog">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="confirm-modal-icon warning">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 id="removeModalTitle" class="auth-modal-title">Remove Item?</h2>
        <p class="auth-modal-desc">
          Are you sure you want to remove <strong>{{ itemToRemove()?.product?.name }}</strong> from your bag?
        </p>

        <div class="confirm-modal-actions">
          <button type="button" class="btn-confirm-cancel" (click)="itemToRemove.set(null)">
            Cancel
          </button>
          <button type="button" class="btn-confirm-danger" (click)="confirmRemoveItem()">
            Remove Item
          </button>
        </div>
      </div>
    </div>
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
      background-color: #faf8f4;
      border: 1px solid #e8e0d4;
      border-radius: 12px;
      padding: 24px 24px 20px;
      position: sticky;
      top: 24px;
    }

    .summary-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--brand-mocha-brown, #5B4636);
      margin: 0 0 18px;
      padding-bottom: 14px;
      border-bottom: 2px solid #e8e0d4;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      color: #666;
      margin-bottom: 10px;
    }

    .summary-label {
      color: #666;
    }

    .summary-value {
      color: var(--brand-mocha-brown, #5B4636);
      font-weight: 500;
    }

    .free-tag {
      color: #2E7D32;
      font-weight: 700;
      font-size: 0.82rem;
    }

    .free-delivery-tracker {
      background: var(--brand-pearl-beige, #FAF7F2);
      border: 1px solid #EAE3DC;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 16px;
    }
    .delivery-status-msg {
      font-size: 0.85rem;
      color: var(--brand-mocha-brown, #5B4636);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .delivery-status-msg.unlocked {
      color: #2E7D32;
      font-weight: 600;
    }
    .delivery-progress-bar {
      width: 100%;
      height: 6px;
      background: #E8E0D5;
      border-radius: 10px;
      overflow: hidden;
    }
    .delivery-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--brand-warm-gold, #CFA874), #B8860B);
      border-radius: 10px;
      transition: width 0.3s ease;
    }

    .summary-divider {
      height: 1px;
      background-color: #e8e0d4;
      margin: 14px 0;
    }

    .total-row {
      align-items: baseline;
    }

    .total-label {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--brand-mocha-brown, #5B4636);
    }

    .total-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--brand-mocha-brown, #5B4636);
      letter-spacing: -0.5px;
    }

    /* Checkout CTA Button */
    .btn-checkout {
      display: block;
      width: 100%;
      margin-top: 18px;
      padding: 14px 16px;
      background: linear-gradient(135deg, #CFA874 0%, #B8935A 100%);
      color: #fff;
      font-family: var(--font-sans, sans-serif);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(207, 168, 116, 0.32);
    }

    .btn-checkout:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    /* Security Guarantee */
    .security-guarantee {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 14px;
      font-size: 0.76rem;
      color: #888;
      line-height: 1.45;
    }

    .security-guarantee span {
      flex: 1;
    }

    /* ── Auth Modal Popup ────────────────────────────────────────────────── */
    :host {
      display: block;
    }

    .auth-modal-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 999999 !important;
      background: rgba(26, 18, 11, 0.65) !important;
      backdrop-filter: blur(4px) !important;
      -webkit-backdrop-filter: blur(4px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
      box-sizing: border-box !important;
      margin: 0 !important;
      animation: backdropFadeIn 0.22s ease;
    }

    @keyframes backdropFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .auth-modal {
      background: #fffdf9;
      border-radius: 16px;
      padding: 40px 36px 32px;
      width: 100%;
      max-width: 420px;
      position: relative;
      margin: auto !important;
      box-shadow:
        0 32px 64px rgba(26, 18, 11, 0.22),
        0 8px 24px rgba(26, 18, 11, 0.12);
      text-align: center;
      animation: modalPopIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalPopIn {
      from { opacity: 0; transform: scale(0.88) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .auth-modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #f5f0eb;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #888;
      transition: background 0.2s, color 0.2s;
    }

    .auth-modal-close:hover {
      background: #ede5da;
      color: #333;
    }

    .auth-modal-icon {
      width: 68px;
      height: 68px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #CFA874 0%, #B8935A 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 6px 20px rgba(207, 168, 116, 0.35);
    }

    .auth-modal-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--brand-mocha-brown, #5B4636);
      margin: 0 0 10px;
      letter-spacing: -0.2px;
    }

    .auth-modal-desc {
      font-size: 0.9rem;
      color: #6A5544;
      margin: 0 0 28px;
      line-height: 1.6;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
    }

    .auth-modal-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .auth-modal-btn-primary {
      display: block;
      width: 100%;
      background: linear-gradient(135deg, #CFA874 0%, #B8935A 100%);
      color: #fff;
      font-size: 0.92rem;
      font-weight: 700;
      padding: 14px 20px;
      border-radius: 8px;
      text-decoration: none;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(207, 168, 116, 0.35);
    }

    .auth-modal-btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .auth-modal-btn-secondary {
      display: block;
      width: 100%;
      background: transparent;
      border: 1.5px solid #CFA874;
      color: var(--brand-mocha-brown, #5B4636);
      font-size: 0.88rem;
      font-weight: 600;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }

    .auth-modal-btn-secondary:hover {
      background: #CFA874;
      color: #fff;
    }

    .auth-modal-hint {
      margin: 20px 0 0;
      font-size: 0.8rem;
      color: #999;
    }

    .auth-modal-hint a {
      color: #B8935A;
      font-weight: 600;
      text-decoration: none;
    }

    .auth-modal-hint a:hover { text-decoration: underline; }

    /* Checkout button — block button */
    .btn-checkout-link {
      display: block;
      width: 100%;
      margin-top: 24px;
    }

    /* Confirm Modal Customizations */
    .confirm-modal-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .confirm-modal-icon.danger {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FCA5A5;
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.15);
    }
    .confirm-modal-icon.warning {
      background: #FFFBEB;
      color: #D97706;
      border: 1px solid #FCD34D;
      box-shadow: 0 6px 16px rgba(217, 119, 6, 0.15);
    }
    .confirm-modal-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;
    }
    .btn-confirm-cancel {
      flex: 1;
      background: #F5EFE8;
      border: 1px solid #D8C8B8;
      color: var(--brand-mocha-brown, #5B4636);
      font-size: 0.88rem;
      font-weight: 700;
      padding: 12px 20px;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-confirm-cancel:hover {
      background: #EBE1D5;
      border-color: #C8B8A8;
    }
    .btn-confirm-danger {
      flex: 1;
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
      border: none;
      color: #FFFFFF;
      font-size: 0.88rem;
      font-weight: 700;
      padding: 12px 20px;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.32);
    }
    .btn-confirm-danger:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  `]
})
export class CartComponent implements OnInit, OnDestroy {
  cart!: CartSummary;
  private cartSub!: Subscription;

  /** Controls visibility of the sign-in required banner */
  showAuthBanner = signal(false);

  /** Controls visibility of Clear Cart modal */
  showClearCartModal = signal(false);

  /** Holds target item for remove confirmation */
  itemToRemove = signal<any>(null);

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private cdr         = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(summary => {
      this.cart = summary;
      this.cdr.detectChanges();
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

  promptRemoveItem(item: any): void {
    this.itemToRemove.set(item);
  }

  confirmRemoveItem(): void {
    const item = this.itemToRemove();
    if (item) {
      this.removeItem(item);
      this.itemToRemove.set(null);
    }
  }

  removeItem(item: any): void {
    const targetId = (item?.product?.id !== undefined && item?.product?.id !== null) ? item.product.id : item?.product?.slug;
    this.cartService.removeFromCart(targetId, item?.selectedMetal);
  }

  openClearCartModal(): void {
    this.showClearCartModal.set(true);
  }

  confirmClearCart(): void {
    this.cartService.clearCart();
    this.showClearCartModal.set(false);
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

  proceedToCheckout(): void {
    if (this.authService.isAuthenticated()) {
      this.showAuthBanner.set(false);
      this.router.navigate(['/checkout']);
    } else {
      this.showAuthBanner.set(true);
    }
  }

  proceedAsGuest(): void {
    this.showAuthBanner.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('auth-modal-backdrop')) {
      this.showAuthBanner.set(false);
    }
  }

  onConfirmBackdropClick(event: MouseEvent, target: 'clear' | 'remove'): void {
    if ((event.target as HTMLElement).classList.contains('auth-modal-backdrop')) {
      if (target === 'clear') {
        this.showClearCartModal.set(false);
      } else {
        this.itemToRemove.set(null);
      }
    }
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

  getProgressPercent(): number {
    if (!this.cart?.freeDeliveryThreshold) return 0;
    const pct = (this.cart.subtotal / this.cart.freeDeliveryThreshold) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  }
}
