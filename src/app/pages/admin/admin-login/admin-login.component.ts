import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-login-page">
      <div class="login-card">
        <div class="brand-header">
          <span class="eyebrow">ARISTA TRINKETS</span>
          <h1 class="portal-title">Atelier Back-Office Console</h1>
          <p class="portal-desc">Secure Management Portal Authentication</p>
        </div>

        <!-- Alert Banners -->
        <div class="alert-banner error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="alert-banner warning" *ngIf="reasonMessage">
          {{ reasonMessage }}
        </div>

        <form (submit)="onSubmit($event)" class="login-form">
          <div class="form-group">
            <label>Admin Email Address *</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@aristatrinkets.com"
              required
              autocomplete="username"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label>Master Secret Password *</label>
            <div class="password-field-wrapper">
              <input
                [type]="showPassword ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••••••"
                required
                autocomplete="current-password"
                class="form-control"
              />
              <button
                type="button"
                class="btn-toggle-eye"
                (click)="showPassword = !showPassword"
                [title]="showPassword ? 'Hide Password' : 'Show Password'"
              >
                <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" [disabled]="loading" class="btn-login">
            <span *ngIf="!loading">Authenticate & Access Console &rarr;</span>
            <span *ngIf="loading">Verifying Credentials...</span>
          </button>
        </form>

        <div class="card-footer">
          <a routerLink="/" class="link-storefront">&larr; Return to Customer Storefront</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-page {
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--brand-pearl-beige) 0%, #EFE8E0 100%);
      padding: 40px 16px;
    }

    .login-card {
      background: #FFFFFF;
      border: 1px solid var(--brand-warm-gold);
      border-radius: var(--radius-md);
      width: 100%;
      max-width: 440px;
      padding: 40px 32px;
      box-shadow: 0 12px 32px rgba(91, 70, 54, 0.12);
    }

    .brand-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 6px;
    }

    .portal-title {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      color: var(--brand-mocha-brown);
      margin: 0 0 4px 0;
    }

    .portal-desc {
      font-size: 0.88rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .alert-banner {
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.86rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .alert-banner.error {
      background: #FFEBEE;
      color: #C62828;
      border: 1px solid #FFCDD2;
    }

    .alert-banner.warning {
      background: #FFF8E1;
      color: #B78103;
      border: 1px solid #FFE082;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
    }

    .form-control {
      padding: 12px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-family: var(--font-sans);
      transition: border-color var(--transition-fast);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
      box-shadow: 0 0 0 3px rgba(197, 160, 110, 0.2);
    }

    .password-field-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }

    .password-field-wrapper input {
      width: 100%;
      padding-right: 42px;
    }

    .btn-toggle-eye {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      outline: none;
      border-radius: 50%;
      font-size: 1.15rem;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.75;
      transition: all var(--transition-fast);
      user-select: none;
    }

    .btn-toggle-eye:hover {
      opacity: 1;
      background: rgba(197, 160, 110, 0.1);
    }

    .btn-login {
      background: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
      border: none;
      padding: 10px 24px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all var(--transition-fast);
      margin: 14px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      max-width: 100%;
      box-shadow: 0 4px 12px rgba(67, 52, 34, 0.18);
    }

    .btn-login:hover:not(:disabled) {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(197, 160, 110, 0.35);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .card-footer {
      margin-top: 24px;
      text-align: center;
      border-top: 1px solid var(--color-border);
      padding-top: 16px;
    }

    .link-storefront {
      color: var(--color-text-muted);
      font-size: 0.85rem;
      text-decoration: none;
      font-weight: 600;
    }

    .link-storefront:hover {
      color: var(--brand-warm-gold);
    }
  `]
})
export class AdminLoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  reasonMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // If already logged in as admin, navigate directly to admin dashboard
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
      return;
    }

    const reason = this.route.snapshot.queryParamMap.get('reason');
    if (reason === 'unauthorized') {
      this.reasonMessage = 'Access Denied: Admin authentication required to access Management Portal.';
    } else if (reason === 'session_expired') {
      this.reasonMessage = 'Your admin session has expired. Please sign in again.';
    }
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage = '';
    this.loading = true;
    this.cdr.detectChanges();

    try {
      const result = await this.authService.login(this.email, this.password);
      if (result.success && result.user) {
        if (result.user.role !== 'ADMIN' && result.user.role !== 'SUPER_ADMIN') {
          this.authService.logout();
          this.errorMessage = 'Access Denied: Customer accounts cannot access the Admin Management Console.';
          return;
        }

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage = result.message || 'Invalid admin credentials.';
      }
    } catch (err) {
      this.errorMessage = 'An error occurred during authentication. Please try again.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}

