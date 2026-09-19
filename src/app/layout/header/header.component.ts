import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavItem } from '../../core/models/ui.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Main Navigation Header -->
    <header class="site-header">
      <div class="container header-content">
        <!-- Mobile Menu Toggle Button -->
        <button type="button" class="mobile-toggle" (click)="toggleMobileNav()" aria-label="Toggle navigation menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Brand Logo (Icon + Full Brand Mark) -->
        <a routerLink="/" class="brand-logo" aria-label="Arista Trinkets Home"><img src="/assets/images/logo-icon.jpeg" alt="Arista Monogram Icon" class="brand-logo-icon" width="60" height="60" ngSkipOversizedImageWarning /><img src="/assets/images/logo.jpeg" alt="Arista Trinkets Jewellery" class="brand-logo-img" width="220" height="80" ngSkipOversizedImageWarning /></a>

        <!-- Desktop Navigation Bar -->
        <nav class="desktop-nav">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: item.path === '/'}"
            class="nav-link"
          >
            {{ item.label }}
          </a>
        </nav>

        <!-- Action Icons (Search, Account, Bag) -->
        <div class="header-actions">
          <button type="button" class="action-btn" aria-label="Search items">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <a routerLink="/account" class="action-btn" aria-label="Customer Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>

          <a routerLink="/cart" class="action-btn bag-btn" aria-label="Shopping Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="bag-count">{{ cartCount }}</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-drawer" [class.open]="isMobileNavOpen">
      <div class="drawer-header">
        <img src="/assets/images/logo.jpeg" alt="Arista Trinkets" class="drawer-logo-img" width="120" height="80" ngSkipOversizedImageWarning />
        <button type="button" class="close-btn" (click)="toggleMobileNav()" aria-label="Close menu">&times;</button>
      </div>
      <nav class="mobile-nav">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.path"
          (click)="toggleMobileNav()"
          class="mobile-nav-link"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
    <div class="drawer-backdrop" *ngIf="isMobileNavOpen" (click)="toggleMobileNav()"></div>
  `,
  styles: [`
    .announcement-bar {
      background-color: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
      text-align: center;
      padding: 7px 12px;
      border-bottom: 1px solid rgba(207, 168, 116, 0.25);
    }

    .announcement-text {
      font-size: var(--font-size-announcement);
      letter-spacing: 0.6px;
      text-transform: uppercase;
      font-weight: 500;
      line-height: 1.35;
      margin: 0;
    }

    .site-header {
      background-color: #FFFFFF;
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(91, 70, 54, 0.03);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    @media (min-width: 992px) {
      .header-content {
        height: 84px;
      }
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 0;
      text-decoration: none;
    }

    .brand-logo-icon {
      height: 48px;
      width: auto;
      object-fit: contain;
      mix-blend-mode: multiply;
      border-radius: 50%;
      position: relative;
      z-index: 2;
    }

    .brand-logo-img {
      height: 54px;
      width: auto;
      object-fit: contain;
      mix-blend-mode: multiply;
      margin-left: -14px;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 768px) {
      .brand-logo-icon {
        height: 56px;
      }
      .brand-logo-img {
        height: 64px;
        margin-left: -18px;
      }
    }

    .mobile-toggle {
      background: transparent;
      border: none;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }

    .desktop-nav {
      display: none;
      gap: 28px;
    }

    @media (min-width: 768px) {
      .desktop-nav { display: flex; }
      .mobile-toggle { display: none !important; }
    }

    .nav-link {
      font-family: var(--font-sans);
      font-size: var(--font-size-nav);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
      padding: 8px 0;
      position: relative;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--brand-warm-gold);
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--brand-warm-gold);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    @media (min-width: 768px) {
      .header-actions {
        gap: 8px;
      }
    }

    .action-btn {
      background: transparent;
      border: none;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      position: relative;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all var(--transition-fast);
    }

    .action-btn:hover {
      color: var(--brand-warm-gold);
      background-color: var(--brand-pearl-beige);
    }

    .bag-count {
      position: absolute;
      top: 6px;
      right: 4px;
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-size: 0.65rem;
      font-weight: 700;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-toggle {
      background: transparent;
      border: none;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
    }

    .mobile-toggle:hover {
      background-color: var(--brand-pearl-beige);
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 290px;
      max-width: 85vw;
      height: 100vh;
      background-color: #FFFFFF;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform var(--transition-normal);
      padding: var(--space-lg);
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    }

    .mobile-drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      padding-bottom: var(--space-sm);
      border-bottom: 1px solid var(--color-border);
    }

    .drawer-logo {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--brand-mocha-brown);
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 2rem;
      color: var(--brand-mocha-brown);
      cursor: pointer;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .mobile-nav-link {
      font-size: 0.95rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
      padding: 12px 0;
      border-bottom: 1px solid var(--brand-pearl-beige);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .mobile-nav-link:hover {
      color: var(--brand-warm-gold);
    }

    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.45);
      z-index: 199;
      backdrop-filter: blur(2px);
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMobileNavOpen: boolean = false;
  cartCount: number = 0;
  private cartSub!: Subscription;

  navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  private cartService = inject(CartService);

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(summary => {
      this.cartCount = summary.itemCount;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }
}
