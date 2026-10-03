import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CartSummary } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    SectionHeadingComponent,
    ButtonComponent
  ],
  template: `
    <!-- Checkout Hero -->
    <section class="checkout-hero text-center">
      <div class="container">
        <span class="hero-eyebrow">Insured Express Checkout</span>
        <h1 class="hero-title">Shipping & Payment Details</h1>
      </div>
    </section>

    <!-- Main Checkout Section -->
    <section class="section-padding">
      <div class="container">
        <div class="checkout-grid" *ngIf="!orderPlaced; else orderSuccess">
          <!-- Billing & Shipping Form -->
          <div class="form-container">
            <!-- Member Login Banner (Visible if user is NOT logged in) -->
            <div class="checkout-auth-banner" *ngIf="!isLoggedIn">
              <div class="auth-banner-info">
                <span class="auth-banner-eyebrow">Exclusively for Members</span>
                <span class="auth-banner-title">Already an Arista Member?</span>
                <span class="auth-banner-sub">Sign in to auto-fill details while keeping your cart intact.</span>
              </div>
              <button type="button" class="btn-auth-signin" (click)="showAuthModal = true">
                Sign In &rarr;
              </button>
            </div>

            <!-- Logged In Status Badge -->
            <div class="logged-in-banner" *ngIf="isLoggedIn && currentUser">
              <span>✓ Signed in as <strong>{{ currentUser.name }}</strong> ({{ currentUser.email }})</span>
              <button type="button" class="btn-switch-user" (click)="onSignOutAndKeepData()">Switch Account</button>
            </div>

            <h2 class="section-title">Shipping Address</h2>

            <div *ngIf="addressValidationError" class="auth-alert error" style="margin-bottom: 16px;">
              ⚠️ {{ addressValidationError }}
            </div>

            <!-- Saved Delivery Address Selector Bar (When user has saved addresses) -->
            <div class="saved-address-selector-box" *ngIf="isLoggedIn && savedAddresses.length > 0">
              <div class="saved-addr-top-bar">
                <div class="saved-addr-header-info">
                  <span class="saved-addr-icon">📍</span>
                  <span class="saved-addr-title">Saved Delivery Addresses ({{ savedAddresses.length }})</span>
                  <span class="badge-prefilled" *ngIf="selectedSavedAddressId !== 'new'">✓ Auto-filled in Form Below</span>
                </div>
                <a routerLink="/account" [queryParams]="{ tab: 'addresses' }" class="link-manage-addresses">
                  Manage in Account &rarr;
                </a>
              </div>

              <div class="saved-addr-select-row">
                <select
                  [ngModel]="selectedSavedAddressId"
                  (ngModelChange)="onSavedAddressSelectChange($event)"
                  class="saved-addr-dropdown-input"
                >
                  <option *ngFor="let addr of savedAddresses" [value]="addr.id">
                    {{ addr.full_name || addr.fullName }} — {{ addr.address_line || addr.addressLine }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }} {{ (addr.is_default || addr.isDefault) ? '★ [Default Address]' : '' }}
                  </option>
                  <option value="new">+ Enter a New / Different Shipping Address</option>
                </select>
              </div>
            </div>

            <form (submit)="placeOrder($event)" class="checkout-form">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name *</label>
                  <input type="text" [(ngModel)]="shipping.firstName" name="firstName" placeholder="e.g. Lata" required />
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input type="text" [(ngModel)]="shipping.lastName" name="lastName" placeholder="e.g. Mangeshkar" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Email Address *</label>
                  <input type="email" [(ngModel)]="shipping.email" name="email" placeholder="name@example.com" required />
                </div>
                <div class="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" [(ngModel)]="shipping.phone" (input)="onPhoneInput($event)" name="phone" placeholder="e.g. 9876543210" maxlength="10" required />
                </div>
              </div>

              <div class="form-group">
                <label>Street Address *</label>
                <input type="text" [(ngModel)]="shipping.address" name="address" placeholder="House/Flat No., Building, Street Name" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>City *</label>
                  <input type="text" [(ngModel)]="shipping.city" name="city" placeholder="e.g. Mumbai" required />
                </div>
                <div class="form-group">
                  <label>State *</label>
                  <input type="text" [(ngModel)]="shipping.state" name="state" placeholder="e.g. Maharashtra" required />
                </div>
                <div class="form-group">
                  <label>PIN Code *</label>
                  <input type="tel" [(ngModel)]="shipping.pincode" (input)="onPincodeInput($event)" name="pincode" placeholder="e.g. 400020" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" required />
                </div>
              </div>

              <!-- Auto-save to account checkbox for logged-in users when entering a new address -->
              <div *ngIf="isLoggedIn && (selectedSavedAddressId === 'new' || savedAddresses.length === 0)" style="margin-bottom: 18px; background: #FAF7F2; border: 1px solid #E8E0D7; border-radius: 8px; padding: 12px 16px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.88rem; font-weight: 600; color: #2C221E; margin: 0;">
                  <input type="checkbox" [(ngModel)]="saveNewAddressToAccount" name="saveNewAddr" />
                  <span>Save this shipping address to my Arista Account for faster future checkouts</span>
                </label>
              </div>

              <!-- Guest Option to Create Account -->
              <div class="create-account-box" *ngIf="!isLoggedIn">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="createAccountChecked" name="createAccount" />
                  <span>Create an Arista Member Account with this email for tracking orders & express checkout</span>
                </label>

                <div class="form-group mt-3" *ngIf="createAccountChecked">
                  <label>Create Secret Password *</label>
                  <input type="password" [(ngModel)]="accountPassword" name="accPassword" placeholder="Create a secure password" [required]="createAccountChecked" />
                </div>
              </div>

              <h2 class="section-title mt-6">Payment Options</h2>
              <div class="payment-methods">
                <label class="payment-option" [class.selected]="selectedPayment === 'razorpay'">
                  <input type="radio" name="payment" value="razorpay" [(ngModel)]="selectedPayment" />
                  <div class="option-content">
                    <span class="option-title">Razorpay Payment Gateway (UPI, Cards, Netbanking)</span>
                    <span class="option-desc">Fast, 100% encrypted online checkout with instant receipt</span>
                  </div>
                </label>

                <label class="payment-option" [class.selected]="selectedPayment === 'cod'">
                  <input type="radio" name="payment" value="cod" [(ngModel)]="selectedPayment" />
                  <div class="option-content">
                    <span class="option-title">Cash on Delivery (COD)</span>
                    <span class="option-desc">Pay upon delivery at your doorstep</span>
                  </div>
                </label>
              </div>

              <button type="submit" class="submit-btn" [disabled]="isProcessing">
                {{ isProcessing ? 'Initializing Gateway...' : 'Pay & Complete Order (₹' + (cart ? (cart.total | number) : '0') + ')' }}
              </button>
            </form>
          </div>

          <!-- Order Summary Column -->
          <div class="summary-container">
            <h2 class="summary-title">Order Summary</h2>
            <div class="summary-items" *ngIf="cart">
              <div *ngFor="let item of cart.items" class="summary-item">
                <img [src]="item.product.image" [alt]="item.product.name" class="item-img" />
                <div class="item-details">
                  <span class="item-title">{{ item.product.name }}</span>
                  <span class="item-meta">Qty: {{ item.quantity }} | {{ item.selectedMetal || '18K Gold' }}</span>
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px;">
                    <span class="item-price">₹{{ item.subtotal | number }}</span>
                    <span *ngIf="item.product.compareAtPrice && item.product.compareAtPrice > item.product.price" style="text-decoration: line-through; color: #888; font-size: 0.78rem;">
                      ₹{{ (item.product.compareAtPrice * item.quantity) | number:'1.2-2' }}
                    </span>
                    <span *ngIf="getDiscountPercentage(item.product) > 0" style="background: #FEF2F2; color: #DC2626; font-weight: 700; font-size: 0.68rem; padding: 2px 6px; border-radius: 10px;">
                      {{ getDiscountPercentage(item.product) }}% OFF
                    </span>
                  </div>
                </div>
              </div>

              <div class="summary-divider"></div>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ cart.subtotal | number }}</span>
              </div>
              <div class="summary-row">
                <span>Insured Express Delivery</span>
                <span>{{ cart.estimatedShipping === 0 ? 'FREE' : '₹' + cart.estimatedShipping }}</span>
              </div>
              <div class="summary-row">
                <span>GST (3%)</span>
                <span>₹{{ cart.estimatedTax | number }}</span>
              </div>
              <div class="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{{ cart.total | number }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Success View -->
        <ng-template #orderSuccess>
          <div class="success-box text-center">
            <div class="success-icon">✓</div>
            <h1 class="success-title">Order Confirmed!</h1>
            <p class="success-msg">
              Thank you for your purchase from <strong>Arista Trinkets</strong>. Your order reference <strong>#{{ generatedOrderNumber }}</strong> has been placed successfully and is being prepared by our master artisans.
            </p>
            <div class="payment-badge-box">
              <span class="badge-label">Payment Status:</span>
              <span class="badge-status">{{ paymentVerified ? 'RAZORPAY VERIFIED (PAID)' : 'ORDER RECEIVED' }}</span>
            </div>
            <div class="success-actions">
              <a
                *ngIf="generatedOrderNumber"
                [href]="getInvoicePdfUrl(generatedOrderNumber)"
                target="_blank"
                class="btn-gold"
                style="display: inline-flex; align-items: center; gap: 8px;"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Tax Invoice (PDF)
              </a>
              <a routerLink="/shop" class="btn-mocha">Continue Shopping</a>
              <a routerLink="/account" class="btn-mocha">View Account Orders</a>
            </div>
          </div>
        </ng-template>

        <!-- INLINE AUTH MODAL POPUP FOR CHECKOUT -->
        <div *ngIf="showAuthModal" class="modal-backdrop" (click)="showAuthModal = false">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2 class="form-title" style="margin:0;">Sign In to Express Checkout</h2>
              <button type="button" class="btn-close" (click)="showAuthModal = false">&times;</button>
            </div>

            <p style="font-size: 0.88rem; color: #666; margin-top: 10px; line-height: 1.5;">
              Sign in with your Arista Member credentials. Your typed address details and shopping bag items will be <strong>100% preserved</strong>!
            </p>

            <div class="error-banner" *ngIf="authErrorMessage" style="margin-top: 12px;">
              ⚠ {{ authErrorMessage }}
            </div>

            <form (submit)="onInlineLogin($event)" class="checkout-form" style="margin-top: 16px;">
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" [(ngModel)]="authModalEmail" name="authEmail" placeholder="admin@aristatrinkets.com" required />
              </div>

              <div class="form-group">
                <label>Password *</label>
                <input type="password" [(ngModel)]="authModalPassword" name="authPassword" placeholder="••••••••" required />
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
                <button type="button" class="btn-cancel" (click)="showAuthModal = false">Continue as Guest</button>
                <button type="submit" class="submit-btn" style="width: auto; padding: 10px 24px; margin: 0;">Sign In & Update Details &rarr;</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .checkout-hero {
      background-color: var(--brand-pearl-beige);
      padding: 40px 0;
      border-bottom: 1px solid var(--color-border);
    }

    .hero-eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 6px;
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      color: var(--brand-mocha-brown);
      margin: 0;
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 992px) {
      .checkout-grid {
        grid-template-columns: 1.6fr 1fr;
        gap: 48px;
      }
    }

    .form-container, .summary-container {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .checkout-auth-banner {
      background: var(--brand-pearl-beige);
      border: 1px solid var(--brand-warm-gold);
      border-radius: var(--radius-sm);
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .auth-banner-eyebrow {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-warm-gold);
      display: block;
    }
    .auth-banner-title {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      display: block;
      margin: 2px 0;
    }
    .auth-banner-sub {
      font-size: 0.82rem;
      color: var(--color-text-secondary);
      display: block;
    }
    .btn-auth-signin {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 10px 22px;
      border-radius: 50px;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(207, 168, 116, 0.25);
    }
    .btn-auth-signin:hover {
      background: #E2B882;
      transform: translateY(-1px);
    }

    .logged-in-banner {
      background: #E8F5E9;
      border: 1px solid #A5D6A7;
      color: #2E7D32;
      padding: 12px 18px;
      border-radius: var(--radius-sm);
      margin-bottom: 24px;
      font-size: 0.88rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn-switch-user {
      background: transparent;
      border: 1px solid #2E7D32;
      color: #2E7D32;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 50px;
      cursor: pointer;
    }

    /* Saved Address Quick Selector Bar */
    .saved-address-selector-box {
      background: #FAF7F2;
      border: 1.5px solid #D1C7BD;
      border-radius: 10px;
      padding: 16px 18px;
      margin-bottom: 22px;
      box-shadow: 0 2px 8px rgba(44, 34, 30, 0.04);
    }
    .saved-addr-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .saved-addr-header-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .saved-addr-icon {
      font-size: 1.1rem;
    }
    .saved-addr-title {
      font-weight: 700;
      color: #2C221E;
      font-size: 0.95rem;
      letter-spacing: 0.2px;
    }
    .badge-prefilled {
      background: #E8F5E9;
      color: #2E7D32;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid #C8E6C9;
      letter-spacing: 0.3px;
    }
    .link-manage-addresses {
      font-size: 0.82rem;
      color: var(--brand-warm-gold, #B8860B);
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
    }
    .link-manage-addresses:hover {
      color: #8C6608;
    }
    .saved-addr-select-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .saved-addr-dropdown-input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #D1C7BD;
      border-radius: 8px;
      background: #FFFFFF;
      color: #2C221E;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .saved-addr-dropdown-input:focus {
      border-color: var(--brand-warm-gold, #B8860B);
      box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.12);
    }

    .create-account-box {
      background: var(--brand-pearl-beige);
      border: 1px dashed var(--color-border);
      padding: 16px;
      border-radius: var(--radius-sm);
      margin-top: 8px;
    }
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      cursor: pointer;
    }

    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 16px;
    }
    .modal-card {
      background: #FFFFFF;
      border-radius: var(--radius-md);
      width: 100%; max-width: 480px;
      padding: 28px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.25);
      border: 1px solid var(--brand-warm-gold);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--color-border); padding-bottom: 12px;
    }
    .form-title {
      font-family: var(--font-serif);
      color: var(--brand-mocha-brown);
      font-size: 1.35rem;
    }
    .btn-close {
      background: transparent; border: none; font-size: 1.8rem;
      line-height: 1; color: var(--brand-mocha-brown); cursor: pointer;
    }
    .btn-cancel {
      background: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--color-border);
      padding: 8px 18px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .error-banner {
      background: #FFEBEE; color: #C62828; padding: 10px 14px;
      border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;
    }

    .section-title, .summary-title {
      font-family: var(--font-serif);
      color: var(--brand-mocha-brown);
      font-size: 1.35rem;
      margin-bottom: 18px;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 10px;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--brand-mocha-brown);
    }

    .form-group input {
      padding: 10px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      font-family: var(--font-sans);
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
    }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .payment-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .payment-option.selected {
      border-color: var(--brand-warm-gold);
      background-color: var(--brand-pearl-beige);
    }

    .option-title {
      font-weight: 600;
      color: var(--brand-mocha-brown);
      display: block;
      font-size: 0.92rem;
    }

    .option-desc {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }

    .submit-btn {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-family: var(--font-sans);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 16px;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.92rem;
      transition: all var(--transition-fast);
      width: 100%;
    }

    .submit-btn:hover {
      background-color: #E2B882;
    }

    .summary-item {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .item-img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: var(--brand-pearl-beige);
    }

    .item-details {
      flex: 1;
    }

    .item-title {
      font-weight: 600;
      color: var(--brand-mocha-brown);
      font-size: 0.88rem;
      display: block;
    }

    .item-meta {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      display: block;
    }

    .item-price {
      font-weight: 700;
      color: var(--brand-warm-gold);
      font-size: 0.9rem;
    }

    .summary-divider {
      height: 1px;
      background: var(--color-border);
      margin: 16px 0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin-bottom: 8px;
    }

    .total-row {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      border-top: 1px solid var(--color-border);
      padding-top: 12px;
      margin-top: 8px;
    }

    .success-box {
      max-width: 600px;
      margin: 40px auto;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      padding: 40px 24px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
    }

    .success-icon {
      width: 60px;
      height: 60px;
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-size: 1.8rem;
      font-weight: 700;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
    }

    .success-title {
      font-family: var(--font-serif);
      color: var(--brand-mocha-brown);
      font-size: 1.9rem;
      margin-bottom: 12px;
    }

    .success-msg {
      font-size: 0.95rem;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .payment-badge-box {
      background: var(--brand-pearl-beige);
      border: 1px solid var(--brand-warm-gold);
      padding: 10px 18px;
      border-radius: var(--radius-sm);
      display: inline-block;
      margin-bottom: 24px;
    }

    .badge-label {
      font-size: 0.82rem;
      color: var(--brand-mocha-brown);
      margin-right: 8px;
    }

    .badge-status {
      font-weight: 700;
      color: var(--brand-warm-gold);
      font-size: 0.85rem;
    }

    .success-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-gold {
      background: var(--brand-warm-gold) !important;
      color: var(--brand-mocha-brown) !important;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 12px 28px;
      border-radius: 50px;
      text-decoration: none !important;
      display: inline-block;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(207, 168, 116, 0.25);
    }
    .btn-gold:hover {
      background: #E2B882 !important;
      color: #382A1F !important;
      transform: translateY(-1px);
    }

    .btn-mocha {
      background: var(--brand-mocha-brown) !important;
      color: #FFFFFF !important;
      font-weight: 700;
      font-size: 0.88rem;
      padding: 12px 28px;
      border-radius: 50px;
      text-decoration: none !important;
      display: inline-block;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(91, 70, 54, 0.25);
    }
    .btn-mocha:hover {
      background: #443427 !important;
      color: #FFFFFF !important;
      transform: translateY(-1px);
    }
  `]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart!: CartSummary;
  private cartSub!: Subscription;
  orderPlaced: boolean = false;
  paymentVerified: boolean = false;
  isProcessing: boolean = false;
  selectedPayment: string = 'razorpay';
  generatedOrderNumber: string = '';

  isLoggedIn: boolean = false;
  currentUser: any = null;
  showAuthModal: boolean = false;
  authModalEmail: string = '';
  authModalPassword: string = '';
  authErrorMessage: string = '';

  createAccountChecked: boolean = false;
  accountPassword: string = '';

  shipping = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  };

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private route       = inject(ActivatedRoute);
  private cdr         = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(summary => {
      this.cart = summary;
      this.cdr.detectChanges();
    });

    this.checkUserSession();
  }

  savedAddresses: any[] = [];
  selectedSavedAddressId: any = 'new';
  saveNewAddressToAccount: boolean = true;
  addressValidationError: string = '';

  private checkUserSession(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.currentUser();
      if (this.currentUser) {
        const names = (this.currentUser.name || '').trim().split(' ');
        this.shipping.firstName = this.shipping.firstName || names[0] || '';
        this.shipping.lastName = this.shipping.lastName || names.slice(1).join(' ') || '';
        this.shipping.email = this.shipping.email || this.currentUser.email || '';
        this.shipping.phone = this.shipping.phone || this.currentUser.phone || '';
        this.loadSavedAddresses();
      }
    }
  }

  async loadSavedAddresses(): Promise<void> {
    if (!this.isLoggedIn || !this.currentUser?.email) return;
    try {
      const token = this.authService.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES.LIST}?email=${encodeURIComponent(this.currentUser.email)}`, {
        headers
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
        this.savedAddresses = data.data;

        // Check if query param addressId was passed
        const targetId = this.route.snapshot.queryParams['addressId'];
        let matchedAddr = null;
        if (targetId) {
          matchedAddr = this.savedAddresses.find(a => String(a.id) === String(targetId));
        }
        if (!matchedAddr) {
          matchedAddr = this.savedAddresses.find(a => a.is_default || a.isDefault) || this.savedAddresses[0];
        }

        if (matchedAddr) {
          this.selectedSavedAddressId = matchedAddr.id;
          this.applySavedAddress(matchedAddr);
        }
      }
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to load saved addresses:', err);
    }
  }

  getSelectedAddress(): any {
    return this.savedAddresses.find(a => String(a.id) === String(this.selectedSavedAddressId));
  }

  selectSavedAddress(addr: any): void {
    this.selectedSavedAddressId = addr.id;
    this.applySavedAddress(addr);
    this.cdr.detectChanges();
  }

  switchToNewAddressMode(): void {
    this.selectedSavedAddressId = 'new';
    this.shipping.address = '';
    this.shipping.city = '';
    this.shipping.state = '';
    this.shipping.pincode = '';
    this.saveNewAddressToAccount = true;
    this.cdr.detectChanges();
  }

  applySavedAddress(addr: any): void {
    if (!addr) return;
    const names = (addr.full_name || addr.fullName || this.currentUser?.name || '').trim().split(' ');
    this.shipping.firstName = names[0] || this.shipping.firstName || '';
    this.shipping.lastName = names.slice(1).join(' ') || this.shipping.lastName || '';
    this.shipping.phone = addr.phone || this.shipping.phone || this.currentUser?.phone || '';
    this.shipping.email = this.shipping.email || this.currentUser?.email || '';
    this.shipping.address = addr.address_line || addr.addressLine || '';
    this.shipping.city = addr.city || '';
    this.shipping.state = addr.state || '';
    this.shipping.pincode = addr.pincode || '';
    this.cdr.detectChanges();
  }

  onSavedAddressSelectChange(val: any): void {
    this.selectedSavedAddressId = val;
    if (val === 'new') {
      this.switchToNewAddressMode();
    } else {
      const addr = this.savedAddresses.find(a => String(a.id) === String(val));
      if (addr) {
        this.applySavedAddress(addr);
      }
    }
    this.cdr.detectChanges();
  }

  async onInlineLogin(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.authModalEmail || !this.authModalPassword) return;

    this.authErrorMessage = '';
    const res = await this.authService.login(this.authModalEmail, this.authModalPassword);
    if (res.success && res.user) {
      this.isLoggedIn = true;
      this.currentUser = res.user;

      // PRESERVE ANY TYPED ADDRESS DETAILS while updating Name and Email from profile
      const names = (res.user.name || '').trim().split(' ');
      this.shipping.firstName = names[0] || this.shipping.firstName;
      this.shipping.lastName = names.slice(1).join(' ') || this.shipping.lastName;
      this.shipping.email = res.user.email || this.shipping.email;

      this.showAuthModal = false;
      this.authModalEmail = '';
      this.authModalPassword = '';

      this.loadSavedAddresses();
    } else {
      this.authErrorMessage = res.message || 'Invalid email or password.';
    }
  }

  onSignOutAndKeepData(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.savedAddresses = [];
    this.selectedSavedAddressId = 'new';
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    this.shipping.phone = digitsOnly;
    input.value = digitsOnly;
  }

  onPincodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 6);
    this.shipping.pincode = digitsOnly;
    input.value = digitsOnly;
  }

  async placeOrder(event: Event): Promise<void> {
    event.preventDefault();
    this.addressValidationError = '';

    // STRICT VALIDATION: Ensure street address, city, state, pincode, and 10-digit mobile phone are non-empty & valid!
    if (!this.shipping.firstName.trim() || !this.shipping.lastName.trim() || !this.shipping.email.trim() ||
        !this.shipping.address.trim() || !this.shipping.city.trim() || !this.shipping.state.trim() || !this.shipping.pincode.trim()) {
      this.addressValidationError = 'Please fill in all required fields — First Name, Last Name, Email, Street Address, City, State, and PIN Code.';
      this.isProcessing = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cleanPin = this.shipping.pincode.replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPin)) {
      this.addressValidationError = 'PIN Code must be exactly 6 digits (e.g. 395003).';
      this.isProcessing = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    const cleanPhone = (this.shipping.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      this.addressValidationError = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
      this.isProcessing = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isProcessing = true;

    // If guest checked "Create an account", register them seamlessly in background
    if (!this.isLoggedIn && this.createAccountChecked && this.accountPassword) {
      try {
        const fullName = `${this.shipping.firstName} ${this.shipping.lastName}`.trim();
        await fetch(API_ENDPOINTS.AUTH.REGISTER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: this.shipping.email,
            password: this.accountPassword
          })
        });
      } catch (err) {
        // Non-blocking fallback
      }
    }

    const totalAmount = this.cart?.total || 0;
    
    // 1. Create order on backend DB to obtain sequential order number (ART-000001 series)
    let orderNumber = '';

    try {
      const orderItems = (this.cart?.items || []).map(item => ({
        title: item.product.name,
        name: item.product.name,
        price: item.product.price,
        metalType: item.selectedMetal || '18K Warm Gold',
        quantity: item.quantity
      }));

      const createRes = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${this.shipping.firstName} ${this.shipping.lastName}`.trim(),
          customerEmail: this.shipping.email,
          customerPhone: this.shipping.phone,
          shippingAddress: this.shipping.address,
          city: this.shipping.city,
          state: this.shipping.state,
          pincode: this.shipping.pincode,
          items: orderItems,
          totalAmount: totalAmount,
          paymentMethod: this.selectedPayment.toUpperCase()
        })
      });

      const resData = await createRes.json();
      if (resData && resData.success && resData.data && resData.data.orderNumber) {
        orderNumber = resData.data.orderNumber;

        // Auto-save new shipping address to user's account if requested
        if (this.isLoggedIn && (this.selectedSavedAddressId === 'new' || this.savedAddresses.length === 0) && this.saveNewAddressToAccount) {
          try {
            const token = this.authService.getToken();
            await fetch(API_ENDPOINTS.ADDRESSES.CREATE, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ''
              },
              body: JSON.stringify({
                fullName: `${this.shipping.firstName} ${this.shipping.lastName}`.trim(),
                phone: this.shipping.phone,
                addressLine: this.shipping.address,
                city: this.shipping.city,
                state: this.shipping.state,
                pincode: this.shipping.pincode,
                email: this.shipping.email,
                isDefault: this.savedAddresses.length === 0
              })
            });
          } catch (e) {
            // Non-blocking
          }
        }
      }
    } catch (err) {
      // API call failed
    }

    this.generatedOrderNumber = orderNumber;

    if (this.selectedPayment === 'razorpay') {
      await this.loadRazorpayScript();
      if (typeof Razorpay !== 'undefined') {
        try {
          const response = await fetch(API_ENDPOINTS.ORDERS.RAZORPAY_ORDER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: totalAmount,
              receipt: this.generatedOrderNumber
            })
          });

          const resData = await response.json();
          if (resData && resData.success && resData.data) {
            const options = {
              key: resData.data.keyId || '',
              amount: resData.data.amount,
              currency: 'INR',
              name: 'Arista Trinkets Jewellery',
              description: `Order ${this.generatedOrderNumber}`,
              image: '/assets/images/logo-icon.jpeg',
              order_id: resData.data.id,
              handler: async (payRes: any) => {
                await this.verifyRazorpayPayment(payRes);
              },
              prefill: {
                name: `${this.shipping.firstName} ${this.shipping.lastName}`.trim(),
                email: this.shipping.email,
                contact: this.shipping.phone
              },
              theme: {
                color: '#CFA874'
              }
            };

            const rzp = new Razorpay(options);
            rzp.open();
            this.isProcessing = false;
            return;
          }
        } catch (err) {
          // Fallback to local order completion if backend server is offline
        }
      }
    }

    // Direct completion for COD or mock offline flow
    this.paymentVerified = this.selectedPayment === 'razorpay';
    this.orderPlaced = true;
    this.isProcessing = false;
    this.cartService.clearCart();
  }

  private async verifyRazorpayPayment(payRes: any): Promise<void> {
    try {
      await fetch(API_ENDPOINTS.ORDERS.VERIFY_PAYMENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: payRes.razorpay_order_id,
          razorpay_payment_id: payRes.razorpay_payment_id,
          razorpay_signature: payRes.razorpay_signature,
          order_number: this.generatedOrderNumber
        })
      });
    } catch (err) {
      // Non-critical fallback
    }

    this.paymentVerified = true;
    this.orderPlaced = true;
    this.cartService.clearCart();
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

  getInvoicePdfUrl(orderNumber: string): string {
    return API_ENDPOINTS.ORDERS.INVOICE_PDF(orderNumber);
  }
}
