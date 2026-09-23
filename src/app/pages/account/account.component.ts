import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Account Page Hero -->
    <section class="account-hero text-center">
      <div class="container">
        <span class="hero-eyebrow">The Arista Club</span>
        <h1 class="hero-title">Customer Account & Concierge</h1>
      </div>
    </section>

    <!-- Main Account Section -->
    <section class="section-padding">
      <div class="container">
        <!-- Auth Tabs (Sign In / Register / My Account) -->
        <div class="account-tabs">
          <button
            *ngIf="activeTab !== 'dashboard'"
            type="button"
            [class.active]="activeTab === 'login'"
            (click)="activeTab = 'login'"
            class="account-tab-btn"
          >
            Sign In
          </button>
          <button
            *ngIf="activeTab !== 'dashboard'"
            type="button"
            [class.active]="activeTab === 'register'"
            (click)="activeTab = 'register'"
            class="account-tab-btn"
          >
            Create Account
          </button>
          <button
            *ngIf="activeTab === 'dashboard'"
            type="button"
            class="account-tab-btn active"
          >
            My Account Dashboard
          </button>
        </div>

        <!-- Sign In Form -->
        <div *ngIf="activeTab === 'login'" class="auth-card">
          <h2 class="auth-card-title">Welcome Back to Arista</h2>
          <p class="auth-card-desc">Sign in to access your saved wishlist, order history, and private invitations.</p>
          <form (submit)="onLoginSubmit($event)" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" [(ngModel)]="loginEmail" name="email" placeholder="name&#64;example.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" [(ngModel)]="loginPassword" name="password" placeholder="••••••••" required class="form-input" />
            </div>
            <div class="auth-submit-wrap">
              <app-button type="submit" variant="primary" size="sm" [rounded]="true">Sign In &rarr;</app-button>
            </div>
            <div style="text-align: center; margin-top: 16px;">
              <a routerLink="/admin/login" style="font-size: 0.82rem; color: var(--brand-warm-gold); font-weight: 600; text-decoration: underline;">
                Are you a Store Administrator? Sign in to Admin Console &rarr;
              </a>
            </div>
          </form>
        </div>

        <!-- Register Form -->
        <div *ngIf="activeTab === 'register'" class="auth-card">
          <h2 class="auth-card-title">Join The Arista Club</h2>
          <p class="auth-card-desc">Create your private member account for priority access to new collection releases.</p>
          <form (submit)="onRegisterSubmit($event)" class="auth-form">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" [(ngModel)]="regName" name="name" placeholder="e.g. Lady Catherine" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" [(ngModel)]="regEmail" name="email" placeholder="name&#64;example.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" [(ngModel)]="regPassword" name="password" placeholder="Create a secure password" required class="form-input" />
            </div>
            <div class="auth-submit-wrap">
              <app-button type="submit" variant="primary" size="sm" [rounded]="true">Create Account &rarr;</app-button>
            </div>
          </form>
        </div>

        <!-- Account Dashboard Shell -->
        <div *ngIf="activeTab === 'dashboard'" class="dashboard-shell">
          <div class="dash-welcome">
            <div class="dash-welcome-header">
              <div>
                <h3 style="margin: 0 0 6px 0;">Welcome, {{ currentUser?.name || 'Valued Collector' }}</h3>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">Customer Account & Order History Portal<span *ngIf="currentUser?.email"> ({{ currentUser.email }})</span></p>
              </div>
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <a
                  *ngIf="currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'"
                  routerLink="/admin"
                  class="btn-admin-link"
                  style="background: var(--brand-warm-gold); color: var(--brand-mocha-brown); text-decoration: none; font-weight: 700; font-size: 0.85rem; padding: 10px 20px; border-radius: 50px; display: inline-block;"
                >
                  Go to Admin Console &rarr;
                </a>
                <button type="button" class="btn-dash-logout" (click)="openLogoutModal()">
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div class="dash-grid">
            <div class="dash-card">
              <h4>Recent Orders</h4>
              <p class="dash-empty">No active orders placed yet.</p>
            </div>
            <div class="dash-card">
              <h4>Saved Addresses</h4>
              <p class="dash-empty">No shipping addresses saved.</p>
            </div>
            <div class="dash-card">
              <h4>Atelier Concierge</h4>
              <p class="dash-empty">Dedicated advisor: concierge&#64;aristatrinkets.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Logout Confirmation Modal Overlay -->
    <div class="logout-modal-backdrop" *ngIf="showLogoutModal" (click)="cancelLogout()">
      <div class="logout-modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon-wrap">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <h3 class="modal-title">Confirm Sign Out</h3>
        <p class="modal-desc">Are you sure you want to sign out of your account session?</p>
        <div class="modal-actions">
          <button type="button" class="modal-btn-cancel" (click)="cancelLogout()">Cancel</button>
          <button type="button" class="modal-btn-confirm" (click)="confirmLogout()">Sign Out &rarr;</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-hero {
      background: var(--brand-pearl-beige);
      padding: 36px 16px 32px 16px;
      border-bottom: 1px solid var(--color-border);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .hero-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 8px;
      text-align: center;
    }
    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin: 0 auto;
      letter-spacing: 0.5px;
      line-height: 1.25;
      text-align: center;
    }

    .account-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .account-tab-btn {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      padding: 10px 24px;
      min-height: 44px;
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .account-tab-btn.active {
      background: var(--brand-mocha-brown);
      border-color: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
    }

    .auth-card {
      max-width: 480px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 36px;
      box-shadow: var(--shadow-sm);
    }
    @media (max-width: 576px) {
      .auth-card {
        padding: 24px 16px;
      }
    }
    .auth-card-title {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
      text-align: center;
    }
    .auth-card-desc {
      font-size: 0.92rem;
      color: #666666;
      text-align: center;
      margin-bottom: 24px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .auth-submit-wrap {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 6px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
    }
    .form-input {
      padding: 12px 16px;
      min-height: 44px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: 0.95rem;
    }

    .dashboard-shell {
      max-width: 900px;
      margin: 0 auto;
    }
    .dash-welcome {
      background: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      margin-bottom: 24px;
    }
    .dash-welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .dash-welcome h3 {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 6px;
    }
    .btn-dash-logout {
      background: transparent;
      border: 1px solid var(--brand-mocha-brown);
      color: var(--brand-mocha-brown);
      padding: 8px 18px;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .btn-dash-logout:hover {
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
    }
    .dash-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    @media (min-width: 768px) {
      .dash-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .dash-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 20px;
    }
    .dash-card h4 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
    }
    .dash-empty {
      font-size: 0.88rem;
      color: #777777;
    }

    /* Modal Styles */
    .logout-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(26, 18, 11, 0.75);
      backdrop-filter: blur(5px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }

    .logout-modal-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 32px 28px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-icon-wrap {
      width: 52px;
      height: 52px;
      margin: 0 auto 16px auto;
      background: var(--brand-pearl-beige);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--brand-warm-gold);
      border: 1px solid rgba(207, 168, 116, 0.4);
    }

    .modal-title {
      font-family: var(--font-serif);
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
    }

    .modal-desc {
      font-size: 0.92rem;
      color: #666666;
      line-height: 1.55;
      margin-bottom: 24px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .modal-btn-cancel {
      flex: 1;
      padding: 12px 18px;
      min-height: 44px;
      border: 1px solid var(--color-border);
      background: #FFFFFF;
      color: var(--brand-mocha-brown);
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .modal-btn-cancel:hover {
      background: var(--brand-pearl-beige);
    }

    .modal-btn-confirm {
      flex: 1;
      padding: 12px 18px;
      min-height: 44px;
      border: none;
      background: var(--brand-mocha-brown);
      color: #FFFFFF;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .modal-btn-confirm:hover {
      background: #2D1E14;
      transform: translateY(-1px);
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
export class AccountComponent implements OnInit {
  activeTab: 'login' | 'register' | 'dashboard' = 'login';

  loginEmail: string = '';
  loginPassword: string = '';

  regName: string = '';
  regEmail: string = '';
  regPassword: string = '';

  currentUser: any = null;
  showLogoutModal: boolean = false;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.authService.currentUser();
      this.activeTab = 'dashboard';
    }
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
    this.currentUser = null;
    this.activeTab = 'login';
  }

  async onLoginSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.loginEmail || !this.loginPassword) return;

    const res = await this.authService.login(this.loginEmail, this.loginPassword);
    if (res.success && res.user) {
      this.currentUser = res.user;
      if (res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.activeTab = 'dashboard';
      }
    } else {
      alert(res.message);
    }
  }

  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    alert('Account created successfully! Welcome to The Arista Club.');
    this.activeTab = 'dashboard';
  }

  onLogout(): void {
    this.authService.logout();
    this.cartService.clearCart();
    this.currentUser = null;
    this.activeTab = 'login';
  }
}
