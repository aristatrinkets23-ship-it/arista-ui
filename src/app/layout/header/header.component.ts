import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavItem } from '../../core/models/ui.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistModalComponent } from '../../shared/components/wishlist-modal/wishlist-modal.component';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardData } from '../../core/models/product-card-data.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, WishlistModalComponent],

  template: `
    <!-- Main Navigation Header -->
    <header class="site-header">
      <div class="container header-content">
        <!-- Mobile Menu Toggle Button -->
        <button type="button" class="mobile-toggle" (click)="toggleMobileNav()" aria-label="Toggle navigation menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Brand Logo (Unified Emblem + Brand Mark) -->
        <a routerLink="/" class="brand-logo" aria-label="Arista Trinkets Home">
          <img src="/assets/images/full-logo-transparent.webp" alt="Arista Trinkets Fine Jewellery" class="brand-logo-img" width="168" height="52" ngSkipOversizedImageWarning />
        </a>

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

        <!-- Action Icons (Favorites, Account, Bag) -->
        <div class="header-actions">
          <!-- Favorites Heart Link -->
          <a routerLink="/wishlist" class="action-btn" aria-label="View Favorites / Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="wishlistItems.length > 0 ? '#D97706' : 'none'" [attr.stroke]="wishlistItems.length > 0 ? '#D97706' : 'currentColor'" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="bag-count" *ngIf="wishlistItems.length > 0">{{ wishlistItems.length }}</span>
          </a>


          <a routerLink="/account" class="action-btn" aria-label="Customer Account">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </a>

          <a routerLink="/cart" class="action-btn bag-btn" aria-label="Shopping Bag">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="bag-count" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </a>
        </div>
      </div>
    </header>


    <!-- Mobile Drawer Overlay -->
    <div class="mobile-drawer" [class.open]="isMobileNavOpen">
      <div class="drawer-header">
        <a routerLink="/" (click)="toggleMobileNav()" class="drawer-logo" aria-label="Arista Trinkets Home">
          <img src="/assets/images/full-logo-transparent.webp" alt="Arista Trinkets Fine Jewellery" class="drawer-logo-img" width="140" height="44" ngSkipOversizedImageWarning />
        </a>
        <button type="button" class="close-btn" (click)="toggleMobileNav()" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="drawer-body">
        <span class="drawer-section-title">Navigation Menu</span>
        <nav class="mobile-nav">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.path"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: item.path === '/'}"
            (click)="toggleMobileNav()"
            class="mobile-nav-link"
          >
            <span>{{ item.label }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </nav>

        <div class="drawer-collections">
          <span class="drawer-section-title">Curated Collections</span>
          <div class="collection-tags">
            <a routerLink="/shop" [queryParams]="{ category: 'rings' }" (click)="toggleMobileNav()" class="tag-pill">Rings</a>
            <a routerLink="/shop" [queryParams]="{ category: 'necklaces' }" (click)="toggleMobileNav()" class="tag-pill">Necklaces</a>
            <a routerLink="/shop" [queryParams]="{ category: 'earrings' }" (click)="toggleMobileNav()" class="tag-pill">Earrings</a>
            <a routerLink="/shop" [queryParams]="{ category: 'bracelets' }" (click)="toggleMobileNav()" class="tag-pill">Bracelets</a>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <div class="drawer-actions">
          <a routerLink="/account" (click)="toggleMobileNav()" class="drawer-action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Account</span>
          </a>
          <a routerLink="/cart" (click)="toggleMobileNav()" class="drawer-action-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Bag {{ cartCount > 0 ? '(' + cartCount + ')' : '' }}</span>
          </a>
        </div>
        <p class="drawer-tagline">Arista Trinkets &bull; Demi Fine, Anti Tarnish Jewellery</p>
      </div>
    </div>
    <div class="drawer-backdrop" *ngIf="isMobileNavOpen" (click)="toggleMobileNav()"></div>

    <!-- Favorites / Wishlist Modal Component -->
    <app-wishlist-modal
      *ngIf="isWishlistOpen"
      [items]="wishlistItems"
      (closed)="isWishlistOpen = false"
    ></app-wishlist-modal>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
    }

    .site-header {
      background-color: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(207, 168, 116, 0.25);
      box-shadow: 0 4px 20px rgba(58, 46, 40, 0.07);
      width: 100%;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
    }

    @media (min-width: 992px) {
      .header-content {
        height: 88px;
      }
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 0;
      text-decoration: none;
    }

    .brand-logo-img {
      height: 36px;
      width: auto;
      object-fit: contain;
    }

    @media (min-width: 768px) {
      .brand-logo-img {
        height: 44px;
      }
    }

    .mobile-toggle {
      background: transparent;
      border: none;
      color: var(--brand-mocha-brown, #3A2E28);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
    }

    .mobile-toggle:hover {
      background-color: var(--brand-pearl-beige, #FAF7F2);
    }

    .desktop-nav {
      display: none;
      gap: 20px;
    }

    @media (min-width: 992px) {
      .desktop-nav {
        display: flex;
        align-items: center;
        gap: 24px;
        white-space: nowrap;
      }
      .mobile-toggle { display: none !important; }
    }

    @media (min-width: 1200px) {
      .desktop-nav {
        gap: 32px;
      }
    }

    .nav-link {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--brand-mocha-brown, #3A2E28);
      padding: 10px 2px;
      position: relative;
      text-decoration: none;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      transition: color 0.25s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--brand-warm-gold, #CFA874);
    }

    .nav-link.active {
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 700;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2.5px;
      background-color: var(--brand-warm-gold, #CFA874);
      border-radius: 2px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 380px) {
      .brand-logo-img {
        height: 32px;
      }
      .header-actions {
        gap: 0;
      }
      .action-btn {
        width: 38px;
        height: 38px;
        min-width: 38px;
        min-height: 38px;
      }
    }

    @media (min-width: 768px) {
      .header-actions {
        gap: 8px;
      }
    }

    .action-btn {
      background: transparent;
      border: none;
      color: var(--brand-mocha-brown, #3A2E28);
      cursor: pointer;
      position: relative;
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.25s ease;
    }

    .action-btn:hover {
      color: var(--brand-warm-gold, #CFA874);
      background-color: var(--brand-pearl-beige, #FAF7F2);
    }

    .bag-count {
      position: absolute;
      top: 4px;
      right: 2px;
      background-color: var(--brand-warm-gold, #CFA874);
      color: #1A120B;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      border: 1.5px solid #FFFFFF;
      z-index: 2;
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

    /* Luxury Mobile Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 310px;
      max-width: 88vw;
      height: 100vh;
      background-color: #FFFFFF;
      z-index: 200;
      transform: translateX(-100%);
      transition: transform var(--transition-normal);
      display: flex;
      flex-direction: column;
      box-shadow: 10px 0 35px rgba(91, 70, 54, 0.16);
      overflow-y: auto;
    }

    .mobile-drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
      background: var(--brand-pearl-beige);
    }

    .drawer-logo {
      display: inline-flex;
      align-items: center;
      gap: 0;
      text-decoration: none;
    }

    .drawer-logo-img {
      height: 28px;
      width: auto;
      object-fit: contain;
    }

    .close-btn {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      color: var(--brand-mocha-brown);
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }

    .close-btn:hover {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border-color: var(--brand-warm-gold);
    }

    .drawer-body {
      padding: 24px 20px;
      flex: 1;
    }

    .drawer-section-title {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 12px;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 24px;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
      padding: 10px 18px;
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: all var(--transition-fast);
      background-color: transparent;
    }

    .mobile-nav-link:hover, .mobile-nav-link.active {
      background-color: var(--brand-pearl-beige);
      color: var(--brand-warm-gold);
      transform: translateX(4px);
    }

    .mobile-nav-link svg {
      transition: transform var(--transition-fast);
      color: #999999;
    }

    .mobile-nav-link:hover svg, .mobile-nav-link.active svg {
      color: var(--brand-warm-gold);
      transform: translateX(2px);
    }

    .drawer-collections {
      border-top: 1px solid var(--color-border);
      padding-top: 20px;
    }

    .collection-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag-pill {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      background: var(--brand-pearl-beige);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: all var(--transition-fast);
      border: 1px solid var(--color-border);
    }

    .tag-pill:hover {
      background: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
      border-color: var(--brand-mocha-brown);
    }

    .drawer-footer {
      padding: 18px 20px;
      background: var(--brand-pearl-beige);
      border-top: 1px solid var(--color-border);
    }

    .drawer-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }

    .drawer-action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 12px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .drawer-action-btn:hover {
      background: var(--brand-mocha-brown);
      color: var(--brand-pearl-beige);
      border-color: var(--brand-mocha-brown);
    }

    .drawer-tagline {
      font-size: 0.72rem;
      color: #777777;
      text-align: center;
      margin: 0;
      letter-spacing: 0.5px;
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
  isWishlistOpen: boolean = false;
  cartCount: number = 0;
  wishlistItems: ProductCardData[] = [];

  private cartSub!: Subscription;
  private wishlistSub!: Subscription;

  navItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    // { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ];

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cartSub = this.cartService.cart$.subscribe(summary => {
      this.cartCount = summary ? summary.itemCount : 0;
      this.cdr.detectChanges();
    });

    this.wishlistSub = this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items || [];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }

  openWishlistModal(): void {
    this.isWishlistOpen = true;
  }

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }
}

