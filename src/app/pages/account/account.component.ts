import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Luxury Breadcrumb Bar -->
    <nav class="account-breadcrumb-bar" aria-label="Breadcrumb">
      <div class="container breadcrumb-inner">
        <a routerLink="/" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ activeTab === 'dashboard' ? 'My Atelier Account' : 'Member Access' }}</span>
        <ng-container *ngIf="activeTab === 'dashboard'">
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-sub">
            {{ dashSubTab === 'orders' ? 'Orders & Fulfillment' : dashSubTab === 'addresses' ? 'Shipping Addresses' : dashSubTab === 'profile' ? 'Profile & Security' : 'Saved Wishlist' }}
          </span>
        </ng-container>
      </div>
    </nav>

    <!-- Main Account Wrapper -->
    <section class="account-page-wrapper">
      <div class="container">

        <!-- Toast Alert Notification Banner -->
        <div class="account-toast" *ngIf="toastMessage" [class.success]="toastType === 'success'" [class.error]="toastType === 'error'">
          <span class="toast-icon">{{ toastType === 'success' ? '✓' : '✕' }}</span>
          <span class="toast-text">{{ toastMessage }}</span>
          <button type="button" class="btn-close-toast" (click)="toastMessage = ''" aria-label="Close notification">&times;</button>
        </div>

        <!-- AUTH VIEW (Sign In / Register / Forgot Password) -->
        <div *ngIf="activeTab !== 'dashboard'" class="auth-viewport">
          <div class="auth-header-block">
            <span class="luxury-eyebrow">The Arista Club</span>
            <h1 class="auth-main-title">Client Account Access</h1>
            <p class="auth-main-subtitle">Manage your private bespoke orders, delivery addresses, and curated demi-fine jewellery.</p>
          </div>

          <!-- Auth Mode Switcher -->
          <div class="auth-segmented-nav">
            <button
              type="button"
              [class.active]="activeTab === 'login'"
              (click)="activeTab = 'login'; loginError = '';"
              class="auth-segment-btn"
            >
              Sign In
            </button>
            <button
              type="button"
              [class.active]="activeTab === 'register'"
              (click)="activeTab = 'register'; registerError = '';"
              class="auth-segment-btn"
            >
              Create Account
            </button>
            <button
              *ngIf="activeTab === 'forgot'"
              type="button"
              class="auth-segment-btn active"
            >
              Reset Password
            </button>
          </div>

          <!-- Sign In Form -->
          <div *ngIf="activeTab === 'login'" class="auth-card">
            <h2 class="auth-card-title">Welcome Back to Arista</h2>
            <p class="auth-card-desc">Sign in with your registered email to access your orders and saved pieces.</p>
            <div *ngIf="loginError" class="auth-alert error">{{ loginError }}</div>
            <form novalidate (submit)="onLoginSubmit($event)" class="auth-form">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" [(ngModel)]="loginEmail" name="email" placeholder="name@example.com" class="form-input" />
              </div>
              <div class="form-group">
                <div class="form-label-row">
                  <label class="form-label">Password *</label>
                  <button type="button" (click)="activeTab = 'forgot'; forgotStep = 1; forgotError = ''; forgotSuccess = '';" class="btn-text-link">
                    Forgot Password?
                  </button>
                </div>
                <div class="password-field-wrapper">
                  <input
                    [type]="showLoginPassword ? 'text' : 'password'"
                    [(ngModel)]="loginPassword"
                    name="password"
                    placeholder="••••••••"
                    class="form-input"
                  />
                  <button
                    type="button"
                    class="btn-toggle-eye"
                    (click)="showLoginPassword = !showLoginPassword"
                    [title]="showLoginPassword ? 'Hide Password' : 'Show Password'"
                  >
                    <svg *ngIf="!showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="auth-submit-wrap">
                <button type="submit" class="btn-luxury-primary w-full">Sign In to Account &rarr;</button>
              </div>
              <div class="admin-link-row">
                <a routerLink="/admin/login" class="admin-login-link">
                  Are you a Store Administrator? Sign in to Admin Console &rarr;
                </a>
              </div>
            </form>
          </div>

          <!-- Forgot Password Form (OTP Flow) -->
          <div *ngIf="activeTab === 'forgot'" class="auth-card">
            <h2 class="auth-card-title">Reset Your Password</h2>
            <p class="auth-card-desc" *ngIf="forgotStep === 1">Enter your registered email address to receive a 6-digit security code.</p>
            <p class="auth-card-desc" *ngIf="forgotStep === 2">Enter the 6-digit code sent to {{ forgotEmail }} and your new password.</p>

            <div *ngIf="forgotError" class="auth-alert error">{{ forgotError }}</div>
            <div *ngIf="forgotSuccess" class="auth-alert success">{{ forgotSuccess }}</div>

            <!-- Step 1: Request 6-Digit OTP -->
            <form *ngIf="forgotStep === 1" novalidate (submit)="onRequestOtpSubmit($event)" class="auth-form">
              <div class="form-group">
                <label class="form-label">Registered Email Address *</label>
                <input type="email" [(ngModel)]="forgotEmail" name="forgotEmail" placeholder="name@example.com" class="form-input" />
              </div>
              <div class="auth-submit-wrap">
                <button type="submit" class="btn-luxury-primary w-full" [disabled]="otpLoading">
                  <span *ngIf="!otpLoading">Send Verification Code &rarr;</span>
                  <span *ngIf="otpLoading">Sending Code...</span>
                </button>
              </div>
              <div class="auth-back-link">
                <button type="button" (click)="activeTab = 'login'" class="btn-text-link">
                  &larr; Return to Sign In
                </button>
              </div>
            </form>

            <!-- Step 2: Enter OTP Code & New Password -->
            <form *ngIf="forgotStep === 2" novalidate (submit)="onResetPasswordSubmit($event)" class="auth-form">
              <div class="form-group">
                <label class="form-label">6-Digit Verification Code *</label>
                <input type="text" [(ngModel)]="forgotOtp" name="forgotOtp" placeholder="684920" maxlength="6" class="form-input otp-input" />
              </div>

              <div class="form-group">
                <label class="form-label">New Password *</label>
                <div class="password-field-wrapper">
                  <input
                    [type]="showResetPassword ? 'text' : 'password'"
                    [(ngModel)]="newPassword"
                    name="newPassword"
                    placeholder="Enter your new password"
                    class="form-input"
                  />
                  <button
                    type="button"
                    class="btn-toggle-eye"
                    (click)="showResetPassword = !showResetPassword"
                  >
                    <svg *ngIf="!showResetPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showResetPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="auth-submit-wrap">
                <button type="submit" class="btn-luxury-primary w-full" [disabled]="otpLoading">
                  <span *ngIf="!otpLoading">Reset Password & Sign In &rarr;</span>
                  <span *ngIf="otpLoading">Updating Password...</span>
                </button>
              </div>
              <div class="auth-split-actions">
                <button type="button" (click)="forgotStep = 1; forgotError = ''; forgotSuccess = '';" class="btn-text-link muted">
                  &larr; Resend Code
                </button>
                <button type="button" (click)="activeTab = 'login'" class="btn-text-link">
                  Return to Sign In
                </button>
              </div>
            </form>
          </div>

          <!-- Register Form -->
          <div *ngIf="activeTab === 'register'" class="auth-card">
            <h2 class="auth-card-title">Join The Arista Club</h2>
            <p class="auth-card-desc">Create your private member account for priority access to new collection releases.</p>
            <div *ngIf="registerError" class="auth-alert error">{{ registerError }}</div>
            <form novalidate (submit)="onRegisterSubmit($event)" class="auth-form">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" [(ngModel)]="regName" name="name" placeholder="e.g. Lata Mangeshkar" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" [(ngModel)]="regEmail" name="email" placeholder="name@example.com" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Password *</label>
                <div class="password-field-wrapper">
                  <input
                    [type]="showRegisterPassword ? 'text' : 'password'"
                    [(ngModel)]="regPassword"
                    name="password"
                    placeholder="Minimum 6 characters"
                    class="form-input"
                  />
                  <button
                    type="button"
                    class="btn-toggle-eye"
                    (click)="showRegisterPassword = !showRegisterPassword"
                  >
                    <svg *ngIf="!showRegisterPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showRegisterPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="auth-submit-wrap">
                <button type="submit" class="btn-luxury-primary w-full">Create Member Account &rarr;</button>
              </div>
            </form>
          </div>
        </div>

        <!-- AUTHENTICATED DASHBOARD VIEW: SIDEBAR + CONTENT GRID -->
        <div *ngIf="activeTab === 'dashboard'" class="dashboard-grid-layout">

          <!-- 1. LEFT PERSISTENT LUXURY SIDEBAR -->
          <aside class="dashboard-sidebar">
            <!-- Member Profile Capsule -->
            <div class="sidebar-profile-card">
              <div class="member-monogram-wrap">
                <div class="member-monogram">{{ userInitials }}</div>
                <div class="status-indicator-badge" title="Active Account"></div>
              </div>
              <div class="member-info">
                <span class="member-tier-pill">★ ARISTA PRIVÉ CLIENT</span>
                <h2 class="member-name">{{ currentUser?.name || 'Valued Client' }}</h2>
                <span class="member-email" [title]="currentUser?.email">{{ currentUser?.email }}</span>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="sidebar-nav" aria-label="Account navigation">
              <button
                type="button"
                class="sidebar-nav-item"
                [class.active]="dashSubTab === 'orders'"
                (click)="dashSubTab = 'orders'; loadMyOrders();"
              >
                <div class="nav-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-svg">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  <span>My Orders</span>
                </div>
                <span class="nav-count-badge" *ngIf="myOrders.length > 0">{{ myOrders.length }}</span>
              </button>

              <button
                type="button"
                class="sidebar-nav-item"
                [class.active]="dashSubTab === 'addresses'"
                (click)="dashSubTab = 'addresses'; loadSavedAddresses();"
              >
                <div class="nav-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Saved Addresses</span>
                </div>
                <span class="nav-count-badge" *ngIf="savedAddresses.length > 0">{{ savedAddresses.length }}</span>
              </button>

              <button
                type="button"
                class="sidebar-nav-item"
                [class.active]="dashSubTab === 'profile'"
                (click)="dashSubTab = 'profile'"
              >
                <div class="nav-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Profile &amp; Security</span>
                </div>
              </button>

              <button
                type="button"
                class="sidebar-nav-item"
                [class.active]="dashSubTab === 'wishlist'"
                (click)="dashSubTab = 'wishlist'; loadWishlist();"
              >
                <div class="nav-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>Saved Wishlist</span>
                </div>
                <span class="nav-count-badge highlight" *ngIf="wishlistItems.length > 0">{{ wishlistItems.length }}</span>
              </button>
            </nav>

            <!-- Sidebar Footer Actions -->
            <div class="sidebar-footer">
              <a
                *ngIf="currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN'"
                routerLink="/admin"
                class="btn-admin-console"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Admin Console</span>
              </a>

              <button type="button" class="btn-sidebar-signout" (click)="openLogoutModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          <!-- 2. RIGHT MAIN CONTENT AREA -->
          <main class="dashboard-main-content">

            <!-- Executive Quick-Stats Bar -->
            <div class="stats-overview-grid">
              <div class="stat-capsule" (click)="dashSubTab = 'orders'; selectedStatusFilter = 'ALL';">
                <div class="stat-icon-wrap gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <div class="stat-meta">
                  <span class="stat-number">{{ orderStats.total }}</span>
                  <span class="stat-label">Total Orders</span>
                </div>
              </div>

              <div class="stat-capsule" (click)="dashSubTab = 'orders'; selectedStatusFilter = 'ACTIVE';">
                <div class="stat-icon-wrap blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div class="stat-meta">
                  <span class="stat-number">{{ orderStats.inTransit }}</span>
                  <span class="stat-label">In-Transit / Active</span>
                </div>
              </div>

              <div class="stat-capsule" (click)="dashSubTab = 'addresses';">
                <div class="stat-icon-wrap sage">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="stat-meta">
                  <span class="stat-number">{{ savedAddresses.length }}</span>
                  <span class="stat-label">Saved Addresses</span>
                </div>
              </div>

              <div class="stat-capsule" (click)="dashSubTab = 'wishlist';">
                <div class="stat-icon-wrap rose">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <div class="stat-meta">
                  <span class="stat-number">{{ wishlistItems.length }}</span>
                  <span class="stat-label">Saved Pieces</span>
                </div>
              </div>
            </div>

            <!-- SUB-TAB 1: MY ORDERS & REAL-TIME FULFILLMENT -->
            <div *ngIf="dashSubTab === 'orders'" class="pane-content-wrapper">
              <div class="content-header-row">
                <div>
                  <h3 class="pane-title">Orders &amp; Fulfillment History</h3>
                  <p class="pane-subtitle">Track parcel movement, download official receipts, or repurchase curated pieces.</p>
                </div>
                <a routerLink="/shop" class="btn-outline-gold">+ New Order</a>
              </div>

              <!-- Search & Filter Controls Bar -->
              <div class="orders-filter-bar">
                <div class="order-search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-svg">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    placeholder="Search by Order #, product name, or AWB tracking code..."
                    class="order-search-input"
                  />
                  <button *ngIf="searchTerm" (click)="searchTerm = ''" class="btn-clear-search">&times;</button>
                </div>

                <!-- Status Filter Chips -->
                <div class="status-filter-chips">
                  <button
                    type="button"
                    class="filter-chip"
                    [class.active]="selectedStatusFilter === 'ALL'"
                    (click)="selectedStatusFilter = 'ALL'"
                  >
                    All ({{ myOrders.length }})
                  </button>
                  <button
                    type="button"
                    class="filter-chip"
                    [class.active]="selectedStatusFilter === 'ACTIVE'"
                    (click)="selectedStatusFilter = 'ACTIVE'"
                  >
                    Active / In-Transit ({{ orderStats.inTransit }})
                  </button>
                  <button
                    type="button"
                    class="filter-chip"
                    [class.active]="selectedStatusFilter === 'DELIVERED'"
                    (click)="selectedStatusFilter = 'DELIVERED'"
                  >
                    Delivered ({{ orderStats.delivered }})
                  </button>
                  <button
                    type="button"
                    class="filter-chip"
                    [class.active]="selectedStatusFilter === 'CANCELLED'"
                    (click)="selectedStatusFilter = 'CANCELLED'"
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <!-- Shimmer Loading State -->
              <div *ngIf="isLoadingOrders" class="orders-shimmer-list">
                <div class="shimmer-order-card" *ngFor="let s of [1, 2]">
                  <div class="shimmer-line header"></div>
                  <div class="shimmer-line timeline"></div>
                  <div class="shimmer-row">
                    <div class="shimmer-box thumb"></div>
                    <div class="shimmer-stack">
                      <div class="shimmer-line text-lg"></div>
                      <div class="shimmer-line text-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State: When 0 total orders -->
              <div *ngIf="!isLoadingOrders && myOrders.length === 0" class="empty-state-luxury">
                <div class="empty-icon-wrap">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
                <h4 class="empty-heading">No Orders Placed Yet</h4>
                <p class="empty-desc">Your order portfolio is currently empty. Explore our handcrafted anti-tarnish fine jewellery collections.</p>
                <a routerLink="/shop" class="btn-luxury-primary">Explore Boutique Collections &rarr;</a>
              </div>

              <!-- Empty State: When search/filter yields 0 items -->
              <div *ngIf="!isLoadingOrders && myOrders.length > 0 && filteredOrders.length === 0" class="empty-filter-state">
                <p>No orders matching "<strong>{{ searchTerm }}</strong>" with status <strong>{{ selectedStatusFilter }}</strong>.</p>
                <button type="button" class="btn-reset-filters" (click)="clearOrderFilters()">Reset Search &amp; Filters</button>
              </div>

              <!-- Orders Cards List -->
              <div class="orders-container" *ngIf="!isLoadingOrders && filteredOrders.length > 0">
                <article *ngFor="let order of filteredOrders" class="luxury-order-card">

                  <!-- 1. ORDER CARD HEADER -->
                  <header class="order-header-bar">
                    <div class="order-ref-group">
                      <span class="order-id">Order #{{ order.order_number || order.number }}</span>
                      <span class="order-timestamp">Placed on {{ order.created_at || order.ordered_at | date:'MMMM d, y, h:mm a' }}</span>
                    </div>

                    <div class="order-pill-group">
                      <!-- Payment Badge -->
                      <span class="badge-payment" [class.paid]="(order.payment_status || order.paymentStatus) === 'PAID'">
                        <span class="bullet-dot"></span>
                        {{ (order.payment_status || order.paymentStatus) === 'PAID' ? 'PAID (RAZORPAY)' : (order.payment_method || 'CASH ON DELIVERY') }}
                      </span>

                      <!-- Status Badge with Pulsing Dot -->
                      <span class="badge-order-status" [ngClass]="(order.order_status || order.status | lowercase)">
                        <span class="pulse-dot"></span>
                        {{ order.order_status || order.status }}
                      </span>
                    </div>
                  </header>

                  <!-- 2. COURIER AWB BANNER (Renders when tracking code is set) -->
                  <div *ngIf="order.tracking_code && order.tracking_code.trim()" class="courier-tracking-strip">
                    <div class="courier-info">
                      <span class="courier-badge">🚚 EXPRESS COURIER</span>
                      <strong class="courier-name">{{ order.courier_name || 'Delhivery / BlueDart' }}</strong>
                      <span class="awb-label">AWB No:</span>
                      <code class="awb-code">{{ order.tracking_code }}</code>
                    </div>
                    <div class="courier-actions">
                      <button type="button" class="btn-copy-awb" (click)="copyToClipboard(order.tracking_code, 'AWB Tracking Code copied!')">
                        Copy AWB
                      </button>
                    </div>
                  </div>

                  <!-- 3. INTERACTIVE LUXURY STEPPER TIMELINE -->
                  <div class="fulfillment-stepper-wrapper">
                    <div class="stepper-title-row">
                      <span class="stepper-title">Fulfillment Progress</span>
                      <span class="stepper-stage-status">Current Stage: <strong>{{ order.order_status || order.status }}</strong></span>
                    </div>
                    <div class="stepper-track-grid">
                      <div
                        *ngFor="let step of order.timeline; let i = index; let isLast = last"
                        class="stepper-milestone"
                        [class.completed]="step.completed"
                        [class.active]="step.active"
                      >
                        <div class="milestone-indicator-wrap">
                          <div class="milestone-line-left" [class.invisible-spacer]="i === 0"></div>
                          <div class="milestone-node">
                            <span *ngIf="step.completed" class="node-check">✓</span>
                            <span *ngIf="step.active && !step.completed" class="node-pulse"></span>
                          </div>
                          <div class="milestone-line-right" [class.invisible-spacer]="isLast"></div>
                        </div>
                        <div class="milestone-text-block">
                          <span class="milestone-label">{{ step.label }}</span>
                          <span class="milestone-date" *ngIf="step.date">{{ step.date | date:'shortDate' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 4. ITEMIZED PIECES LIST WITH THUMBNAILS -->
                  <div class="order-items-wrapper">
                    <h5 class="items-section-heading">Curated Pieces in this Package ({{ order.items?.length || 0 }}):</h5>
                    <div class="items-table-list">
                      <div *ngFor="let item of order.items" class="order-item-card">
                        <!-- Product Thumbnail -->
                        <div class="item-thumbnail-wrap">
                          <img
                            [src]="item.product_image || defaultImage"
                            [alt]="item.product_name"
                            class="item-img"
                            (error)="onImageError($event)"
                          />
                        </div>

                        <!-- Product Meta -->
                        <div class="item-primary-meta">
                          <h6 class="item-title">
                            <a *ngIf="item.product_slug" [routerLink]="['/product', item.product_slug]" class="item-link">
                              {{ item.product_name }}
                            </a>
                            <span *ngIf="!item.product_slug">{{ item.product_name }}</span>
                          </h6>
                          <div class="item-tags">
                            <span class="metal-spec-pill">{{ item.metal_type || '18K Warm Gold' }}</span>
                            <span class="qty-pill">Qty: {{ item.quantity }}</span>
                          </div>
                        </div>

                        <!-- Item Pricing & Repurchase Action -->
                        <div class="item-actions-side">
                          <div class="item-price-col">
                            <span class="item-unit-calc" *ngIf="item.quantity > 1">₹{{ item.unit_price | number }} each</span>
                            <strong class="item-total-price">₹{{ (item.total_price || (item.unit_price * item.quantity)) | number }}</strong>
                          </div>
                          <button
                            type="button"
                            class="btn-buy-again-sm"
                            (click)="buyAgain(item)"
                            title="Add piece back to shopping bag"
                          >
                            + Buy Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 5. CARD FOOTER: SHIPPING, TOTAL & ACTION BUTTONS -->
                  <footer class="order-card-footer">
                    <div class="delivery-destination-block">
                      <span class="dest-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        Insured Delivery Destination:
                      </span>
                      <p class="dest-address">
                        {{ (order.shipping_address && order.shipping_address.trim()) ? (order.shipping_address + (order.city ? ', ' + order.city : '') + (order.state ? ', ' + order.state : '') + (order.pincode ? ' - ' + order.pincode : '')) : 'Standard Insured Courier Delivery' }}
                      </p>
                    </div>

                    <div class="order-total-block">
                      <span class="total-label">Grand Total (Incl. Taxes &amp; Courier)</span>
                      <span class="total-figure">₹{{ (order.total_amount || order.total) | number }}</span>
                    </div>

                    <!-- Actions Row -->
                    <div class="order-actions-bar">
                      <a
                        [href]="getInvoicePdfUrl(order)"
                        target="_blank"
                        download
                        class="btn-footer-action"
                        style="text-decoration: none;"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Download Tax Invoice (PDF)</span>
                      </a>

                      <button
                        type="button"
                        class="btn-footer-action primary"
                        (click)="reorderAll(order)"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" y1="6" x2="21" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>Reorder All Pieces</span>
                      </button>
                    </div>
                  </footer>

                </article>
              </div>
            </div>

            <!-- SUB-TAB 2: SAVED SHIPPING ADDRESSES -->
            <div *ngIf="dashSubTab === 'addresses'" class="pane-content-wrapper">
              <div class="content-header-row">
                <div>
                  <h3 class="pane-title">Saved Shipping Destinations</h3>
                  <p class="pane-subtitle">Manage registered delivery locations for seamless 1-click express checkout.</p>
                </div>
                <button type="button" class="btn-luxury-primary" (click)="openAddressModal()">
                  + Add New Shipping Address
                </button>
              </div>

              <!-- Information Banner on Checkout Sync -->
              <div class="info-callout-card">
                <div class="callout-icon">💡</div>
                <div class="callout-text">
                  <strong>Express Checkout Sync:</strong> Your designated <strong>Default Address</strong> is pre-loaded at checkout so you can complete luxury demi-fine orders without re-entering shipping details.
                </div>
              </div>

              <!-- Loading State -->
              <div *ngIf="isLoadingAddresses" class="loading-box">
                <span class="spinner-inline"></span>
                <span>Retrieving saved shipping destinations...</span>
              </div>

              <!-- Empty State -->
              <div *ngIf="!isLoadingAddresses && savedAddresses.length === 0" class="empty-state-luxury">
                <div class="empty-icon-wrap">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h4 class="empty-heading">No Shipping Addresses Saved</h4>
                <p class="empty-desc">Add your residence or office address to enable instant 1-click checkout on future pieces.</p>
                <button type="button" class="btn-luxury-primary" (click)="openAddressModal()">+ Add Shipping Address Now</button>
              </div>

              <!-- Addresses Grid -->
              <div class="address-cards-grid" *ngIf="!isLoadingAddresses && savedAddresses.length > 0">
                <div *ngFor="let addr of savedAddresses" class="address-tile-card" [class.is-default]="addr.is_default || addr.isDefault">
                  <div class="address-tile-header">
                    <span *ngIf="addr.is_default || addr.isDefault" class="badge-default-dest">
                      ★ DEFAULT CHECKOUT DESTINATION
                    </span>
                    <span *ngIf="!addr.is_default && !addr.isDefault" class="badge-saved-dest">
                      SAVED DESTINATION
                    </span>
                  </div>

                  <h4 class="addr-recipient">{{ addr.full_name || addr.fullName }}</h4>
                  <p class="addr-line">{{ addr.address_line || addr.addressLine }}</p>
                  <p class="addr-line">{{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</p>
                  <p class="addr-phone">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{{ addr.phone }}</span>
                  </p>

                  <div class="addr-card-actions">
                    <button
                      *ngIf="!addr.is_default && !addr.isDefault"
                      type="button"
                      class="btn-tile-action"
                      (click)="setAddressAsDefault(addr)"
                    >
                      ★ Set as Default
                    </button>
                    <button type="button" class="btn-tile-action" (click)="editAddressItem(addr)">
                      Edit
                    </button>
                    <button type="button" class="btn-tile-action delete" (click)="deleteAddressItem(addr.id)">
                      Delete
                    </button>
                    <a [routerLink]="['/checkout']" [queryParams]="{ addressId: addr.id }" class="btn-tile-checkout">
                      Use at Checkout &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUB-TAB 3: PROFILE & SECURITY SETTINGS -->
            <div *ngIf="dashSubTab === 'profile'" class="pane-content-wrapper">
              <div class="content-header-row">
                <div>
                  <h3 class="pane-title">Member Profile &amp; Security</h3>
                  <p class="pane-subtitle">Manage personal atelier profile details and update account authentication credentials.</p>
                </div>
              </div>

              <div class="profile-settings-dual-grid">
                <!-- Card 1: Personal Details -->
                <div class="luxury-form-card">
                  <div class="form-card-header">
                    <div class="form-card-icon gold">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 class="form-card-title">Personal Information</h4>
                      <p class="form-card-desc">Update your preferred display name and contact phone number.</p>
                    </div>
                  </div>

                  <div *ngIf="profileSuccessMsg" class="auth-alert success">{{ profileSuccessMsg }}</div>
                  <div *ngIf="profileErrorMsg" class="auth-alert error">{{ profileErrorMsg }}</div>

                  <form (submit)="onUpdateProfileSubmit($event)" class="luxury-form">
                    <div class="form-group">
                      <label class="form-label">Full Name *</label>
                      <input type="text" [(ngModel)]="profileForm.name" name="profName" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email Address (Primary Member ID)</label>
                      <input type="email" [value]="currentUser?.email" disabled class="form-input disabled" />
                      <span class="field-hint">Member ID email cannot be modified once verified.</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Mobile Phone Number</label>
                      <input
                        type="tel"
                        [(ngModel)]="profileForm.phone"
                        (input)="onPhoneInput($event, 'profile')"
                        name="profPhone"
                        placeholder="9876543210"
                        maxlength="10"
                        class="form-input"
                      />
                    </div>
                    <div class="form-submit-row">
                      <button type="submit" class="btn-luxury-primary">Save Profile Changes</button>
                    </div>
                  </form>
                </div>

                <!-- Card 2: Password Security -->
                <div class="luxury-form-card">
                  <div class="form-card-header">
                    <div class="form-card-icon mocha">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 class="form-card-title">Security &amp; Password</h4>
                      <p class="form-card-desc">Protect your member account with a secure, confidential password.</p>
                    </div>
                  </div>

                  <div *ngIf="passwordSuccessMsg" class="auth-alert success">{{ passwordSuccessMsg }}</div>
                  <div *ngIf="passwordErrorMsg" class="auth-alert error">{{ passwordErrorMsg }}</div>

                  <form (submit)="onChangePasswordSubmit($event)" class="luxury-form">
                    <div class="form-group">
                      <label class="form-label">Current Password *</label>
                      <div class="password-field-wrapper">
                        <input
                          [type]="showOldPassword ? 'text' : 'password'"
                          [(ngModel)]="passwordForm.oldPassword"
                          name="oldPw"
                          placeholder="Current password"
                          class="form-input"
                        />
                        <button type="button" class="btn-toggle-eye" (click)="showOldPassword = !showOldPassword">
                          <svg *ngIf="!showOldPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          <svg *ngIf="showOldPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">New Password *</label>
                      <div class="password-field-wrapper">
                        <input
                          [type]="showNewPassword ? 'text' : 'password'"
                          [(ngModel)]="passwordForm.newPassword"
                          name="newPw"
                          placeholder="Minimum 6 characters"
                          class="form-input"
                        />
                        <button type="button" class="btn-toggle-eye" (click)="showNewPassword = !showNewPassword">
                          <svg *ngIf="!showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          <svg *ngIf="showNewPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Confirm New Password *</label>
                      <div class="password-field-wrapper">
                        <input
                          [type]="showConfirmPassword ? 'text' : 'password'"
                          [(ngModel)]="passwordForm.confirmPassword"
                          name="confPw"
                          placeholder="Re-enter new password"
                          class="form-input"
                        />
                        <button type="button" class="btn-toggle-eye" (click)="showConfirmPassword = !showConfirmPassword">
                          <svg *ngIf="!showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          <svg *ngIf="showConfirmPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        </button>
                      </div>
                    </div>
                    <div class="form-submit-row">
                      <button type="submit" class="btn-luxury-primary">Update Security Password</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- SUB-TAB 4: SAVED WISHLIST PIECES (100% REAL DATABASE DATA) -->
            <div *ngIf="dashSubTab === 'wishlist'" class="pane-content-wrapper">
              <div class="content-header-row">
                <div>
                  <h3 class="pane-title">Saved Wishlist Pieces</h3>
                  <p class="pane-subtitle">Your private collection of favorite demi-fine rings, necklaces, and bespoke bangles.</p>
                </div>
                <button
                  *ngIf="wishlistItems.length > 0"
                  type="button"
                  class="btn-outline-gold"
                  (click)="moveAllWishlistToBag()"
                >
                  Move All to Bag &rarr;
                </button>
              </div>

              <!-- Empty State -->
              <div *ngIf="wishlistItems.length === 0" class="empty-state-luxury">
                <div class="empty-icon-wrap rose">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h4 class="empty-heading">Your Wishlist is Empty</h4>
                <p class="empty-desc">Discover our artisanal demi-fine collections and tap the heart icon on any piece to save it here.</p>
                <a routerLink="/shop" class="btn-luxury-primary">Explore Boutique Pieces &rarr;</a>
              </div>

              <!-- Wishlist Grid -->
              <div class="wishlist-pieces-grid" *ngIf="wishlistItems.length > 0">
                <article *ngFor="let item of wishlistItems" class="wishlist-tile-card">
                  <div class="wishlist-img-frame">
                    <img [src]="item.image || defaultImage" [alt]="item.name" class="wishlist-img" (error)="onImageError($event)" />
                    <button
                      type="button"
                      class="btn-remove-wishlist"
                      (click)="removeFromWishlist(item)"
                      title="Remove from wishlist"
                    >
                      &times;
                    </button>
                  </div>
                  <div class="wishlist-tile-body">
                    <span class="wishlist-category-tag">{{ item.category || 'Demi-Fine Jewellery' }}</span>
                    <h4 class="wishlist-item-name">
                      <a [routerLink]="['/product', item.slug || item.id]" class="wishlist-link">
                        {{ item.name }}
                      </a>
                    </h4>
                    <div class="wishlist-price-line">₹{{ item.price | number }}</div>
                    <div class="wishlist-tile-actions">
                      <button type="button" class="btn-tile-bag" (click)="addToBagFromWishlist(item)">
                        + Move to Shopping Bag
                      </button>
                      <a [routerLink]="['/product', item.slug || item.id]" class="btn-tile-view">
                        View Piece Details &rarr;
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>

          </main>
        </div>

      </div>
    </section>

    <!-- Address Modal Overlay Popup -->
    <div class="modal-backdrop" *ngIf="showAddressModal" (click)="closeAddressModal()">
      <div class="modal-card-box" (click)="$event.stopPropagation()">
        <div class="modal-card-header">
          <h2 class="modal-header-title">{{ editingAddress ? 'Edit Shipping Destination' : '+ Add New Shipping Destination' }}</h2>
          <button type="button" class="btn-modal-close" (click)="closeAddressModal()">&times;</button>
        </div>

        <form (submit)="saveAddressSubmit($event)" class="luxury-form" style="margin-top: 18px;">
          <div class="form-group">
            <label class="form-label">Recipient Full Name *</label>
            <input type="text" [(ngModel)]="addressForm.fullName" name="addrFullName" placeholder="e.g. Lata Mangeshkar" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Phone Number *</label>
            <input type="tel" [(ngModel)]="addressForm.phone" (input)="onPhoneInput($event, 'address')" name="addrPhone" placeholder="9876543210" maxlength="10" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Street Address / Flat, Wing &amp; Building *</label>
            <textarea [(ngModel)]="addressForm.addressLine" name="addrLine" rows="2" placeholder="Flat No, Building, Street, Landmark" class="form-input"></textarea>
          </div>
          <div class="form-grid-two">
            <div class="form-group">
              <label class="form-label">City *</label>
              <input type="text" [(ngModel)]="addressForm.city" name="addrCity" placeholder="Mumbai" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">State *</label>
              <input type="text" [(ngModel)]="addressForm.state" name="addrState" placeholder="Maharashtra" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">PIN Code *</label>
            <input type="tel" [(ngModel)]="addressForm.pincode" (input)="onAddressPincodeInput($event)" name="addrPincode" placeholder="e.g. 400001" maxlength="6" inputmode="numeric" class="form-input" />
          </div>
          <div class="form-checkbox-row">
            <input type="checkbox" id="chkDefault" [(ngModel)]="addressForm.isDefault" name="addrDefault" class="luxury-checkbox" />
            <label for="chkDefault" class="checkbox-label">
              Set as my default destination for 1-click checkout
            </label>
          </div>

          <div class="modal-form-actions">
            <button type="button" class="btn-outline-cancel" (click)="closeAddressModal()">Cancel</button>
            <button type="submit" class="btn-luxury-primary">Save Destination &rarr;</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Sign Out Confirmation Modal Overlay -->
    <div class="modal-backdrop" *ngIf="showLogoutModal" (click)="cancelLogout()">
      <div class="modal-card-box signout-dialog" (click)="$event.stopPropagation()">
        <div class="signout-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <h3 class="signout-title">Confirm Sign Out</h3>
        <p class="signout-desc">Are you sure you wish to end your client account session?</p>
        <div class="signout-actions-row">
          <button type="button" class="btn-outline-cancel" (click)="cancelLogout()">Cancel</button>
          <button type="button" class="btn-danger-confirm" (click)="confirmLogout()">Sign Out &rarr;</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ==========================================================================
       ARISTA CLIENT ACCOUNT — LUXURY ATELIER DESIGN SYSTEM
       ========================================================================== */

    :host {
      display: block;
      background-color: var(--brand-pearl-beige, #F7F5F0);
      min-height: 100vh;
      color: #2C221E;
    }

    /* 1. Breadcrumb Bar */
    .account-breadcrumb-bar {
      background: #FFFFFF;
      border-bottom: 1px solid #EBE4DC;
      padding: 14px 0;
      font-size: 0.82rem;
      letter-spacing: 0.3px;
    }
    .breadcrumb-inner {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #7A695E;
    }
    .breadcrumb-link {
      color: #7A695E;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .breadcrumb-link:hover {
      color: var(--brand-warm-gold, #CFA874);
    }
    .breadcrumb-sep {
      color: #CFC5BC;
    }
    .breadcrumb-current {
      font-weight: 600;
      color: #2C221E;
    }
    .breadcrumb-sub {
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 600;
    }

    /* 2. Main Page Layout Wrapper */
    .account-page-wrapper {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      padding: 32px 0 64px 0;
    }

    /* 3. Toast Notification */
    .account-toast {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      background: #15803D;
      color: #FFFFFF;
      padding: 12px 22px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .account-toast.error {
      background: #DC2626;
    }
    .toast-icon {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .btn-close-toast {
      background: none;
      border: none;
      color: #FFFFFF;
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 0 0 6px;
    }
    @keyframes toastSlideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* 4. Auth View (Sign In / Register / Reset) */
    .auth-viewport {
      width: 100%;
      box-sizing: border-box;
      max-width: 500px;
      margin: 0 auto;
      padding: 20px 0;
    }
    .auth-header-block {
      text-align: center;
      margin-bottom: 24px;
    }
    .luxury-eyebrow {
      font-family: var(--font-sans, sans-serif);
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold, #CFA874);
      display: block;
      margin-bottom: 6px;
    }
    .auth-main-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 2rem;
      color: #2C221E;
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .auth-main-subtitle {
      font-size: 0.92rem;
      color: #6B5B51;
      margin: 0;
      line-height: 1.5;
    }
    .auth-segmented-nav {
      display: flex;
      background: #EAE3DC;
      padding: 4px;
      border-radius: 50px;
      margin-bottom: 24px;
      gap: 4px;
    }
    .auth-segment-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 10px 18px;
      border-radius: 50px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #5C4A3E;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }
    .auth-segment-btn.active {
      background: #FFFFFF;
      color: #2C221E;
      box-shadow: 0 2px 8px rgba(44, 34, 30, 0.08);
      font-weight: 700;
    }
    .auth-card {
      width: 100%;
      box-sizing: border-box;
      background: #FFFFFF;
      border: 1px solid #EAE3DC;
      border-radius: 16px;
      padding: 36px 32px;
      box-shadow: 0 10px 30px rgba(44, 34, 30, 0.05);
    }
    .auth-card-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.5rem;
      color: #2C221E;
      margin: 0 0 6px 0;
      text-align: center;
    }
    .auth-card-desc {
      font-size: 0.88rem;
      color: #6B5B51;
      text-align: center;
      margin: 0 0 22px 0;
      line-height: 1.5;
    }
    .auth-alert {
      padding: 11px 16px;
      border-radius: 8px;
      font-size: 0.86rem;
      font-weight: 600;
      margin-bottom: 18px;
      text-align: center;
    }
    .auth-alert.error {
      background: #FEF2F2;
      color: #B91C1C;
      border: 1px solid #FCA5A5;
    }
    .auth-alert.success {
      background: #F0FDF4;
      color: #15803D;
      border: 1px solid #86EFAC;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .form-label {
      font-size: 0.84rem;
      font-weight: 600;
      color: #3D2F28;
    }
    .form-input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      min-height: 46px;
      border: 1.5px solid #E2D9D0;
      border-radius: 8px;
      font-family: var(--font-sans, sans-serif);
      font-size: 0.92rem;
      color: #2C221E;
      background: #FFFFFF;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--brand-warm-gold, #CFA874);
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.15);
    }
    .form-input.disabled {
      background: #F8F6F2;
      color: #887B72;
      cursor: not-allowed;
    }
    .form-input.otp-input {
      letter-spacing: 6px;
      font-weight: 700;
      font-size: 1.25rem;
      text-align: center;
    }
    .password-field-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .password-field-wrapper .form-input {
      padding-right: 44px;
    }
    .btn-toggle-eye {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: #8C7B70;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .btn-toggle-eye:hover {
      color: #2C221E;
    }
    .btn-text-link {
      background: none;
      border: none;
      padding: 0;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--brand-warm-gold, #CFA874);
      cursor: pointer;
      text-decoration: underline;
    }
    .btn-text-link.muted {
      color: #6B5B51;
    }
    .auth-submit-wrap {
      margin-top: 6px;
    }
    .admin-link-row {
      text-align: center;
      margin-top: 14px;
    }
    .admin-login-link {
      font-size: 0.82rem;
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 600;
      text-decoration: underline;
    }
    .auth-back-link {
      text-align: center;
      margin-top: 14px;
    }
    .auth-split-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
    }

    /* 5. Luxury Buttons */
    .btn-luxury-primary {
      background: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      border: 1px solid var(--brand-mocha-brown, #5B4636);
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(91, 70, 54, 0.15);
    }
    .btn-luxury-primary:hover:not(:disabled) {
      background: #3E2F24;
      border-color: #3E2F24;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(91, 70, 54, 0.22);
    }
    .btn-luxury-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-luxury-primary.w-full {
      width: 100%;
    }
    .btn-outline-gold {
      background: #FFFFFF;
      color: var(--brand-mocha-brown, #5B4636);
      border: 1.5px solid var(--brand-warm-gold, #CFA874);
      padding: 9px 20px;
      border-radius: 50px;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-outline-gold:hover {
      background: #FFFDF9;
      color: #2C221E;
      border-color: #5B4636;
    }
    .btn-outline-cancel {
      background: #FFFFFF;
      color: #5C4A3E;
      border: 1.5px solid #D5C9BE;
      padding: 10px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.86rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-outline-cancel:hover {
      background: #F7F5F0;
      color: #2C221E;
    }
    .btn-danger-confirm {
      background: #DC2626;
      color: #FFFFFF;
      border: 1px solid #DC2626;
      padding: 10px 22px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-danger-confirm:hover {
      background: #B91C1C;
    }

    /* 6. Authenticated Dashboard: Two-Column Layout */
    .dashboard-grid-layout {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 28px;
      align-items: start;
    }

    /* 7. Persistent Luxury Sidebar */
    .dashboard-sidebar {
      background: #FFFFFF;
      border: 1px solid #EBE4DC;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(44, 34, 30, 0.04);
      position: sticky;
      top: 24px;
    }
    .sidebar-profile-card {
      padding: 26px 20px;
      background: linear-gradient(180deg, #FFFDFB 0%, #FAF6F0 100%);
      border-bottom: 1px solid #EBE4DC;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .member-monogram-wrap {
      position: relative;
      margin-bottom: 12px;
    }
    .member-monogram {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #F2EFE8 0%, #FAF7F2 100%);
      border: 2px solid var(--brand-warm-gold, #CFA874);
      color: var(--brand-mocha-brown, #5B4636);
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.45rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(207, 168, 116, 0.25);
    }
    .status-indicator-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #10B981;
      border: 2.5px solid #FFFFFF;
    }
    .member-tier-pill {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: var(--brand-warm-gold, #CFA874);
      background: #FFFDF8;
      border: 1px solid #EEDBBE;
      padding: 3px 10px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .member-name {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.25rem;
      color: #2C221E;
      margin: 0 0 4px 0;
      font-weight: 700;
      line-height: 1.3;
    }
    .member-email {
      font-size: 0.82rem;
      color: #7A695E;
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    .sidebar-nav {
      padding: 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .sidebar-nav-item {
      width: 100%;
      background: transparent;
      border: none;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #5C4A3E;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      text-align: left;
    }
    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .nav-svg {
      color: #9C897D;
      transition: color 0.2s ease;
    }
    .sidebar-nav-item:hover {
      background: #FAF7F2;
      color: #2C221E;
    }
    .sidebar-nav-item:hover .nav-svg {
      color: var(--brand-warm-gold, #CFA874);
    }
    .sidebar-nav-item.active {
      background: #FAF5EE;
      color: #2C221E;
      font-weight: 700;
      box-shadow: inset 3px 0 0 var(--brand-warm-gold, #CFA874);
    }
    .sidebar-nav-item.active .nav-svg {
      color: var(--brand-warm-gold, #CFA874);
    }
    .nav-count-badge {
      background: #EAE3DC;
      color: #4A3B31;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
    }
    .nav-count-badge.highlight {
      background: #FEE2E2;
      color: #B91C1C;
    }

    .sidebar-footer {
      padding: 14px 14px 18px 14px;
      border-top: 1px solid #EBE4DC;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .btn-admin-console {
      background: #FFFDF8;
      border: 1px solid #EADBBE;
      color: #8A642B;
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .btn-admin-console:hover {
      background: #FAF3E6;
      color: #68481A;
    }
    .btn-sidebar-signout {
      background: #FFF8F8;
      border: 1px solid #FCD4D4;
      color: #B91C1C;
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .btn-sidebar-signout:hover {
      background: #FEE2E2;
    }

    /* 8. Right Main Content Area & Stats Overview */
    .dashboard-main-content {
      min-width: 0;
    }
    .stats-overview-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-capsule {
      background: #FFFFFF;
      border: 1px solid #EBE4DC;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 8px rgba(44, 34, 30, 0.03);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .stat-capsule:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(44, 34, 30, 0.06);
      border-color: #DDD2C7;
    }
    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap.gold {
      background: #FFFDF5;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    .stat-icon-wrap.blue {
      background: #F0F9FF;
      color: #0369A1;
      border: 1px solid #BAE6FD;
    }
    .stat-icon-wrap.sage {
      background: #F0FDF4;
      color: #15803D;
      border: 1px solid #BBF7D0;
    }
    .stat-icon-wrap.rose {
      background: #FFF1F2;
      color: #BE123C;
      border: 1px solid #FECDD3;
    }
    .stat-meta {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-size: 1.35rem;
      font-weight: 700;
      color: #2C221E;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 0.78rem;
      color: #7A695E;
      font-weight: 600;
    }

    /* 9. Pane Content Container */
    .pane-content-wrapper {
      width: 100%;
      box-sizing: border-box;
      background: #FFFFFF;
      border: 1px solid #EBE4DC;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 18px rgba(44, 34, 30, 0.04);
    }
    .content-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #F2ECE5;
      padding-bottom: 18px;
      margin-bottom: 22px;
      flex-wrap: wrap;
      gap: 14px;
    }
    .pane-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.5rem;
      color: #2C221E;
      margin: 0 0 4px 0;
      font-weight: 700;
    }
    .pane-subtitle {
      font-size: 0.88rem;
      color: #6B5B51;
      margin: 0;
    }

    /* 10. Orders Filter Bar */
    .orders-filter-bar {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;
    }
    .order-search-box {
      position: relative;
      width: 100%;
    }
    .search-svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #9C897D;
    }
    .order-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 40px 11px 42px;
      min-height: 44px;
      border: 1.5px solid #E2D9D0;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #2C221E;
      background: #FAF8F5;
      transition: all 0.2s ease;
    }
    .order-search-input:focus {
      outline: none;
      border-color: var(--brand-warm-gold, #CFA874);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.12);
    }
    .btn-clear-search {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #9C897D;
      cursor: pointer;
    }
    .status-filter-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .filter-chip {
      background: #FAF7F2;
      border: 1px solid #E2D9D0;
      padding: 7px 16px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #5C4A3E;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .filter-chip:hover {
      background: #F3EDE5;
      color: #2C221E;
    }
    .filter-chip.active {
      background: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown, #5B4636);
      font-weight: 700;
    }

    /* 11. Luxury Order Card */
    .orders-container {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .luxury-order-card {
      border: 1.5px solid #EBE4DC;
      border-radius: 14px;
      background: #FFFFFF;
      box-shadow: 0 3px 12px rgba(44, 34, 30, 0.03);
      overflow: hidden;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .luxury-order-card:hover {
      border-color: #D8CCC0;
      box-shadow: 0 6px 20px rgba(44, 34, 30, 0.06);
    }

    /* Order Header */
    .order-header-bar {
      background: #FAF7F2;
      border-bottom: 1px solid #EAE3DC;
      padding: 16px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .order-ref-group {
      display: flex;
      flex-direction: column;
    }
    .order-id {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.2rem;
      font-weight: 700;
      color: #2C221E;
    }
    .order-timestamp {
      font-size: 0.82rem;
      color: #7A695E;
      margin-top: 2px;
    }
    .order-pill-group {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .badge-payment {
      font-size: 0.74rem;
      font-weight: 700;
      padding: 4px 11px;
      border-radius: 20px;
      background: #FFFBEB;
      color: #B45309;
      border: 1px solid #FDE68A;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      letter-spacing: 0.4px;
    }
    .badge-payment.paid {
      background: #ECFDF5;
      color: #065F46;
      border-color: #A7F3D0;
    }
    .bullet-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .badge-order-status {
      font-size: 0.74rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      background: #F3F4F6;
      color: #374151;
      border: 1px solid #E5E7EB;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-order-status.delivered {
      background: #ECFDF5;
      color: #065F46;
      border-color: #A7F3D0;
    }
    .badge-order-status.shipped {
      background: #F0F9FF;
      color: #0369A1;
      border-color: #BAE6FD;
    }
    .badge-order-status.processing {
      background: #F5F3FF;
      color: #6D28D9;
      border-color: #DDD6FE;
    }
    .badge-order-status.pending {
      background: #FFFBEB;
      color: #B45309;
      border-color: #FDE68A;
    }
    .badge-order-status.cancelled {
      background: #FEF2F2;
      color: #991B1B;
      border-color: #FCA5A5;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Courier Bar */
    .courier-tracking-strip {
      background: #FFFDF7;
      border-bottom: 1px solid #FDE68A;
      padding: 11px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.86rem;
    }
    .courier-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .courier-badge {
      font-size: 0.72rem;
      font-weight: 800;
      color: #92400E;
      background: #FEF3C7;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .courier-name {
      color: #78350F;
    }
    .awb-label {
      color: #92400E;
    }
    .awb-code {
      background: #FFFFFF;
      border: 1px solid #F59E0B;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-weight: 700;
      color: #78350F;
      font-size: 0.88rem;
    }
    .btn-copy-awb {
      background: #D97706;
      color: #FFFFFF;
      border: none;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .btn-copy-awb:hover {
      background: #B45309;
    }

    /* Stepper Timeline */
    .fulfillment-stepper-wrapper {
      padding: 18px 22px 14px 22px;
      background: #FCFAF7;
      border-bottom: 1px solid #EAE3DC;
    }
    .stepper-title-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      margin-bottom: 14px;
    }
    .stepper-title {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #5C4A3E;
    }
    .stepper-stage-status {
      color: #7A695E;
    }
    .stepper-stage-status strong {
      color: #2C221E;
    }
    .stepper-track-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      position: relative;
    }
    .stepper-milestone {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
    }
    .milestone-indicator-wrap {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      margin-bottom: 8px;
    }
    .milestone-line-left, .milestone-line-right {
      flex: 1;
      height: 2px;
      background: #E5E0D8;
    }
    .milestone-line-left.invisible-spacer,
    .milestone-line-right.invisible-spacer {
      visibility: hidden;
      opacity: 0;
    }
    .stepper-milestone.completed .milestone-line-left,
    .stepper-milestone.completed .milestone-line-right {
      background: #059669;
    }
    .stepper-milestone.active .milestone-line-left {
      background: #059669;
    }
    .milestone-node {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 2px solid #D5C9BE;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .stepper-milestone.completed .milestone-node {
      background: #059669;
      border-color: #059669;
      color: #FFFFFF;
    }
    .stepper-milestone.active .milestone-node {
      border-color: var(--brand-warm-gold, #CFA874);
      background: #FFF;
      box-shadow: 0 0 0 4px rgba(207, 168, 116, 0.25);
    }
    .node-check {
      font-size: 0.72rem;
      font-weight: 800;
    }
    .node-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--brand-warm-gold, #CFA874);
    }
    .milestone-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: #2C221E;
      display: block;
    }
    .stepper-milestone:not(.completed):not(.active) .milestone-label {
      color: #8C7B70;
    }
    .milestone-date {
      font-size: 0.74rem;
      color: #7A695E;
      margin-top: 2px;
      display: block;
    }

    /* Itemized List With Thumbnails */
    .order-items-wrapper {
      padding: 20px 22px;
    }
    .items-section-heading {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 0.95rem;
      font-weight: 700;
      color: #2C221E;
      margin: 0 0 14px 0;
    }
    .items-table-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .order-item-card {
      display: flex;
      align-items: center;
      padding: 12px;
      background: #FAF8F5;
      border: 1px solid #ECE5DE;
      border-radius: 10px;
      gap: 16px;
      transition: background 0.2s ease;
    }
    .order-item-card:hover {
      background: #F7F3ED;
    }
    .item-thumbnail-wrap {
      width: 68px;
      height: 68px;
      border-radius: 8px;
      overflow: hidden;
      background: #EAE3DC;
      flex-shrink: 0;
      border: 1px solid #E2D9D0;
    }
    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-primary-meta {
      flex: 1;
      min-width: 0;
    }
    .item-title {
      font-size: 0.94rem;
      font-weight: 700;
      color: #2C221E;
      margin: 0 0 6px 0;
    }
    .item-link {
      color: #2C221E;
      text-decoration: none;
    }
    .item-link:hover {
      color: var(--brand-warm-gold, #CFA874);
      text-decoration: underline;
    }
    .item-tags {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .metal-spec-pill {
      font-size: 0.74rem;
      font-weight: 600;
      color: #5C4A3E;
      background: #FFFFFF;
      border: 1px solid #E0D6CB;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .qty-pill {
      font-size: 0.74rem;
      font-weight: 600;
      color: #5C4A3E;
      background: #FFFFFF;
      border: 1px solid #E0D6CB;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .item-actions-side {
      display: flex;
      align-items: center;
      gap: 16px;
      text-align: right;
    }
    .item-price-col {
      display: flex;
      flex-direction: column;
    }
    .item-unit-calc {
      font-size: 0.74rem;
      color: #7A695E;
    }
    .item-total-price {
      font-size: 1.05rem;
      font-weight: 700;
      color: #2C221E;
    }
    .btn-buy-again-sm {
      background: #FFFFFF;
      border: 1px solid #D5C9BE;
      color: var(--brand-mocha-brown, #5B4636);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .btn-buy-again-sm:hover {
      background: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown, #5B4636);
    }

    /* Order Footer */
    .order-card-footer {
      background: #FAF7F2;
      border-top: 1px solid #EAE3DC;
      padding: 18px 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .delivery-destination-block {
      font-size: 0.86rem;
      line-height: 1.45;
    }
    .dest-label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #7A695E;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 2px;
    }
    .dest-address {
      font-weight: 600;
      color: #2C221E;
      margin: 0;
    }
    .order-total-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-top: 1px dashed #E2D9D0;
      border-bottom: 1px dashed #E2D9D0;
    }
    .total-label {
      font-size: 0.88rem;
      font-weight: 700;
      color: #5C4A3E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .total-figure {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--brand-warm-gold, #CFA874);
      letter-spacing: -0.5px;
    }
    .order-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-footer-action {
      background: #FFFFFF;
      border: 1px solid #D5C9BE;
      color: #4A3B31;
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .btn-footer-action:hover {
      background: #F7F5F0;
      color: #2C221E;
      border-color: #2C221E;
    }
    .btn-footer-action.primary {
      background: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown, #5B4636);
      font-weight: 700;
    }
    .btn-footer-action.primary:hover {
      background: #3E2F24;
      border-color: #3E2F24;
    }

    /* 12. Shimmer Placeholders */
    .orders-shimmer-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .shimmer-order-card {
      border: 1px solid #EBE4DC;
      border-radius: 14px;
      padding: 20px;
      background: #FFFFFF;
    }
    .shimmer-line {
      height: 16px;
      border-radius: 4px;
      background: linear-gradient(90deg, #F0EAE4 25%, #FAF7F2 50%, #F0EAE4 75%);
      background-size: 200% 100%;
      animation: shimmerSweep 1.5s infinite;
      margin-bottom: 12px;
    }
    .shimmer-line.header { width: 50%; height: 22px; }
    .shimmer-line.timeline { width: 90%; height: 14px; }
    .shimmer-row { display: flex; gap: 14px; align-items: center; margin-top: 16px; }
    .shimmer-box.thumb {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      background: linear-gradient(90deg, #F0EAE4 25%, #FAF7F2 50%, #F0EAE4 75%);
      background-size: 200% 100%;
      animation: shimmerSweep 1.5s infinite;
    }
    .shimmer-stack { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .shimmer-line.text-lg { width: 70%; height: 16px; margin: 0; }
    .shimmer-line.text-sm { width: 40%; height: 12px; margin: 0; }
    @keyframes shimmerSweep {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* 13. Empty States */
    .empty-state-luxury {
      text-align: center;
      padding: 56px 24px;
      background: #FAF8F5;
      border: 1.5px dashed #E0D6CB;
      border-radius: 14px;
    }
    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #FFFDF9;
      border: 1px solid #EEDBBE;
      color: var(--brand-warm-gold, #CFA874);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px auto;
    }
    .empty-icon-wrap.rose {
      color: #BE123C;
      border-color: #FECDD3;
      background: #FFF1F2;
    }
    .empty-heading {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.4rem;
      color: #2C221E;
      margin: 0 0 6px 0;
      font-weight: 700;
    }
    .empty-desc {
      font-size: 0.92rem;
      color: #6B5B51;
      max-width: 440px;
      margin: 0 auto 22px auto;
      line-height: 1.5;
    }
    .empty-filter-state {
      text-align: center;
      padding: 36px 20px;
      background: #FAF8F5;
      border-radius: 10px;
      color: #6B5B51;
      font-size: 0.92rem;
    }
    .btn-reset-filters {
      margin-top: 10px;
      background: #FFFFFF;
      border: 1px solid #CFA874;
      color: #5B4636;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
    }

    /* 14. Saved Addresses Sub-Tab */
    .info-callout-card {
      background: #FAF7F2;
      border: 1px solid #E8E0D7;
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 22px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .callout-icon { font-size: 1.3rem; line-height: 1; }
    .callout-text { font-size: 0.88rem; color: #5C4A3E; line-height: 1.5; }
    .callout-text strong { color: #2C221E; }
    .loading-box {
      text-align: center;
      padding: 36px;
      color: #7A695E;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .spinner-inline {
      width: 18px;
      height: 18px;
      border: 2px solid #E0D6CB;
      border-top-color: var(--brand-warm-gold, #CFA874);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .address-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .address-tile-card {
      border: 1.5px solid #E2D9D0;
      border-radius: 12px;
      padding: 22px;
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .address-tile-card.is-default {
      border: 2px solid var(--brand-warm-gold, #CFA874);
      background: #FFFDF9;
      box-shadow: 0 4px 14px rgba(207, 168, 116, 0.12);
    }
    .address-tile-header {
      margin-bottom: 12px;
    }
    .badge-default-dest {
      background: var(--brand-warm-gold, #CFA874);
      color: #FFFFFF;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    .badge-saved-dest {
      background: #EAE3DC;
      color: #4A3B31;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    .addr-recipient {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.15rem;
      color: #2C221E;
      margin: 0 0 6px 0;
      font-weight: 700;
    }
    .addr-line {
      font-size: 0.88rem;
      color: #5C4A3E;
      margin: 0 0 4px 0;
      line-height: 1.45;
    }
    .addr-phone {
      font-size: 0.84rem;
      color: #4A3B31;
      margin: 10px 0 0 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .addr-card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid #F0EAE4;
      flex-wrap: wrap;
    }
    .btn-tile-action {
      background: #FAF7F2;
      border: 1px solid #E2D9D0;
      color: #2C221E;
      padding: 6px 13px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-tile-action:hover {
      background: #EBE4DC;
    }
    .btn-tile-action.delete {
      background: #FEF2F2;
      border-color: #FCA5A5;
      color: #991B1B;
    }
    .btn-tile-action.delete:hover {
      background: #FEE2E2;
    }
    .btn-tile-checkout {
      text-decoration: none;
      background: #2C221E;
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: opacity 0.2s ease;
    }
    .btn-tile-checkout:hover {
      opacity: 0.9;
    }

    /* 15. Profile & Security Sub-Tab */
    .profile-settings-dual-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }
    .luxury-form-card {
      background: #FAF8F5;
      border: 1.5px solid #EBE4DC;
      border-radius: 12px;
      padding: 24px;
    }
    .form-card-header {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 14px;
      border-bottom: 1px solid #EAE3DC;
    }
    .form-card-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .form-card-icon.gold {
      background: #FFFDF5;
      color: #B45309;
      border: 1px solid #FDE68A;
    }
    .form-card-icon.mocha {
      background: #FAF6F0;
      color: #5B4636;
      border: 1px solid #D5C9BE;
    }
    .form-card-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.15rem;
      color: #2C221E;
      margin: 0 0 2px 0;
      font-weight: 700;
    }
    .form-card-desc {
      font-size: 0.82rem;
      color: #7A695E;
      margin: 0;
      line-height: 1.4;
    }
    .luxury-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .field-hint {
      font-size: 0.74rem;
      color: #8C7B70;
      margin-top: 3px;
    }
    .form-submit-row {
      margin-top: 8px;
    }

    /* 16. Wishlist Sub-Tab */
    .wishlist-pieces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 20px;
    }
    .wishlist-tile-card {
      border: 1px solid #E2D9D0;
      border-radius: 12px;
      overflow: hidden;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      transition: all 0.2s ease;
    }
    .wishlist-tile-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(44, 34, 30, 0.08);
      border-color: #D5C9BE;
    }
    .wishlist-img-frame {
      position: relative;
      width: 100%;
      height: 200px;
      background: #FAF7F2;
      overflow: hidden;
      border-bottom: 1px solid #F0EAE4;
    }
    .wishlist-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .wishlist-tile-card:hover .wishlist-img {
      transform: scale(1.04);
    }
    .btn-remove-wishlist {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #EAE3DC;
      color: #7A695E;
      font-size: 1.2rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-remove-wishlist:hover {
      background: #DC2626;
      color: #FFFFFF;
      border-color: #DC2626;
    }
    .wishlist-tile-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .wishlist-category-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--brand-warm-gold, #CFA874);
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .wishlist-item-name {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.05rem;
      color: #2C221E;
      margin: 6px 0 8px 0;
      line-height: 1.35;
      font-weight: 700;
      min-height: 2.7em;
    }
    .wishlist-link {
      color: inherit;
      text-decoration: none;
    }
    .wishlist-link:hover {
      color: var(--brand-warm-gold, #CFA874);
      text-decoration: underline;
    }
    .wishlist-price-line {
      font-size: 1.15rem;
      font-weight: 700;
      color: #2C221E;
      margin-bottom: 14px;
    }
    .wishlist-tile-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: auto;
    }
    .btn-tile-bag {
      background: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      border: none;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: background 0.2s ease;
    }
    .btn-tile-bag:hover {
      background: #3E2F24;
    }
    .btn-tile-view {
      display: block;
      text-align: center;
      color: var(--brand-warm-gold, #CFA874);
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      padding: 4px 0;
      transition: opacity 0.2s ease;
    }
    .btn-tile-view:hover {
      text-decoration: underline;
      opacity: 0.85;
    }

    /* 17. Modals */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(44, 34, 30, 0.65);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: modalFadeIn 0.2s ease-out;
    }
    .modal-card-box {
      background: #FFFFFF;
      border-radius: 16px;
      padding: 28px;
      width: 100%;
      max-width: 520px;
      box-shadow: 0 24px 60px rgba(44, 34, 30, 0.25);
      position: relative;
      animation: modalPopIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #EBE4DC;
      padding-bottom: 12px;
    }
    .modal-header-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.35rem;
      color: #2C221E;
      margin: 0;
      font-weight: 700;
    }
    .btn-modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #887B72;
      line-height: 1;
    }
    .form-grid-two {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .luxury-checkbox {
      width: 18px;
      height: 18px;
      accent-color: var(--brand-warm-gold, #CFA874);
      cursor: pointer;
    }
    .checkbox-label {
      font-size: 0.84rem;
      color: #4A3B31;
      font-weight: 600;
      cursor: pointer;
    }
    .modal-form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 18px;
    }

    /* Sign Out Dialog */
    .signout-dialog {
      max-width: 420px;
      text-align: center;
      padding: 36px 28px 28px 28px;
    }
    .signout-icon-wrap {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FEE2E2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
    }
    .signout-title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 1.45rem;
      color: #2C221E;
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .signout-desc {
      font-size: 0.92rem;
      color: #6B5B51;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .signout-actions-row {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalPopIn {
      from { opacity: 0; transform: scale(0.94) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* ================================================================
       18. RESPONSIVE — TABLET & SMALL LAPTOPS (max-width: 991px)
       ================================================================ */
    @media (max-width: 991px) {
      .account-page-wrapper {
        padding: 20px 0 48px 0;
        overflow-x: hidden;
      }

      .dashboard-grid-layout {
        grid-template-columns: 1fr;
        gap: 18px;
      }

      .dashboard-sidebar {
        position: static;
        top: 0;
        width: 100%;
        border-radius: 14px;
      }

      /* Compact horizontal profile card */
      .sidebar-profile-card {
        flex-direction: row;
        align-items: center;
        text-align: left;
        gap: 14px;
        padding: 16px 18px;
      }
      .member-monogram-wrap {
        margin-bottom: 0;
      }
      .member-monogram {
        width: 48px;
        height: 48px;
        font-size: 1.1rem;
      }
      .member-info {
        min-width: 0;
        flex: 1;
      }
      .member-name {
        font-size: 1.08rem;
        margin: 2px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .member-email {
        font-size: 0.8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }
      .member-tier-pill {
        font-size: 0.6rem;
        padding: 2px 8px;
        letter-spacing: 0.6px;
      }

      /* Horizontal scrollable navigation tabs */
      .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
        padding: 8px 12px;
        gap: 8px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .sidebar-nav::-webkit-scrollbar {
        display: none;
      }
      .sidebar-nav-item {
        white-space: nowrap;
        padding: 9px 16px;
        border-radius: 24px;
        font-size: 0.84rem;
        min-height: 44px;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #FAF8F5;
        border: 1px solid #ECE5DE;
        color: #5C4A3E;
      }
      .sidebar-nav-item.active {
        box-shadow: 0 2px 8px rgba(91, 70, 54, 0.15);
        background: var(--brand-mocha-brown, #5B4636);
        color: #FFFFFF;
        border-color: var(--brand-mocha-brown, #5B4636);
      }
      .sidebar-nav-item.active .nav-svg {
        color: #FFFFFF;
      }
      .sidebar-nav-item.active .nav-count-badge {
        background: var(--brand-warm-gold, #CFA874);
        color: #FFFFFF;
      }
      .nav-count-badge {
        font-size: 0.7rem;
        padding: 1px 7px;
        border-radius: 10px;
        background: #E5DDD5;
        color: #5C4A3E;
      }

      /* Footer buttons: Admin Console & Sign Out */
      .sidebar-footer {
        flex-direction: row;
        padding: 10px 14px;
        gap: 10px;
        border-top: 1px solid #F0EAE4;
      }
      .btn-admin-console, .btn-sidebar-signout {
        flex: 1;
        font-size: 0.8rem;
        padding: 8px 12px;
        min-height: 40px;
        justify-content: center;
      }

      /* Quick-Stats: 2x2 grid */
      .stats-overview-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 20px;
      }
      .stat-capsule {
        padding: 14px 14px;
      }

      .content-header-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .profile-settings-dual-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    /* ================================================================
       19. RESPONSIVE — MOBILE LANDSCAPE / SMALL TABLET (max-width: 768px)
       ================================================================ */
    @media (max-width: 768px) {
      .account-page-wrapper {
        padding: 16px 0 40px 0;
      }

      .account-breadcrumb-bar {
        padding: 8px 0;
        font-size: 0.76rem;
      }
      .breadcrumb-inner {
        overflow-x: auto;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .breadcrumb-inner::-webkit-scrollbar {
        display: none;
      }

      .pane-content-wrapper {
        padding: 18px 14px;
        border-radius: 12px;
      }
      .pane-title {
        font-size: 1.25rem;
      }

      /* Search & Filters */
      .order-search-input {
        min-height: 42px;
        font-size: 0.86rem;
        padding: 10px 38px 10px 40px;
      }
      .search-svg {
        left: 12px;
        width: 17px;
        height: 17px;
      }
      .status-filter-chips {
        gap: 6px;
        padding-bottom: 4px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .status-filter-chips::-webkit-scrollbar {
        display: none;
      }
      .filter-chip {
        flex-shrink: 0;
        font-size: 0.76rem;
        padding: 6px 14px;
        min-height: 36px;
      }

      /* Order Header: Stacked and neat */
      .order-header-bar {
        flex-direction: column;
        align-items: flex-start;
        padding: 14px 16px;
        gap: 10px;
      }
      .order-id {
        font-size: 1.05rem;
      }
      .order-timestamp {
        font-size: 0.76rem;
      }
      .order-pill-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .badge-payment, .badge-order-status {
        font-size: 0.7rem;
        padding: 4px 9px;
      }

      /* Courier Strip */
      .courier-tracking-strip {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
      }
      .courier-info {
        flex-wrap: wrap;
        gap: 6px;
        font-size: 0.82rem;
      }
      .btn-copy-awb {
        font-size: 0.74rem;
        padding: 5px 12px;
        min-height: 32px;
      }

      /* Fulfillment Stepper: Linear 4-column tracker */
      .fulfillment-stepper-wrapper {
        padding: 14px 12px;
      }
      .stepper-title-row {
        font-size: 0.74rem;
        margin-bottom: 12px;
        flex-wrap: wrap;
        gap: 4px;
      }
      .stepper-track-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
      }
      .milestone-node {
        width: 20px;
        height: 20px;
      }
      .node-check {
        font-size: 0.65rem;
      }
      .node-pulse {
        width: 7px;
        height: 7px;
      }
      .milestone-label {
        font-size: 0.7rem;
        line-height: 1.25;
        margin-top: 4px;
        word-break: break-word;
      }
      .milestone-date {
        font-size: 0.62rem;
      }

      /* Item Cards: 2-row layout */
      .order-items-wrapper {
        padding: 16px 14px;
      }
      .items-section-heading {
        font-size: 0.88rem;
        margin-bottom: 10px;
      }
      .order-item-card {
        display: grid;
        grid-template-columns: 58px 1fr;
        grid-template-areas:
          "thumb meta"
          "actions actions";
        gap: 10px 12px;
        align-items: start;
        padding: 12px;
      }
      .item-thumbnail-wrap {
        grid-area: thumb;
        width: 58px;
        height: 58px;
        border-radius: 8px;
      }
      .item-primary-meta {
        grid-area: meta;
        min-width: 0;
      }
      .item-title {
        font-size: 0.88rem;
        margin-bottom: 4px;
        line-height: 1.3;
      }
      .metal-spec-pill, .qty-pill {
        font-size: 0.7rem;
        padding: 2px 7px;
      }
      .item-actions-side {
        grid-area: actions;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        border-top: 1px dashed #ECE5DE;
        width: 100%;
        box-sizing: border-box;
      }
      .item-price-col {
        text-align: left;
      }
      .item-total-price {
        font-size: 0.95rem;
      }
      .item-unit-calc {
        font-size: 0.7rem;
      }
      .btn-buy-again-sm {
        font-size: 0.74rem;
        padding: 6px 12px;
        min-height: 32px;
      }

      /* Order Card Footer */
      .order-card-footer {
        padding: 16px 14px;
        gap: 12px;
      }
      .dest-label {
        font-size: 0.74rem;
      }
      .dest-address {
        font-size: 0.84rem;
        word-break: break-word;
      }
      .order-total-block {
        padding: 10px 0;
      }
      .total-label {
        font-size: 0.8rem;
      }
      .total-figure {
        font-size: 1.3rem;
      }
      .order-actions-bar {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .btn-footer-action {
        width: 100%;
        justify-content: center;
        min-height: 44px;
        font-size: 0.82rem;
        box-sizing: border-box;
      }

      /* Address cards: 1 column */
      .address-cards-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .address-tile-card {
        padding: 16px 14px;
      }
      .addr-card-actions {
        flex-wrap: wrap;
        gap: 6px;
      }
      .btn-tile-action, .btn-tile-checkout {
        min-height: 38px;
        font-size: 0.78rem;
      }

      /* Wishlist: 2 columns */
      .wishlist-pieces-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .wishlist-img-frame {
        height: 160px;
      }
      .wishlist-item-name {
        font-size: 0.88rem;
        min-height: 2.6em;
      }
      .wishlist-price-line {
        font-size: 1.05rem;
      }
      .btn-tile-bag {
        min-height: 38px;
        font-size: 0.8rem;
        padding: 8px 12px;
      }

      /* Modal card */
      .modal-card-box {
        padding: 22px 16px;
        border-radius: 14px;
        width: 100%;
        max-width: 100%;
      }
      .form-grid-two {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }

    /* ================================================================
       20. RESPONSIVE — MOBILE PORTRAIT (max-width: 576px)
       ================================================================ */
    @media (max-width: 576px) {
      .account-page-wrapper {
        padding: 12px 0 32px 0;
      }

      /* Breadcrumb */
      .account-breadcrumb-bar {
        padding: 6px 0;
        font-size: 0.72rem;
      }
      .breadcrumb-sub {
        display: none;
      }

      /* Auth view (Sign In / Register / Forgot) */
      .auth-viewport {
        padding: 10px 0;
        width: 100%;
        box-sizing: border-box;
      }
      .auth-main-title {
        font-size: 1.48rem;
      }
      .auth-main-subtitle {
        font-size: 0.82rem;
      }
      .auth-segmented-nav {
        padding: 3px;
        gap: 3px;
      }
      .auth-segment-btn {
        padding: 10px 8px;
        font-size: 0.82rem;
        min-height: 42px;
      }
      .auth-card {
        padding: 22px 14px;
        border-radius: 12px;
        box-sizing: border-box;
      }
      .auth-card-title {
        font-size: 1.2rem;
      }
      .form-input {
        font-size: 16px; /* Prevents auto-zoom on iOS */
        min-height: 44px;
        padding: 10px 12px;
      }
      .btn-luxury-primary {
        min-height: 46px;
        font-size: 0.86rem;
      }

      /* Sidebar & Monogram Card */
      .dashboard-sidebar {
        border-radius: 12px;
        padding: 10px 8px;
      }
      .sidebar-profile-card {
        padding: 10px 8px 12px 8px;
        gap: 10px;
      }
      .member-monogram {
        width: 42px;
        height: 42px;
        font-size: 1rem;
      }
      .status-indicator-badge {
        width: 11px;
        height: 11px;
        border-width: 2px;
      }
      .member-name {
        font-size: 0.98rem;
      }
      .member-email {
        font-size: 0.74rem;
        max-width: 180px;
      }
      .member-tier-pill {
        font-size: 0.58rem;
        letter-spacing: 0.6px;
        padding: 2px 6px;
      }

      /* Navigation tabs: sleek horizontal pills with readable labels */
      .sidebar-nav {
        padding: 4px 2px 8px 2px;
        gap: 6px;
      }
      .sidebar-nav-item {
        padding: 8px 12px;
        font-size: 0.78rem;
        min-height: 40px;
        border-radius: 20px;
      }
      .sidebar-nav-item .nav-svg {
        width: 16px;
        height: 16px;
      }
      .nav-count-badge {
        font-size: 0.65rem;
        padding: 1px 5px;
      }

      /* Footer buttons */
      .sidebar-footer {
        padding: 8px 4px 4px 4px;
        gap: 6px;
      }
      .btn-admin-console, .btn-sidebar-signout {
        font-size: 0.74rem;
        padding: 7px 8px;
        min-height: 38px;
      }

      /* Quick Stats Grid: Compact 2x2 */
      .stats-overview-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 14px;
      }
      .stat-capsule {
        padding: 10px 8px;
        gap: 8px;
        border-radius: 8px;
      }
      .stat-icon-wrap {
        width: 32px;
        height: 32px;
        border-radius: 6px;
      }
      .stat-icon-wrap svg {
        width: 15px;
        height: 15px;
      }
      .stat-number {
        font-size: 1.05rem;
      }
      .stat-label {
        font-size: 0.65rem;
        letter-spacing: 0.3px;
      }

      /* Pane Content */
      .pane-content-wrapper {
        padding: 14px 10px;
        border-radius: 10px;
      }
      .content-header-row {
        padding-bottom: 12px;
        margin-bottom: 14px;
        gap: 8px;
      }
      .pane-title {
        font-size: 1.15rem;
      }
      .pane-subtitle {
        font-size: 0.78rem;
      }
      .btn-outline-gold {
        font-size: 0.76rem;
        padding: 6px 12px;
        min-height: 36px;
      }

      /* Order Header */
      .order-header-bar {
        padding: 12px 10px;
      }
      .order-id {
        font-size: 0.96rem;
      }
      .order-timestamp {
        font-size: 0.72rem;
      }
      .badge-payment, .badge-order-status {
        font-size: 0.66rem;
        padding: 3px 7px;
      }

      /* Fulfillment Stepper: Linear 4-column tracker */
      .fulfillment-stepper-wrapper {
        padding: 12px 8px;
      }
      .stepper-title-row {
        font-size: 0.7rem;
        margin-bottom: 10px;
      }
      .milestone-node {
        width: 18px;
        height: 18px;
      }
      .node-check {
        font-size: 0.6rem;
      }
      .node-pulse {
        width: 6px;
        height: 6px;
      }
      .milestone-label {
        font-size: 0.65rem;
        font-weight: 700;
        line-height: 1.2;
        margin-top: 3px;
      }
      .milestone-date {
        font-size: 0.58rem;
      }

      /* Item Cards */
      .order-items-wrapper {
        padding: 12px 10px;
      }
      .order-item-card {
        grid-template-columns: 52px 1fr;
        gap: 8px 10px;
        padding: 10px 8px;
      }
      .item-thumbnail-wrap {
        width: 52px;
        height: 52px;
      }
      .item-title {
        font-size: 0.84rem;
      }
      .metal-spec-pill, .qty-pill {
        font-size: 0.66rem;
        padding: 1px 5px;
      }
      .item-total-price {
        font-size: 0.9rem;
      }
      .btn-buy-again-sm {
        font-size: 0.72rem;
        padding: 5px 10px;
      }

      /* Order Footer */
      .order-card-footer {
        padding: 12px 10px;
        gap: 10px;
      }
      .dest-label {
        font-size: 0.7rem;
      }
      .dest-address {
        font-size: 0.8rem;
      }
      .total-label {
        font-size: 0.76rem;
      }
      .total-figure {
        font-size: 1.2rem;
      }
      .btn-footer-action {
        font-size: 0.78rem;
        padding: 9px 12px;
        min-height: 42px;
      }

      /* Wishlist */
      .wishlist-pieces-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      .wishlist-img-frame {
        height: 145px;
      }
      .wishlist-tile-body {
        padding: 10px 8px;
      }
      .wishlist-category-tag {
        font-size: 0.64rem;
      }
      .wishlist-item-name {
        font-size: 0.82rem;
        min-height: 2.5em;
      }
      .wishlist-price-line {
        font-size: 0.95rem;
        margin-bottom: 8px;
      }
      .btn-tile-bag {
        padding: 8px 8px;
        font-size: 0.76rem;
        min-height: 38px;
      }

      /* Modals: bottom-sheet design */
      .modal-backdrop {
        padding: 8px;
        align-items: flex-end;
      }
      .modal-card-box {
        padding: 18px 14px;
        border-radius: 16px 16px 8px 8px;
        max-height: 90vh;
        overflow-y: auto;
      }
      .modal-header-title {
        font-size: 1.1rem;
      }
      .modal-form-actions {
        flex-direction: column-reverse;
        gap: 8px;
      }
      .modal-form-actions button {
        width: 100%;
        min-height: 44px;
      }

      /* Signout Dialog */
      .signout-dialog {
        padding: 24px 16px 20px 16px;
        border-radius: 14px;
        margin: auto;
      }
      .signout-title {
        font-size: 1.2rem;
      }
      .signout-desc {
        font-size: 0.84rem;
        margin-bottom: 18px;
      }
      .signout-actions-row {
        flex-direction: column-reverse;
        gap: 8px;
        width: 100%;
      }
      .signout-actions-row button {
        width: 100%;
        min-height: 44px;
      }

      /* Toast Notification */
      .account-toast {
        top: 10px;
        right: 10px;
        left: 10px;
        border-radius: 8px;
        font-size: 0.8rem;
        padding: 10px 14px;
      }
    }

    /* ================================================================
       21. RESPONSIVE — ULTRA COMPACT MOBILE (max-width: 400px)
       ================================================================ */
    @media (max-width: 400px) {
      .container {
        padding-left: 8px;
        padding-right: 8px;
      }
      .sidebar-profile-card {
        padding: 8px 6px;
        gap: 8px;
      }
      .member-monogram {
        width: 36px;
        height: 36px;
        font-size: 0.9rem;
      }
      .member-name {
        font-size: 0.9rem;
      }
      .member-email {
        font-size: 0.7rem;
        max-width: 150px;
      }
      .sidebar-nav-item {
        padding: 7px 10px;
        font-size: 0.74rem;
      }
      .stats-overview-grid {
        gap: 6px;
      }
      .stat-capsule {
        padding: 8px 6px;
        gap: 6px;
      }
      .stat-icon-wrap {
        width: 28px;
        height: 28px;
      }
      .stat-icon-wrap svg {
        width: 14px;
        height: 14px;
      }
      .stat-number {
        font-size: 0.96rem;
      }
      .stat-label {
        font-size: 0.58rem;
      }

      /* Wishlist becomes 1 clean column on ultra-narrow screens */
      .wishlist-pieces-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .wishlist-img-frame {
        height: 180px;
      }

      /* Stepper compact */
      .milestone-label {
        font-size: 0.6rem;
      }
      .milestone-date {
        font-size: 0.54rem;
      }

      /* Order items */
      .order-item-card {
        grid-template-columns: 46px 1fr;
        padding: 8px 6px;
      }
      .item-thumbnail-wrap {
        width: 46px;
        height: 46px;
      }
      .item-title {
        font-size: 0.8rem;
      }
      .btn-footer-action {
        font-size: 0.76rem;
        padding: 8px 10px;
      }
    }
  `]
})
export class AccountComponent implements OnInit, OnDestroy {
  defaultImage = '/assets/images/placeholder-jewellery.svg';
  activeTab: 'login' | 'register' | 'forgot' | 'dashboard' = 'login';
  dashSubTab: 'orders' | 'addresses' | 'profile' | 'wishlist' = 'orders';

  loginEmail: string = '';
  loginPassword: string = '';
  showLoginPassword: boolean = false;
  loginError: string = '';

  regName: string = '';
  regEmail: string = '';
  regPassword: string = '';
  showRegisterPassword: boolean = false;
  registerError: string = '';

  // Forgot password OTP flow
  forgotStep: 1 | 2 = 1;
  forgotEmail: string = '';
  forgotOtp: string = '';
  newPassword: string = '';
  showResetPassword: boolean = false;
  forgotError: string = '';
  forgotSuccess: string = '';
  otpLoading: boolean = false;

  currentUser: any = null;
  showLogoutModal: boolean = false;

  // Toast State
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Customer Dashboard State
  myOrders: any[] = [];
  savedAddresses: any[] = [];
  wishlistItems: ProductCardData[] = [];
  isLoadingOrders: boolean = false;
  isLoadingAddresses: boolean = false;

  // Search & Filter State
  searchTerm: string = '';
  selectedStatusFilter: string = 'ALL';

  // Saved Address Form Modal State
  showAddressModal: boolean = false;
  editingAddress: any = null;
  addressForm = {
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  };

  // Profile Form State
  profileForm = {
    name: '',
    phone: ''
  };
  profileSuccessMsg: string = '';
  profileErrorMsg: string = '';

  // Password Security Form State
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordSuccessMsg: string = '';
  passwordErrorMsg: string = '';

  private wishlistSub?: Subscription;

  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // ── Computed Getters ──
  get userInitials(): string {
    if (!this.currentUser?.name) return 'AT';
    const parts = this.currentUser.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  get orderStats() {
    const total = this.myOrders.length;
    const inTransit = this.myOrders.filter(o => {
      const st = (o.order_status || o.status || '').toUpperCase();
      return st === 'PENDING' || st === 'PROCESSING' || st === 'SHIPPED';
    }).length;
    const delivered = this.myOrders.filter(o => (o.order_status || o.status || '').toUpperCase() === 'DELIVERED').length;
    return { total, inTransit, delivered };
  }

  get filteredOrders(): any[] {
    let list = this.myOrders || [];

    // Filter by status
    if (this.selectedStatusFilter && this.selectedStatusFilter !== 'ALL') {
      list = list.filter(o => {
        const st = (o.order_status || o.status || '').toUpperCase();
        if (this.selectedStatusFilter === 'ACTIVE') {
          return st === 'PENDING' || st === 'PROCESSING' || st === 'SHIPPED';
        }
        return st === this.selectedStatusFilter;
      });
    }

    // Filter by search term
    if (this.searchTerm && this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      list = list.filter(o => {
        const orderNum = (o.order_number || o.number || '').toLowerCase();
        const courier = (o.courier_name || '').toLowerCase();
        const awb = (o.tracking_code || '').toLowerCase();
        const itemMatch = (o.items || []).some((it: any) =>
          (it.product_name || '').toLowerCase().includes(q)
        );
        return orderNum.includes(q) || courier.includes(q) || awb.includes(q) || itemMatch;
      });
    }

    return list;
  }

  async ngOnInit(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.authService.currentUser();
      this.activeTab = 'dashboard';
      this.initProfileForm();
      this.loadMyOrders();
      this.loadSavedAddresses();
      this.loadWishlist();
      await this.refreshUserProfile();
    }

    // Subscribe to real Wishlist changes
    this.wishlistSub = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  async refreshUserProfile(): Promise<void> {
    try {
      const token = this.authService.getToken();
      if (!token) return;
      const res = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        this.authService.updateCurrentUser(data.data);
        this.currentUser = this.authService.currentUser();
        this.initProfileForm();
        this.cdr.detectChanges();
      }
    } catch (err) {
      // Non-blocking
    }
  }

  initProfileForm(): void {
    if (this.currentUser) {
      this.profileForm.name = this.currentUser.name || '';
      this.profileForm.phone = this.currentUser.phone || '';
    }
  }

  showToast(msg: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }

  onAddressPincodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 6);
    this.addressForm.pincode = digitsOnly;
    input.value = digitsOnly;
  }

  copyToClipboard(text: string, notification: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.showToast(notification, 'success');
    }
  }

  clearOrderFilters(): void {
    this.searchTerm = '';
    this.selectedStatusFilter = 'ALL';
    this.cdr.detectChanges();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.defaultImage) {
      img.src = this.defaultImage;
    }
  }

  // ── Load Real Customer Orders ──
  async loadMyOrders(): Promise<void> {
    if (!this.currentUser) return;
    this.isLoadingOrders = true;
    this.cdr.detectChanges();

    try {
      const token = this.authService.getToken();
      const email = this.currentUser.email;
      const res = await fetch(`${API_ENDPOINTS.ORDERS.MY_ORDERS}?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        this.myOrders = data.data;
      } else {
        this.myOrders = [];
      }
    } catch (err) {
      this.myOrders = [];
    } finally {
      this.isLoadingOrders = false;
      this.cdr.detectChanges();
    }
  }

  getInvoicePdfUrl(order: any): string {
    const num = order?.order_number || order?.number || order?.id || '';
    return API_ENDPOINTS.ORDERS.INVOICE_PDF(num);
  }

  // ── Buy Piece Again ──
  async buyAgain(item: any): Promise<void> {
    const product: ProductCardData = {
      id: item.product_id,
      name: item.product_name,
      price: Number(item.unit_price) || 0,
      slug: item.product_slug || '',
      image: item.product_image || this.defaultImage,
      category: 'Jewellery',
      inStock: true,
      available: true
    };
    await this.cartService.addToCart(product, 1, item.metal_type || '18K Warm Gold');
    this.showToast(`"${item.product_name}" added to your Shopping Bag!`, 'success');
  }

  // ── Reorder Entire Order ──
  async reorderAll(order: any): Promise<void> {
    if (!order.items || order.items.length === 0) return;
    for (const item of order.items) {
      const product: ProductCardData = {
        id: item.product_id,
        name: item.product_name,
        price: Number(item.unit_price) || 0,
        slug: item.product_slug || '',
        image: item.product_image || this.defaultImage,
        category: 'Jewellery',
        inStock: true,
        available: true
      };
      await this.cartService.addToCart(product, item.quantity || 1, item.metal_type || '18K Warm Gold');
    }
    this.showToast(`All pieces from Order #${order.order_number || order.number} added to your Bag!`, 'success');
  }

  // ── Load Saved Addresses ──
  async loadSavedAddresses(): Promise<void> {
    if (!this.currentUser) return;
    this.isLoadingAddresses = true;
    this.cdr.detectChanges();

    try {
      const token = this.authService.getToken();
      const email = this.currentUser.email;
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES.LIST}?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        this.savedAddresses = data.data;
      } else {
        this.savedAddresses = [];
      }
    } catch (err) {
      this.savedAddresses = [];
    } finally {
      this.isLoadingAddresses = false;
      this.cdr.detectChanges();
    }
  }

  // ── Load Real Saved Wishlist ──
  async loadWishlist(): Promise<void> {
    await this.wishlistService.refreshFromApi();
    this.wishlistItems = this.wishlistService.getWishlist();
    this.cdr.detectChanges();
  }

  addToBagFromWishlist(item: ProductCardData): void {
    this.cartService.addToCart(item, 1, '18K Warm Gold');
    this.showToast(`"${item.name}" added to your Shopping Bag!`, 'success');
  }

  removeFromWishlist(item: ProductCardData): void {
    this.wishlistService.removeFromWishlist(item.slug || item.id);
    this.showToast(`"${item.name}" removed from Wishlist.`, 'success');
  }

  async moveAllWishlistToBag(): Promise<void> {
    if (!this.wishlistItems.length) return;
    for (const item of this.wishlistItems) {
      await this.cartService.addToCart(item, 1, '18K Warm Gold');
    }
    this.showToast('All wishlist pieces added to your Shopping Bag!', 'success');
  }

  // ── Address Modal Actions ──
  openAddressModal(): void {
    this.editingAddress = null;
    this.addressForm = {
      fullName: this.currentUser?.name || '',
      phone: this.currentUser?.phone || '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: this.savedAddresses.length === 0
    };
    this.showAddressModal = true;
    this.cdr.detectChanges();
  }

  editAddressItem(addr: any): void {
    this.editingAddress = addr;
    this.addressForm = {
      fullName: addr.full_name || addr.fullName || '',
      phone: addr.phone || '',
      addressLine: addr.address_line || addr.addressLine || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: Boolean(addr.is_default || addr.isDefault)
    };
    this.showAddressModal = true;
    this.cdr.detectChanges();
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    this.editingAddress = null;
    this.cdr.detectChanges();
  }

  onPhoneInput(event: Event, targetForm: 'profile' | 'address'): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    if (targetForm === 'profile') {
      this.profileForm.phone = digitsOnly;
    } else {
      this.addressForm.phone = digitsOnly;
    }
    input.value = digitsOnly;
  }

  async saveAddressSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const { fullName, phone, addressLine, city, state, pincode, isDefault } = this.addressForm;

    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      this.showToast('Please fill in all required address fields.', 'error');
      return;
    }

    const cleanPin = String(pincode).replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPin)) {
      this.showToast('PIN Code must be exactly 6 digits (e.g. 395003).', 'error');
      return;
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      this.showToast('Please enter a valid 10-digit mobile number (e.g. 9876543210).', 'error');
      return;
    }

    try {
      const token = this.authService.getToken();
      const payload = {
        fullName,
        phone,
        addressLine,
        city,
        state,
        pincode,
        isDefault,
        email: this.currentUser.email
      };

      const url = this.editingAddress
        ? API_ENDPOINTS.ADDRESSES.UPDATE(this.editingAddress.id)
        : API_ENDPOINTS.ADDRESSES.CREATE;
      const method = this.editingAddress ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.showToast(data.message || 'Address saved successfully!', 'success');
        this.closeAddressModal();
        this.loadSavedAddresses();
      } else {
        this.showToast(data.message || 'Failed to save address.', 'error');
      }
    } catch (err) {
      this.showToast('Failed to save address. Please check your connection.', 'error');
    }
  }

  async setAddressAsDefault(addr: any): Promise<void> {
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADDRESSES.SET_DEFAULT(addr.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ email: this.currentUser.email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.showToast('Default address updated!', 'success');
        this.loadSavedAddresses();
      }
    } catch (err) {}
  }

  async deleteAddressItem(id: number | string): Promise<void> {
    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.ADDRESSES.DELETE(id), {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.showToast('Address removed successfully.', 'success');
        this.loadSavedAddresses();
      }
    } catch (err) {}
  }

  // ── Profile Update Submit ──
  async onUpdateProfileSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.profileSuccessMsg = '';
    this.profileErrorMsg = '';

    if (!this.profileForm.name || !this.profileForm.name.trim()) {
      this.profileErrorMsg = 'Full Name cannot be empty.';
      return;
    }

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: this.profileForm.name.trim(),
          phone: this.profileForm.phone ? this.profileForm.phone.trim() : '',
          email: this.currentUser.email
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.profileSuccessMsg = 'Profile details updated successfully!';
        if (data.data) {
          this.authService.updateCurrentUser(data.data);
          this.currentUser = this.authService.currentUser();
          this.initProfileForm();
        }
        this.showToast('Profile updated!', 'success');
      } else {
        this.profileErrorMsg = data.message || 'Profile update failed.';
      }
    } catch (err) {
      this.profileErrorMsg = 'Failed to update profile. Please try again.';
    } finally {
      this.cdr.detectChanges();
    }
  }

  // ── Change Password Submit ──
  async onChangePasswordSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.passwordSuccessMsg = '';
    this.passwordErrorMsg = '';

    const { oldPassword, newPassword, confirmPassword } = this.passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      this.passwordErrorMsg = 'Please fill in all password fields.';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.passwordErrorMsg = 'New password and confirm password do not match.';
      return;
    }
    if (newPassword.length < 6) {
      this.passwordErrorMsg = 'New password must be at least 6 characters long.';
      return;
    }

    try {
      const token = this.authService.getToken();
      const res = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          email: this.currentUser.email
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.passwordSuccessMsg = 'Password updated successfully!';
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.showToast('Password updated successfully!', 'success');
      } else {
        this.passwordErrorMsg = data.message || 'Current password incorrect.';
      }
    } catch (err) {
      this.passwordErrorMsg = 'Failed to update password.';
    } finally {
      this.cdr.detectChanges();
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
    this.cartService.clearCart();
    this.currentUser = null;
    this.activeTab = 'login';
  }

  async onLoginSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.loginError = '';

    const cleanEmail = (this.loginEmail || '').trim();
    const cleanPassword = (this.loginPassword || '').trim();

    if (!cleanEmail && !cleanPassword) {
      this.loginError = 'Please enter your email address and password.';
      this.cdr.detectChanges();
      return;
    }
    if (!cleanEmail) {
      this.loginError = 'Please enter your email address.';
      this.cdr.detectChanges();
      return;
    }
    if (!cleanPassword) {
      this.loginError = 'Please enter your password.';
      this.cdr.detectChanges();
      return;
    }

    try {
      const res = await this.authService.login(cleanEmail, cleanPassword);
      if (res.success && res.user) {
        this.currentUser = res.user;
        if (res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.activeTab = 'dashboard';
          this.initProfileForm();
          this.loadMyOrders();
          this.loadSavedAddresses();
          this.loadWishlist();
        }
      } else {
        this.loginError = res.message || 'Invalid email or password.';
      }
    } catch (err: any) {
      this.loginError = err?.message || 'An error occurred during sign in.';
    } finally {
      this.cdr.detectChanges();
    }
  }

  async onRegisterSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.registerError = '';

    const cleanName = (this.regName || '').trim();
    const cleanEmail = (this.regEmail || '').trim();
    const cleanPassword = (this.regPassword || '').trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      this.registerError = 'Please fill in all required fields (Full Name, Email Address, and Password).';
      this.cdr.detectChanges();
      return;
    }

    try {
      const res = await this.authService.register(cleanName, cleanEmail, cleanPassword);
      if (res.success && res.user) {
        this.currentUser = res.user;
        this.activeTab = 'dashboard';
        this.initProfileForm();
        this.loadMyOrders();
        this.loadSavedAddresses();
        this.loadWishlist();
      } else {
        this.registerError = res.message || 'Registration failed.';
      }
    } catch (err: any) {
      this.registerError = err?.message || 'An error occurred during registration.';
    } finally {
      this.cdr.detectChanges();
    }
  }

  async onRequestOtpSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.forgotError = '';
    this.forgotSuccess = '';

    const cleanEmail = (this.forgotEmail || '').trim();
    if (!cleanEmail) {
      this.forgotError = 'Please enter your registered email address.';
      this.cdr.detectChanges();
      return;
    }

    this.otpLoading = true;
    this.cdr.detectChanges();

    try {
      const res = await this.authService.requestPasswordResetOtp(cleanEmail);
      if (res.success) {
        this.forgotSuccess = res.message;
        this.forgotStep = 2;
      } else {
        this.forgotError = res.message || 'Failed to send verification code.';
      }
    } catch (err: any) {
      this.forgotError = err?.message || 'An error occurred while sending code.';
    } finally {
      this.otpLoading = false;
      this.cdr.detectChanges();
    }
  }

  async onResetPasswordSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.forgotError = '';
    this.forgotSuccess = '';

    const cleanEmail = (this.forgotEmail || '').trim();
    const cleanOtp = (this.forgotOtp || '').trim();
    const cleanNewPassword = (this.newPassword || '').trim();

    if (!cleanOtp) {
      this.forgotError = 'Please enter the 6-digit verification code.';
      this.cdr.detectChanges();
      return;
    }
    if (!cleanNewPassword) {
      this.forgotError = 'Please enter your new password.';
      this.cdr.detectChanges();
      return;
    }

    this.otpLoading = true;
    this.cdr.detectChanges();

    try {
      const res = await this.authService.resetPasswordWithOtp(cleanEmail, cleanOtp, cleanNewPassword);
      if (res.success) {
        this.forgotSuccess = res.message;
        this.loginEmail = cleanEmail;
        this.loginPassword = cleanNewPassword;
        this.loginError = '';
        setTimeout(() => {
          this.activeTab = 'login';
          this.loginError = 'Password reset successfully! Please sign in with your new password.';
          this.forgotStep = 1;
          this.forgotOtp = '';
          this.newPassword = '';
          this.forgotSuccess = '';
          this.cdr.detectChanges();
        }, 1500);
      } else {
        this.forgotError = res.message || 'Failed to reset password.';
      }
    } catch (err: any) {
      this.forgotError = err?.message || 'An error occurred while resetting password.';
    } finally {
      this.otpLoading = false;
      this.cdr.detectChanges();
    }
  }
}
