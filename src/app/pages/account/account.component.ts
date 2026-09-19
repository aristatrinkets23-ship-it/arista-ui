import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeadingComponent, ButtonComponent],
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
              <input type="email" placeholder="name&#64;example.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" placeholder="••••••••" required class="form-input" />
            </div>
            <div class="auth-submit-wrap">
              <app-button type="submit" variant="primary" size="lg" [rounded]="true">Sign In &rarr;</app-button>
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
              <input type="text" placeholder="e.g. Lady Catherine" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" placeholder="name&#64;example.com" required class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" placeholder="Create a secure password" required class="form-input" />
            </div>
            <div class="auth-submit-wrap">
              <app-button type="submit" variant="primary" size="lg" [rounded]="true">Create Account &rarr;</app-button>
            </div>
          </form>
        </div>

        <!-- Account Dashboard Placeholder Shell -->
        <div *ngIf="activeTab === 'dashboard'" class="dashboard-shell">
          <div class="dash-welcome">
            <h3>Welcome, Valued Collector</h3>
            <p>Customer Account & Order History Portal (Backend Authentication Integration Planned for Phase 05+)</p>
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
  `,
  styles: [`
    .account-hero {
      background: var(--brand-pearl-beige);
      padding: 32px 0 28px 0;
      border-bottom: 1px solid var(--color-border);
    }
    .hero-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 6px;
    }
    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(1.6rem, 3.2vw, 2.3rem);
      font-weight: 700;
      color: var(--brand-mocha-brown);
      margin: 0;
      letter-spacing: 0.5px;
      line-height: 1.2;
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
    .dash-welcome h3 {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 6px;
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
  `]
})
export class AccountComponent {
  activeTab: 'login' | 'register' | 'dashboard' = 'login';

  onLoginSubmit(event: Event): void {
    event.preventDefault();
    alert('Authentication Service: Login credentials validated (Demo State). Switching to Account Dashboard.');
    this.activeTab = 'dashboard';
  }

  onRegisterSubmit(event: Event): void {
    event.preventDefault();
    alert('Authentication Service: Account registration completed (Demo State). Welcome to Arista Club!');
    this.activeTab = 'dashboard';
  }
}
