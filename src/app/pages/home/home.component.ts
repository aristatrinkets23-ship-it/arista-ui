import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Category } from '../../core/models/category.model';
import { MockDataService } from '../../core/mock/mock-data.service';
import { CartService } from '../../core/services/cart.service';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionHeadingComponent,
    ProductCardComponent,
    ButtonComponent
  ],
  template: `
    <!-- Hero Banner Section (Reference: arista-jewelery.pages.dev) -->
    <section class="hero-section">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <!-- Demi Fine, Anti Tarnish Jewellery Eyebrow -->
          <div class="hero-eyebrow-wrapper">
            <span class="hero-eyebrow-line"></span>
            <span class="hero-eyebrow-text">
              <span class="hero-diamond-dot">◆</span> Demi Fine, Anti Tarnish Jewellery <span class="hero-diamond-dot">◆</span>
            </span>
            <span class="hero-eyebrow-line"></span>
          </div>

          <!-- Hero Main Headline -->
          <h1 class="hero-title">
            Timeless pieces, thoughtfully crafted to celebrate <em>every you.</em>
          </h1>

          <!-- Hero Subtitle Description -->
          <p class="hero-description">
            Discover a collection of fine jewellery designed for life's quiet, beautiful moments &mdash; elegant, minimal, and made to last.
          </p>

          <!-- Primary CTA Button -->
          <div class="hero-actions">
            <a routerLink="/shop" class="hero-primary-btn">
              <span>Shop the Collection</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>

          <!-- 4 Feature Circles Grid -->
          <div class="hero-features-grid">
            <div class="hero-feature-item">
              <div class="hero-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span class="hero-feature-title">DEMI FINE & ANTI TARNISH</span>
              <span class="hero-feature-sub">Small-Batch Made</span>
            </div>

            <div class="hero-feature-item">
              <div class="hero-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <span class="hero-feature-title">ETHICAL</span>
              <span class="hero-feature-sub">Sourced Stones</span>
            </div>

            <div class="hero-feature-item">
              <div class="hero-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <span class="hero-feature-title">LIFETIME</span>
              <span class="hero-feature-sub">Warranty Included</span>
            </div>

            <div class="hero-feature-item">
              <div class="hero-feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="8" width="18" height="13" rx="2"></rect>
                  <path d="M12 8V3"></path>
                  <path d="M7.5 3a2.5 2.5 0 0 1 4.5 1.5"></path>
                  <path d="M16.5 3a2.5 2.5 0 0 0-4.5 1.5"></path>
                </svg>
              </div>
              <span class="hero-feature-title">GIFT READY</span>
              <span class="hero-feature-sub">Boxed & Wrapped</span>
            </div>
          </div>

          <!-- 3-Item Trust Ribbon Bar -->
          <div class="hero-trust-bar">
            <div class="hero-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <div>
                <span>FREE SHIPPING</span>
                <span class="hero-trust-sub">On Every Order</span>
              </div>
            </div>

            <div class="hero-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <div>
                <span>30-DAY RETURNS</span>
                <span class="hero-trust-sub">No Questions Asked</span>
              </div>
            </div>

            <div class="hero-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <div>
                <span>SECURE PAYMENT</span>
                <span class="hero-trust-sub">Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mocha Infinite Marquee Ribbon -->
    <div class="marquee-ribbon">
      <div class="marquee-track">
        <div class="marquee-content">
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 3h12l4 6-10 12L2 9z"></path>
            </svg>
            DEMI FINE & ANTI TARNISH
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            CERTIFIED AUTHENTICITY
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            SECURE PAYMENT
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            EASY 30-DAY RETURNS
          </span>
          <span class="marquee-sep">|</span>
        </div>
        <div class="marquee-content" aria-hidden="true">
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 3h12l4 6-10 12L2 9z"></path>
            </svg>
            DEMI FINE & ANTI TARNISH
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            CERTIFIED AUTHENTICITY
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            SECURE PAYMENT
          </span>
          <span class="marquee-sep">|</span>
          <span class="marquee-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            EASY 30-DAY RETURNS
          </span>
          <span class="marquee-sep">|</span>
        </div>
      </div>
    </div>



    <!-- Featured Collections Grid -->
    <!-- Shop by Category Section (Ref: arista-jewelery.pages.dev) -->
    <section class="section-padding bg-pearl category-section">
      <div class="container">
        <div class="cat-section-header">
          <span class="cat-eyebrow">EXPLORE</span>
          <h2 class="cat-section-title">Shop by <em>Category</em></h2>
        </div>

        <!-- Case 1: More than 5 categories -> Moving Infinite Marquee Effect -->
        <div *ngIf="categories.length > 5" class="category-marquee-container">
          <div class="category-marquee-track">
            <!-- First Track -->
            <div class="category-marquee-group">
              <a
                *ngFor="let cat of categories"
                [routerLink]="['/shop']"
                [queryParams]="{ category: cat.slug }"
                class="cat-strip-item"
              >
                <div class="cat-thumb-box">
                  <img [src]="cat.image" [alt]="cat.name" class="cat-thumb-img" loading="lazy" (error)="onImageError($event)" />
                </div>
                <span class="cat-thumb-name">{{ cat.name }}</span>
              </a>
            </div>

            <!-- Second Track (Duplicate for Infinite Loop) -->
            <div class="category-marquee-group" aria-hidden="true">
              <a
                *ngFor="let cat of categories"
                [routerLink]="['/shop']"
                [queryParams]="{ category: cat.slug }"
                class="cat-strip-item"
              >
                <div class="cat-thumb-box">
                  <img [src]="cat.image" [alt]="cat.name" class="cat-thumb-img" loading="lazy" (error)="onImageError($event)" />
                </div>
                <span class="cat-thumb-name">{{ cat.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Case 2: 1 to 5 categories -> Clean Centered Static Layout (No Duplication) -->
        <div *ngIf="categories.length > 0 && categories.length <= 5" class="category-static-container">
          <div class="category-static-grid scroll-reveal-stagger">
            <a
              *ngFor="let cat of categories"
              [routerLink]="['/shop']"
              [queryParams]="{ category: cat.slug }"
              class="cat-strip-item"
            >
              <div class="cat-thumb-box">
                <img [src]="cat.image" [alt]="cat.name" class="cat-thumb-img" loading="lazy" (error)="onImageError($event)" />
              </div>
              <span class="cat-thumb-name">{{ cat.name }}</span>
            </a>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="empty-section-notice" style="text-align: center; padding: 40px 24px; background: rgba(207, 168, 116, 0.08); border-radius: 12px; border: 1px dashed var(--brand-warm-gold); max-width: 600px; margin: 0 auto;">
          <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.3rem; margin-bottom: 8px;">No Categories Created Yet</h3>
          <p style="color: #666; font-size: 0.92rem; margin-bottom: 20px;">Add collection categories from the Admin Dashboard to feature them here on the homepage.</p>
          <a routerLink="/admin" style="padding: 10px 24px; text-decoration: none; border-radius: 50px; font-weight: 700; background: var(--brand-warm-gold); color: #1A120B; font-size: 0.88rem; display: inline-block;">
            ⚙ Go to Admin to Add Category & Product
          </a>
        </div>
      </div>
    </section>

    <!-- Shop by Occasion Section -->
    <section class="section-padding occasion-section scroll-reveal">
      <div class="container">
        <app-section-heading
          subtitle="FIND YOUR MOMENT"
          title="Shop by Occasion"
          align="center"
        ></app-section-heading>

        <div class="occasion-accordion scroll-reveal-stagger">
          <div
            *ngFor="let item of occasionList"
            class="occasion-card"
            [class.active]="activeOccasionId === item.id"
            (mouseenter)="activeOccasionId = item.id"
            (click)="activeOccasionId = item.id"
          >
            <img [src]="item.image" [alt]="item.title" class="occasion-card-img" (error)="onImageError($event)" />
            <div class="occasion-card-overlay"></div>
            
            <!-- Collapsed Vertical Title -->
            <div class="occasion-collapsed-label" *ngIf="activeOccasionId !== item.id">
              <span>{{ item.title }}</span>
            </div>

            <!-- Expanded Details Content -->
            <div class="occasion-expanded-content" *ngIf="activeOccasionId === item.id">
              <span class="occasion-heart-icon">♡</span>
              <h3 class="occasion-card-title">{{ item.title }}</h3>
              <p class="occasion-card-desc">{{ item.description }}</p>
              <a [routerLink]="['/shop']" [queryParams]="{ occasion: item.slug }" class="occasion-card-btn">
                EXPLORE COLLECTION &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Just Landed - New Arrivals Section (Ref: Arched Cards + View All Button) -->
    <section class="section-padding new-arrivals-section scroll-reveal">
      <div class="container">
        <div class="arrivals-header">
          <span class="arrivals-eyebrow">JUST LANDED</span>
          <h2 class="arrivals-title">New <em>Arrivals</em></h2>
          <div class="arrivals-title-underline"></div>
        </div>

        <div *ngIf="newArrivals.length > 0" class="arrivals-grid scroll-reveal-stagger">
          <div *ngFor="let product of newArrivals" class="arrival-card-v2">
            <a [routerLink]="['/product', product.slug]" class="arrival-img-box">
              <span class="arrival-badge-pill">{{ product.badge || 'NEW' }}</span>
              <img
                [src]="product.image"
                [alt]="product.name"
                class="arrival-card-img"
                loading="lazy"
                (error)="onImageError($event)"
              />
            </a>

            <div class="arrival-info-box">
              <a [routerLink]="['/product', product.slug]" class="arrival-card-name">{{ product.name }}</a>
              
              <div class="arrival-card-price-row">
                <span class="price-current">₹{{ product.price | number:'1.0-0' }}</span>
                <span class="price-original" *ngIf="product.compareAtPrice && product.compareAtPrice > product.price">₹{{ product.compareAtPrice | number:'1.0-0' }}</span>
                <span *ngIf="getDiscountPercentage(product) > 0" style="background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 700; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; margin-left: 4px; display: inline-block;">
                  {{ getDiscountPercentage(product) }}% OFF
                </span>
              </div>

              <button class="arrival-add-bag-btn" (click)="addToBag(product, $event)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>ADD TO BAG</span>
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="newArrivals.length === 0" class="empty-section-notice" style="text-align: center; padding: 40px 24px; background: rgba(207, 168, 116, 0.08); border-radius: 12px; border: 1px dashed var(--brand-warm-gold); max-width: 600px; margin: 0 auto;">
          <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.3rem; margin-bottom: 8px;">No New Arrivals Available</h3>
          <p style="color: #666; font-size: 0.92rem;">New products will appear here automatically when added to the catalog.</p>
        </div>

        <!-- View All Button -->
        <div class="arrivals-footer" *ngIf="newArrivals.length > 0">
          <a routerLink="/shop" class="view-all-pill-btn">VIEW ALL</a>
        </div>
      </div>
    </section>

    <!-- Why Choose Arista Section with Scroll Zoom Background (Ref: image scroll effect.mp4) -->
    <section class="heritage-parallax-banner-section" #heritageSection>
      <div class="heritage-parallax-bg" #heritageBg></div>
      <div class="heritage-parallax-overlay"></div>
      
      <div class="container why-choose-container">
        <!-- Header -->
        <div class="why-choose-header">
          <span class="why-choose-eyebrow">OUR PROMISE</span>
          <h2 class="why-choose-title">Why Choose <em>Arista</em></h2>
          <div class="why-choose-underline"></div>
        </div>

        <!-- 5 Feature Promise Cards Grid -->
        <div class="why-choose-grid">
          <!-- Card 1: Uncompromising Quality -->
          <div class="why-choose-card">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polygon points="12 2 22 8.5 12 22 2 8.5 12 2"></polygon>
                <line x1="2" y1="8.5" x2="22" y2="8.5"></line>
                <line x1="12" y1="2" x2="7" y2="8.5"></line>
                <line x1="12" y1="2" x2="17" y2="8.5"></line>
                <line x1="7" y1="8.5" x2="12" y2="22"></line>
                <line x1="17" y1="8.5" x2="12" y2="22"></line>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Uncompromising Quality</h3>
            <p class="why-choose-card-text">Every stone and setting is checked by hand before it ships.</p>
          </div>

          <!-- Card 2: True Craftsmanship -->
          <div class="why-choose-card">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">True Craftsmanship</h3>
            <p class="why-choose-card-text">Small-batch made by artisans, not stamped out on a line.</p>
          </div>

          <!-- Card 3: Certified Authenticity -->
          <div class="why-choose-card">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Certified Authenticity</h3>
            <p class="why-choose-card-text">Every piece ships with a certificate of authenticity.</p>
          </div>

          <!-- Card 4: Gift-Ready Packaging -->
          <div class="why-choose-card">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Gift-Ready Packaging</h3>
            <p class="why-choose-card-text">Boxed and wrapped like a gift, even when it's for you.</p>
          </div>

          <!-- Card 5: Service That Listens -->
          <div class="why-choose-card">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Service That Listens</h3>
            <p class="why-choose-card-text">Real people for sizing, styling, or after-sales help.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Editorial / Brand Visual Section -->
    <section class="editorial-section">
      <div class="container editorial-grid">
        <div class="editorial-media">
          <img [src]="editorialPhoto" alt="Master Goldsmith Crafting Fine Jewellery" class="editorial-img ken-burns" (error)="onImageError($event)" />
          <div class="editorial-badge">100% Hallmarked Gold</div>
        </div>
        <div class="editorial-text">
          <span class="editorial-eyebrow">Artisanal Excellence</span>
          <h2 class="editorial-title">Every Jewel Carries an Eternal Story of Grace</h2>
          <p class="editorial-desc">
            Our atelier brings together age-old metalworking traditions and modern sculptural aesthetics. From initial sketch to final hand-polishing, every piece passes through rigorous quality checks to guarantee unmatched shine and durability.
          </p>
          <div class="editorial-bullets">
            <div class="bullet-item">
              <span class="bullet-dot"></span>
              <span>Ethically Sourced & Certified Diamonds</span>
            </div>
            <div class="bullet-item">
              <span class="bullet-dot"></span>
              <span>100% BIS Hallmarked Solid Gold</span>
            </div>
            <div class="bullet-item">
              <span class="bullet-dot"></span>
              <span>Complimentary Worldwide Insured Delivery</span>
            </div>
          </div>
          <div class="editorial-actions">
            <a routerLink="/shop">
              <app-button variant="secondary" size="md">Shop All Fine Jewellery &rarr;</app-button>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Frequently Asked Questions (FAQ) Section -->
    <section class="section-padding faq-section scroll-reveal bg-white">
      <div class="container">
        <div class="faq-header text-center">
          <span class="faq-eyebrow">HELP & INFORMATION</span>
          <h2 class="faq-title">Frequently Asked <em>Questions</em></h2>
          <p class="faq-subtitle">Everything you need to know about our demi fine, anti tarnish jewellery, certification, and services.</p>
        </div>

        <div class="faq-accordion-wrapper">
          <div 
            *ngFor="let faq of faqs; let i = index" 
            class="faq-item"
            [class.active]="faq.isOpen"
          >
            <button 
              type="button" 
              class="faq-question-btn" 
              (click)="toggleFaq(i)"
              [attr.aria-expanded]="faq.isOpen"
            >
              <span class="faq-question-text">{{ faq.question }}</span>
              <span class="faq-toggle-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
            </button>
            <div class="faq-answer-wrapper" [class.open]="faq.isOpen">
              <div class="faq-answer-inner">
                <div class="faq-answer-panel">
                  <p class="faq-answer-text">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram / Bestsellers Showcase Section (@aristatrinkets) -->
    <section class="section-padding insta-grid-section scroll-reveal">
      <div class="container">
        <h2 class="insta-section-title">@aristatrinkets</h2>

        <div *ngIf="bestsellerProducts.length > 0" class="insta-grid scroll-reveal-stagger">
          <a
            *ngFor="let product of bestsellerProducts"
            [routerLink]="['/product', product.slug]"
            class="insta-card"
          >
            <img
              [src]="product.image"
              [alt]="product.name"
              class="insta-img"
              loading="lazy"
              (error)="onImageError($event)"
            />
            <div class="insta-overlay">
              <span class="insta-at-icon">@</span>
            </div>
          </a>
        </div>

        <div *ngIf="bestsellerProducts.length === 0" class="empty-section-notice" style="text-align: center; padding: 40px 24px; background: rgba(207, 168, 116, 0.08); border-radius: 12px; border: 1px dashed var(--brand-warm-gold); max-width: 600px; margin: 0 auto;">
          <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.3rem; margin-bottom: 8px;">No Bestseller Products Tagged</h3>
          <p style="color: #666; font-size: 0.92rem; margin-bottom: 20px;">Tag products with the BESTSELLER badge in the Admin Dashboard to feature them here.</p>
          <a routerLink="/admin" style="padding: 10px 24px; text-decoration: none; border-radius: 50px; font-weight: 700; background: var(--brand-warm-gold); color: #1A120B; font-size: 0.88rem; display: inline-block;">
            ⚙ Go to Admin to Set BESTSELLER Badge
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      background-image: url('/assets/images/hero-banner.jpg');
      background-size: cover;
      background-position: center right;
      background-repeat: no-repeat;
      padding: 80px 0 56px 0;
      min-height: 580px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid var(--brand-warm-gold);
      color: #FFFFFF;
    }

    @media (min-width: 992px) {
      .hero-section {
        padding: 110px 0 72px 0;
        min-height: 640px;
      }
    }

    .hero-bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg, 
        rgba(26, 18, 11, 0.88) 0%, 
        rgba(26, 18, 11, 0.65) 40%, 
        rgba(26, 18, 11, 0.3) 70%, 
        rgba(26, 18, 11, 0.05) 100%
      );
      pointer-events: none;
    }

    .hero-container {
      position: relative;
      z-index: 2;
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 0 32px;
    }

    @media (max-width: 576px) {
      .hero-container {
        padding: 0 16px;
      }
    }

    .hero-content {
      max-width: 620px;
      text-align: left;
    }

    .hero-eyebrow-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      max-width: 320px;
    }

    .hero-eyebrow-line {
      height: 1px;
      flex: 1;
      background: linear-gradient(90deg, transparent, #CFA874);
    }

    .hero-eyebrow-wrapper .hero-eyebrow-line:last-child {
      background: linear-gradient(90deg, #CFA874, transparent);
    }

    .hero-eyebrow-text {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #E2BA84;
      white-space: nowrap;
    }

    .hero-diamond-dot {
      font-size: 0.6rem;
      color: #CFA874;
    }

    .hero-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      color: #FFFFFF;
      margin-bottom: 16px;
      line-height: 1.15;
      font-weight: 400;
      font-style: italic;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
    }

    .hero-title em {
      font-style: italic;
      color: #FFFFFF;
    }

    .hero-description {
      font-size: clamp(0.98rem, 1.5vw, 1.1rem);
      color: #F5EBDD;
      margin-bottom: 28px;
      line-height: 1.7;
      max-width: 540px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }

    .hero-primary-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background-color: #CFA874;
      color: #1A120B;
      padding: 14px 32px;
      border-radius: 50px;
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 8px 24px rgba(207, 168, 116, 0.35);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-primary-btn:hover {
      background-color: #FFFFFF;
      color: #1A120B;
      transform: scale(1.04);
      box-shadow: 0 12px 30px rgba(255, 255, 255, 0.4);
    }

    /* 4 Feature Circles Grid */
    .hero-features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 32px;
      max-width: 480px;
    }

    @media (max-width: 576px) {
      .hero-features-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }

    .hero-feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
    }

    .hero-feature-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 24%, #FFFFFF 0%, #F7E9E6 100%);
      border: 1.5px solid #CFA874;
      color: #CFA874;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(207, 168, 116, 0.25);
      transition: transform 0.3s ease;
    }

    .hero-feature-item:hover .hero-feature-icon {
      transform: scale(1.08);
    }

    .hero-feature-title {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #FFFFFF;
      text-transform: uppercase;
    }

    .hero-feature-sub {
      font-size: 0.58rem;
      color: rgba(245, 235, 221, 0.7);
    }

    /* 3-Item Trust Ribbon Bar */
    .hero-trust-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(232, 227, 243, 0.12);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(207, 168, 116, 0.3);
      border-radius: 50px;
      padding: 10px 20px;
      margin-top: 28px;
      max-width: 520px;
    }

    @media (max-width: 576px) {
      .hero-trust-bar {
        flex-direction: column;
        gap: 8px;
        border-radius: 16px;
        align-items: flex-start;
      }
    }

    .hero-trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.68rem;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.04em;
    }

    .hero-trust-item svg {
      color: #CFA874;
      flex-shrink: 0;
    }

    .hero-trust-sub {
      display: block;
      font-size: 0.6rem;
      font-weight: 400;
      color: rgba(245, 235, 221, 0.75);
    }
      line-height: 1.12;
      font-weight: 700;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
    }

    .hero-description {
      font-size: clamp(1rem, 1.6vw, 1.15rem);
      color: #F3ECE4;
      margin-bottom: 36px;
      line-height: 1.7;
      max-width: 560px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
    }

    .hero-actions {
      display: flex;
      gap: 18px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .hero-cta-link {
      display: inline-block;
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .hero-content {
        text-align: center;
        margin: 0 auto;
      }
      .hero-actions {
        justify-content: center;
      }
      .hero-bg-overlay {
        background: linear-gradient(
          180deg, 
          rgba(26, 18, 11, 0.92) 0%, 
          rgba(26, 18, 11, 0.78) 60%, 
          rgba(26, 18, 11, 0.5) 100%
        );
      }
    }

    /* Marquee Ribbon */
    .marquee-ribbon {
      background-color: #3A2C21;
      color: #F8F5EE;
      overflow: hidden;
      white-space: nowrap;
      padding: 12px 0;
      border-top: 1px solid rgba(207, 168, 116, 0.3);
      border-bottom: 1px solid rgba(207, 168, 116, 0.3);
      user-select: none;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marqueeScroll 25s linear infinite;
    }

    .marquee-ribbon:hover .marquee-track {
      animation-play-state: paused;
    }

    .marquee-content {
      display: flex;
      align-items: center;
      gap: 28px;
      padding-right: 28px;
    }

    .marquee-item {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      color: #F8F5EE;
    }

    .marquee-item svg {
      color: var(--brand-warm-gold);
      flex-shrink: 0;
    }

    .marquee-sep {
      color: rgba(207, 168, 116, 0.5);
      font-weight: 300;
    }

    @keyframes marqueeScroll {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    /* Brand Intro Section */
    .brand-intro-section {
      padding: 56px 0;
      background-color: #FFFFFF;
      border-bottom: 1px solid var(--color-border);
    }

    .intro-content {
      max-width: 760px;
      margin: 0 auto;
    }

    .intro-eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 8px;
    }

    .intro-heading {
      font-family: var(--font-serif);
      font-size: clamp(1.6rem, 3.5vw, 2.3rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
      line-height: 1.25;
    }

    .intro-tagline {
      font-family: var(--font-serif);
      font-size: clamp(1.15rem, 2.2vw, 1.45rem);
      font-style: italic;
      color: var(--brand-warm-gold);
      margin: 12px auto 20px auto;
      max-width: 650px;
    }

    .brand-mood-tags {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .mood-pill {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-mocha-brown);
      background: var(--brand-pearl-beige);
      padding: 6px 18px;
      border-radius: var(--radius-full);
      border: 1px solid var(--color-border);
      transition: all var(--transition-fast);
    }

    .mood-pill:hover {
      background: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border-color: var(--brand-warm-gold);
    }

    .intro-text {
      font-size: 1rem;
      color: #555555;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .intro-link {
      font-size: 0.88rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-warm-gold);
      transition: color var(--transition-fast);
    }

    .intro-link:hover {
      color: var(--brand-mocha-brown);
    }

    .bg-pearl {
      background-color: var(--brand-pearl-beige);
    }

    /* Shop by Category Section - Reference Replica (arista-jewelery.pages.dev) */
    .category-section {
      padding: 56px 0 44px 0;
      background-color: var(--brand-pearl-beige, #FDFBF7);
      overflow: hidden;
    }

    .cat-section-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .cat-eyebrow {
      display: block;
      font-size: 0.78rem;
      letter-spacing: 0.28em;
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .cat-section-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2rem, 4vw, 2.75rem);
      color: var(--brand-mocha-brown, #3A2E28);
      font-weight: 400;
      margin: 0;
      line-height: 1.2;
    }

    .cat-section-title em {
      font-style: italic;
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 400;
    }

    .category-marquee-container {
      width: 100%;
      overflow: hidden;
      position: relative;
      padding: 16px 0 24px 0;
      mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    }

    .category-static-container {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 16px 0 24px 0;
    }

    .category-static-grid {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 auto;
    }

    @media (max-width: 576px) {
      .category-static-grid {
        gap: 16px 14px;
      }
    }

    .category-marquee-track {
      display: flex;
      width: max-content;
    }

    .category-marquee-group {
      display: flex;
      gap: 32px;
      align-items: flex-start;
      padding: 0 16px;
      animation: catMarqueeSlide 30s linear infinite;
      will-change: transform;
    }

    /* Pause animation on hover */
    .category-marquee-container:hover .category-marquee-group {
      animation-play-state: paused;
    }

    @keyframes catMarqueeSlide {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0);
      }
    }

    .cat-strip-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      cursor: pointer;
      width: 130px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .cat-thumb-box {
      width: 125px;
      height: 125px;
      border-radius: 24px;
      overflow: hidden;
      background-color: #FFFFFF;
      position: relative;
      border: 1.5px solid rgba(207, 168, 116, 0.45);
      box-shadow: 0 8px 22px rgba(58, 46, 40, 0.08);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cat-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cat-strip-item:hover .cat-thumb-box {
      transform: translateY(-7px) scale(1.03);
      border-color: var(--brand-warm-gold, #D4AF37);
      box-shadow: 0 14px 30px rgba(212, 175, 55, 0.35);
    }

    .cat-strip-item:hover .cat-thumb-img {
      transform: scale(1.12);
    }

    .cat-thumb-name {
      margin-top: 12px;
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--brand-mocha-brown, #3A2E28);
      text-align: center;
      white-space: nowrap;
      transition: color 0.25s ease;
    }

    .cat-strip-item:hover .cat-thumb-name {
      color: var(--brand-warm-gold, #D4AF37);
      font-weight: 600;
    }

    /* Featured Heritage Parallax Banner Section - Why Choose Arista */
    .heritage-parallax-banner-section {
      position: relative;
      padding: 96px 0;
      overflow: hidden;
      background-color: #1A120B;
      border-top: 1px solid rgba(207, 168, 116, 0.3);
      border-bottom: 1px solid rgba(207, 168, 116, 0.3);
    }

    .heritage-parallax-bg {
      position: absolute;
      inset: -90px;
      background-image: url('/assets/images/heritage-banner-bg.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      will-change: transform;
      transform-origin: center center;
      filter: brightness(0.92) contrast(1.02);
      backface-visibility: hidden;
      transform: translate3d(0, 0, 0) scale(1.28);
    }

    .heritage-parallax-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(35, 25, 20, 0.52) 0%,
        rgba(26, 18, 11, 0.38) 50%,
        rgba(35, 25, 20, 0.58) 100%
      );
      pointer-events: none;
    }

    .why-choose-container {
      position: relative;
      z-index: 3;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .why-choose-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .why-choose-eyebrow {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.78rem;
      letter-spacing: 0.32em;
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 700;
      text-transform: uppercase;
      display: block;
      margin-bottom: 10px;
    }

    .why-choose-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      color: #FFFDF9;
      font-weight: 400;
      margin: 0 0 14px 0;
      line-height: 1.2;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    }

    .why-choose-title em {
      font-style: italic;
      color: var(--brand-warm-gold, #CFA874);
    }

    .why-choose-underline {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--brand-warm-gold, #CFA874), transparent);
      margin: 0 auto;
    }

    .why-choose-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
    }

    @media (max-width: 1100px) {
      .why-choose-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .why-choose-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }
    }

    @media (max-width: 480px) {
      .why-choose-grid {
        grid-template-columns: 1fr;
      }
    }

    .why-choose-card {
      background: rgba(26, 18, 11, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(207, 168, 116, 0.25);
      border-radius: 20px;
      padding: 36px 20px 32px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .why-choose-card:hover {
      transform: translateY(-8px);
      background: rgba(35, 25, 18, 0.75);
      border-color: rgba(207, 168, 116, 0.7);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(207, 168, 116, 0.2);
    }

    .why-choose-icon-box {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 1.5px solid rgba(207, 168, 116, 0.6);
      background: rgba(207, 168, 116, 0.08);
      color: #D4AF37;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      transition: all 0.35s ease;
      box-shadow: 0 0 15px rgba(207, 168, 116, 0.1);
    }

    .why-choose-card:hover .why-choose-icon-box {
      background: var(--brand-warm-gold, #CFA874);
      color: #1A120B;
      border-color: #D4AF37;
      transform: scale(1.1) rotate(4deg);
      box-shadow: 0 0 20px rgba(207, 168, 116, 0.4);
    }

    .why-choose-card-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: 1.15rem;
      font-weight: 500;
      color: #FFFFFF;
      margin: 0 0 10px 0;
      line-height: 1.3;
      letter-spacing: 0.01em;
    }

    .why-choose-card-text {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.88rem;
      color: rgba(243, 236, 228, 0.82);
      line-height: 1.6;
      margin: 0;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .diamond-edit-banner-section {
        min-height: 360px;
        padding: 48px 0;
      }
      .diamond-banner-overlay {
        background: linear-gradient(
          180deg,
          rgba(38, 28, 23, 0.85) 0%,
          rgba(38, 28, 23, 0.68) 100%
        );
      }
      .diamond-banner-content {
        text-align: center;
        margin: 0 auto;
      }
    }

    /* Editorial Section - Opposite Direction Entrance Animation */
    .editorial-section {
      padding: 72px 0;
      background-color: var(--brand-pearl-beige);
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      overflow: hidden;
      position: relative;
    }

    .editorial-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
      align-items: center;
    }

    @media (min-width: 992px) {
      .editorial-grid {
        grid-template-columns: 1fr 1fr;
        gap: 56px;
      }
    }

    /* Left Column: Image comes from LEFT (-90px -> 0) */
    .editorial-media {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      aspect-ratio: 3 / 4;
      max-height: 560px;
      margin: 0 auto;
      width: 100%;
      background-color: #FFFFFF;
      opacity: 0;
      transform: translateX(-90px);
      transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    @media (max-width: 768px) {
      .editorial-media {
        transform: translateY(30px);
      }
    }

    /* Right Column: Text comes from RIGHT (+90px -> 0) */
    .editorial-text {
      opacity: 0;
      transform: translateX(90px);
      transition: opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
      will-change: opacity, transform;
    }

    @media (max-width: 768px) {
      .editorial-text {
        transform: translateY(30px);
      }
    }

    /* When section enters viewport, both sides slide toward each other from opposite directions */
    .editorial-section.in-view .editorial-media {
      opacity: 1;
      transform: translateX(0);
    }

    .editorial-section.in-view .editorial-text {
      opacity: 1;
      transform: translateX(0);
    }

    .editorial-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .editorial-badge {
      position: absolute;
      bottom: 16px;
      left: 16px;
      background-color: var(--brand-mocha-brown);
      color: var(--brand-warm-gold);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
    }

    .editorial-eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 8px;
    }

    .editorial-title {
      font-family: var(--font-serif);
      font-size: clamp(1.75rem, 3.5vw, 2.4rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 16px;
      line-height: 1.25;
    }

    .editorial-desc {
      font-size: 0.98rem;
      color: #555555;
      line-height: 1.65;
      margin-bottom: 24px;
    }

    .editorial-bullets {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 32px;
    }

    .bullet-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
    }

    .bullet-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--brand-warm-gold);
    }

    /* Instagram / Bestsellers Showcase Section (@aristatrinkets) */
    .insta-grid-section {
      padding: 64px 0 72px 0;
      background-color: var(--brand-pearl-beige, #FAF7F2);
    }

    .insta-section-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-style: italic;
      font-size: clamp(2.1rem, 4vw, 2.85rem);
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 400;
      text-align: center;
      margin: 0 0 36px 0;
      letter-spacing: -0.01em;
    }

    .insta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      max-width: 1080px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .insta-grid {
        gap: 22px;
      }
    }

    @media (max-width: 576px) {
      .insta-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }

    .insta-card {
      position: relative;
      display: block;
      aspect-ratio: 1 / 1;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
      background-color: #1A120B;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(58, 46, 40, 0.08);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .insta-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .insta-card:hover .insta-img {
      transform: scale(1.08);
    }

    .insta-overlay {
      position: absolute;
      inset: 0;
      background: rgba(26, 18, 11, 0.42);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
    }

    .insta-card:hover .insta-overlay {
      opacity: 1;
    }

    .insta-at-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      color: #1A120B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 1.3rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      transform: scale(0.85);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .insta-card:hover .insta-at-icon {
      transform: scale(1);
    }

    /* Universal Scroll Reveal & Viewport Entrance Animations */
    .scroll-reveal {
      opacity: 0;
      transform: translateY(45px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .scroll-reveal.revealed,
    .scroll-reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .scroll-reveal-stagger > * {
      opacity: 0;
      transform: translateY(35px);
      transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .scroll-reveal-stagger.revealed > *:nth-child(1),
    .scroll-reveal-stagger.in-view > *:nth-child(1) { transition-delay: 0.05s; opacity: 1; transform: translateY(0); }
    .scroll-reveal-stagger.revealed > *:nth-child(2),
    .scroll-reveal-stagger.in-view > *:nth-child(2) { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
    .scroll-reveal-stagger.revealed > *:nth-child(3),
    .scroll-reveal-stagger.in-view > *:nth-child(3) { transition-delay: 0.25s; opacity: 1; transform: translateY(0); }
    .scroll-reveal-stagger.revealed > *:nth-child(4),
    .scroll-reveal-stagger.in-view > *:nth-child(4) { transition-delay: 0.35s; opacity: 1; transform: translateY(0); }
    .scroll-reveal-stagger.revealed > *:nth-child(5),
    .scroll-reveal-stagger.in-view > *:nth-child(5) { transition-delay: 0.45s; opacity: 1; transform: translateY(0); }
    .scroll-reveal-stagger.revealed > *:nth-child(6),
    .scroll-reveal-stagger.in-view > *:nth-child(6) { transition-delay: 0.55s; opacity: 1; transform: translateY(0); }

    /* Shop by Occasion Accordion Styles */
    .occasion-section {
      background-color: var(--brand-pearl-beige, #FAF7F2);
      padding: 72px 0;
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .occasion-section.in-view,
    .occasion-section.revealed {
      opacity: 1;
      transform: translateY(0);
    }

    .occasion-accordion {
      display: flex;
      gap: 16px;
      height: 480px;
      width: 100%;
      margin-top: 36px;
    }

    @media (max-width: 768px) {
      .occasion-accordion {
        flex-direction: column;
        height: auto;
      }
    }

    .occasion-card {
      position: relative;
      flex: 1;
      border-radius: var(--radius-lg, 16px);
      overflow: hidden;
      cursor: pointer;
      transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s ease, box-shadow 0.4s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      background-color: #1A1615;
    }

    @media (max-width: 768px) {
      .occasion-card {
        height: 220px;
      }
      .occasion-card.active {
        height: 340px;
      }
    }

    .occasion-card.active {
      flex: 3.5;
      box-shadow: 0 12px 30px rgba(0,0,0,0.18);
    }

    .occasion-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s ease, filter 0.6s ease;
      filter: brightness(0.85);
    }

    .occasion-card:hover .occasion-card-img,
    .occasion-card.active .occasion-card-img {
      transform: scale(1.05);
      filter: brightness(0.95);
    }

    .occasion-card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 30%, rgba(18, 14, 12, 0.88) 100%);
      pointer-events: none;
    }

    .occasion-collapsed-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      pointer-events: none;
    }

    .occasion-collapsed-label span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 3px;
      color: rgba(255, 255, 255, 0.9);
      text-transform: uppercase;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    @media (max-width: 768px) {
      .occasion-collapsed-label span {
        writing-mode: horizontal-tb;
        transform: none;
        font-size: 1.05rem;
        letter-spacing: 2px;
      }
    }

    .occasion-expanded-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 32px 28px;
      z-index: 2;
      color: #FFFFFF;
      animation: fadeInContent 0.4s ease forwards;
    }

    @keyframes fadeInContent {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .occasion-heart-icon {
      font-size: 1.25rem;
      color: var(--brand-warm-gold, #D4AF37);
      display: block;
      margin-bottom: 8px;
    }

    .occasion-card-title {
      font-family: var(--font-serif);
      font-size: 1.85rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 8px;
      line-height: 1.2;
    }

    .occasion-card-desc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.82);
      line-height: 1.5;
      margin-bottom: 16px;
      max-width: 480px;
    }

    .occasion-card-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--brand-warm-gold, #D4AF37);
      text-decoration: none;
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .occasion-card-btn:hover {
      color: #FFFFFF;
      transform: translateX(4px);
    }

    /* Just Landed - New Arrivals Section (Reference Replica: Arched Cards) */
    .new-arrivals-section {
      padding: 64px 0 60px 0;
      background-color: #FDFBF7;
    }

    .arrivals-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .arrivals-eyebrow {
      display: block;
      font-size: 0.78rem;
      letter-spacing: 0.28em;
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .arrivals-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2.1rem, 4vw, 2.85rem);
      color: var(--brand-mocha-brown, #3A2E28);
      font-weight: 400;
      margin: 0;
      line-height: 1.2;
    }

    .arrivals-title em {
      font-style: italic;
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 400;
    }

    .arrivals-title-underline {
      width: 54px;
      height: 1.5px;
      background-color: var(--brand-warm-gold, #CFA874);
      margin: 14px auto 0 auto;
      border-radius: 2px;
      opacity: 0.8;
    }

    .arrivals-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (min-width: 768px) {
      .arrivals-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
    }

    @media (min-width: 992px) {
      .arrivals-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
    }

    @media (max-width: 480px) {
      .arrivals-grid {
        gap: 12px;
      }
    }

    .arrival-card-v2 {
      display: flex;
      flex-direction: column;
      width: 100%;
      text-decoration: none;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .arrival-card-v2:hover {
      transform: translateY(-4px);
    }

    .arrival-img-box {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      display: block;
      background-color: #F7F4EF;
      box-shadow: 0 4px 16px rgba(58, 46, 40, 0.06);
    }

    .arrival-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .arrival-card-v2:hover .arrival-card-img {
      transform: scale(1.06);
    }

    .arrival-badge-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 3;
      background: rgba(35, 25, 20, 0.82);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      color: #FFFDF9;
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 480px) {
      .arrival-badge-pill {
        top: 8px;
        left: 8px;
        font-size: 0.65rem;
        padding: 3px 8px;
      }
    }

    .arrival-info-box {
      display: flex;
      flex-direction: column;
      padding-top: 14px;
    }

    @media (max-width: 480px) {
      .arrival-info-box {
        padding-top: 10px;
      }
    }

    .arrival-card-name {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--brand-mocha-brown, #3A2E28);
      text-decoration: none;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.25s ease;
    }

    @media (max-width: 480px) {
      .arrival-card-name {
        font-size: 0.85rem;
        margin-bottom: 4px;
      }
    }

    .arrival-card-v2:hover .arrival-card-name {
      color: var(--brand-warm-gold, #CFA874);
    }

    .arrival-card-price-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }

    @media (max-width: 480px) {
      .arrival-card-price-row {
        margin-bottom: 10px;
        gap: 6px;
      }
    }

    .arrival-card-price-row .price-current {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 1.02rem;
      font-weight: 700;
      color: #1A120B;
    }

    @media (max-width: 480px) {
      .arrival-card-price-row .price-current {
        font-size: 0.92rem;
      }
    }

    .arrival-card-price-row .price-original {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.88rem;
      color: #888888;
      text-decoration: line-through;
    }

    @media (max-width: 480px) {
      .arrival-card-price-row .price-original {
        font-size: 0.78rem;
      }
    }

    .arrival-add-bag-btn {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      background: rgba(253, 251, 247, 0.9);
      border: 1px solid rgba(207, 168, 116, 0.45);
      border-radius: 50px;
      color: var(--brand-mocha-brown, #3A2E28);
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(58, 46, 40, 0.04);
    }

    @media (max-width: 480px) {
      .arrival-add-bag-btn {
        padding: 8px 10px;
        font-size: 0.7rem;
      }
    }

    .arrival-add-bag-btn:hover {
      background: var(--brand-warm-gold, #CFA874);
      color: #1A120B;
      border-color: var(--brand-warm-gold, #CFA874);
      box-shadow: 0 4px 14px rgba(207, 168, 116, 0.35);
      transform: translateY(-2px);
    }

    /* Footer / View All Pill Button */
    .arrivals-footer {
      text-align: center;
      margin-top: 44px;
    }

    .view-all-pill-btn {
      display: inline-block;
      padding: 12px 42px;
      border: 1.5px solid var(--brand-mocha-brown, #3A2E28);
      border-radius: 50px;
      color: var(--brand-mocha-brown, #3A2E28);
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      text-decoration: none;
      background-color: transparent;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .view-all-pill-btn:hover {
      background-color: var(--brand-mocha-brown, #3A2E28);
      color: #FFFFFF;
      border-color: var(--brand-mocha-brown, #3A2E28);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(58, 46, 40, 0.2);
    }

    /* Video Slideshow Showcase Section */
    .video-showcase-section {
      background-color: var(--brand-mocha-brown, #5B4636);
      color: #FFFFFF;
      padding: 72px 0;
    }

    .slideshow-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 32px;
      margin-bottom: 28px;
    }

    .slideshow-tab-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.25);
      color: rgba(255, 255, 255, 0.85);
      padding: 10px 20px;
      border-radius: 30px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .slideshow-tab-btn:hover,
    .slideshow-tab-btn.active {
      background: var(--brand-warm-gold, #D4AF37);
      color: var(--brand-mocha-brown, #5B4636);
      border-color: var(--brand-warm-gold, #D4AF37);
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
      font-weight: 700;
    }

    .video-slideshow-player {
      position: relative;
      border-radius: var(--radius-lg, 16px);
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0,0,0,0.35);
      border: none;
    }

    .slideshow-media-frame {
      position: relative;
      aspect-ratio: 16 / 9;
      width: 100%;
      background-color: #120F0D;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .slideshow-media-frame {
        aspect-ratio: 4 / 3;
      }
    }

    .slideshow-video-element,
    .slideshow-image-element {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .slideshow-image-element.ken-burns {
      animation: kenBurnsMotion 28s infinite alternate ease-in-out;
    }

    .player-overlay-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(18, 14, 12, 0.85) 100%);
      pointer-events: none;
      z-index: 1;
    }

    .slideshow-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(255, 255, 255, 0.15);
      z-index: 4;
    }

    .progress-fill {
      height: 100%;
      background: var(--brand-warm-gold, #D4AF37);
      transition: width 0.05s linear;
      box-shadow: 0 0 8px var(--brand-warm-gold, #D4AF37);
    }

    .player-badge {
      position: absolute;
      top: 18px;
      left: 20px;
      background: rgba(26, 20, 16, 0.8);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #FBF7F4;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 14px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 3;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22C55E;
      box-shadow: 0 0 8px #22C55E;
      animation: pulseGreen 1.5s infinite;
    }

    .player-info-box {
      position: absolute;
      bottom: 24px;
      left: 24px;
      right: 100px;
      z-index: 3;
      color: #FFFFFF;
      animation: fadeInUp 0.5s ease forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .info-type-tag {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2px;
      color: var(--brand-warm-gold, #D4AF37);
      display: block;
      margin-bottom: 6px;
    }

    .info-title {
      font-family: var(--font-serif);
      font-size: clamp(1.4rem, 2.5vw, 2.2rem);
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 8px;
      line-height: 1.25;
    }

    .info-desc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.5;
      margin-bottom: 16px;
      max-width: 580px;
    }

    .info-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--brand-warm-gold, #D4AF37);
      text-decoration: none;
      transition: color 0.2s ease, transform 0.2s ease;
    }

    .info-cta-btn:hover {
      color: #FFFFFF;
      transform: translateX(4px);
    }

    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(26, 20, 16, 0.65);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #FFFFFF;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 3;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .nav-arrow:hover {
      background: var(--brand-warm-gold, #D4AF37);
      color: var(--brand-mocha-brown, #5B4636);
      transform: translateY(-50%) scale(1.1);
    }

    .prev-arrow { left: 16px; }
    .next-arrow { right: 16px; }

    .slide-indicators {
      position: absolute;
      bottom: 24px;
      right: 24px;
      display: flex;
      gap: 8px;
      z-index: 3;
    }

    .slideshow-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
      pointer-events: none;
      z-index: 1;
    }

    .slideshow-slide.active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      z-index: 2;
    }

    .indicator-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .indicator-dot.active {
      background: var(--brand-warm-gold, #D4AF37);
      transform: scale(1.3);
      box-shadow: 0 0 8px var(--brand-warm-gold, #D4AF37);
    }

    .editorial-media {
      transform: translateX(-30px);
      opacity: 0;
      transition: transform 0.8s ease, opacity 0.8s ease;
    }

    .editorial-text {
      transform: translateX(30px);
      opacity: 0;
      transition: transform 0.8s ease, opacity 0.8s ease;
    }

    .editorial-section.in-view .editorial-media,
    .editorial-section.in-view .editorial-text {
      transform: translateX(0);
      opacity: 1;
    }

    /* FAQ Section Styles (Pure White Background) */
    .faq-section {
      background-color: #FFFFFF;
      border-top: 1px solid rgba(91, 70, 54, 0.08);
      border-bottom: 1px solid rgba(91, 70, 54, 0.08);
    }

    .faq-header {
      margin-bottom: 48px;
    }

    .faq-eyebrow {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--brand-warm-gold, #CFA874);
      text-transform: uppercase;
      display: block;
      margin-bottom: 8px;
    }

    .faq-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      color: var(--brand-mocha-brown, #5B4636);
      margin-bottom: 12px;
      font-weight: 600;
    }

    .faq-title em {
      font-style: italic;
      color: var(--brand-warm-gold, #CFA874);
    }

    .faq-subtitle {
      font-size: 0.95rem;
      color: #666666;
      max-width: 580px;
      margin: 0 auto;
    }

    .faq-accordion-wrapper {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .faq-item {
      background: var(--brand-pearl-beige, #F9F7F2);
      border: 1px solid rgba(91, 70, 54, 0.12);
      border-radius: 12px;
      overflow: hidden;
      transition: background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, transform 0.3s ease;
      box-shadow: 0 2px 8px rgba(91, 70, 54, 0.04);
    }

    .faq-item:hover {
      border-color: rgba(207, 168, 116, 0.5);
      transform: translateY(-2px);
    }

    .faq-item.active {
      background: #FFFFFF;
      border-color: var(--brand-warm-gold, #CFA874);
      box-shadow: 0 8px 24px rgba(207, 168, 116, 0.18);
      transform: translateY(-2px);
    }

    .faq-question-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px;
      background: transparent;
      border: none;
      text-align: left;
      cursor: pointer;
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--brand-mocha-brown, #5B4636);
      transition: color 0.25s ease;
    }

    .faq-item.active .faq-question-btn {
      color: var(--brand-warm-gold, #CFA874);
    }

    .faq-toggle-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(207, 168, 116, 0.12);
      color: var(--brand-warm-gold, #CFA874);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, color 0.3s ease;
    }

    .faq-toggle-icon svg {
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .faq-item.active .faq-toggle-icon {
      background: var(--brand-warm-gold, #CFA874);
      color: #FFFFFF;
    }

    .faq-item.active .faq-toggle-icon svg {
      transform: rotate(45deg);
    }

    /* Smooth Expand/Collapse Grid Animation */
    .faq-answer-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .faq-answer-wrapper.open {
      grid-template-rows: 1fr;
    }

    .faq-answer-inner {
      overflow: hidden;
    }

    .faq-answer-panel {
      padding: 0 24px 24px 24px;
      border-top: 1px solid rgba(91, 70, 54, 0.08);
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 0.3s ease 0.06s, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.06s;
    }

    .faq-answer-wrapper.open .faq-answer-panel {
      opacity: 1;
      transform: translateY(0);
    }

    .faq-answer-text {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.94rem;
      line-height: 1.65;
      color: #555555;
      margin: 16px 0 0 0;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  categories: Category[] = [];
  featuredProducts: ProductCardData[] = [];
  newArrivals: ProductCardData[] = [];
  bestsellerProducts: ProductCardData[] = [];
  activeOccasionId = 'wedding';

  faqs = [
    {
      question: 'Are all Arista Trinkets jewellery pieces certified and hallmarked?',
      answer: 'Yes, every piece of gold, diamond, and precious gemstone jewellery from Arista Trinkets is 100% BIS hallmarked and comes with an official certificate of authenticity.',
      isOpen: false
    },
    {
      question: 'What is your return and exchange policy?',
      answer: 'We offer a hassle-free 30-day money-back guarantee and complimentary exchanges on all unworn items in their original packaging.',
      isOpen: false
    },
    {
      question: 'How do I find my correct ring size?',
      answer: 'We provide a detailed Ring Size Guide on every product page. You can also request a complimentary physical ring sizer sent straight to your doorstep.',
      isOpen: false
    },
    {
      question: 'Do you offer custom jewellery design services?',
      answer: 'Absolutely. Our master artisans work directly with you to craft bespoke engagement rings, custom engravings, and heritage heirloom redesigns.',
      isOpen: false
    },
    {
      question: 'How should I care for and clean my demi fine, anti tarnish jewellery?',
      answer: 'Store your pieces individually in soft velvet pouches away from direct moisture. We provide a complimentary luxury polishing cloth and care guide with every order.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    const wasOpen = this.faqs[index].isOpen;
    this.faqs.forEach(faq => (faq.isOpen = false));
    if (!wasOpen) {
      this.faqs[index].isOpen = true;
    }
  }

  currentSlideIndex = 0;
  slideProgress = 0;
  progressInterval: any;
  isPaused = false;

  videoSlideshowList = [
    {
      id: 'bow-pearl-flatlay',
      type: 'Curated Suite',
      icon: '✨',
      title: 'Demi Fine, Anti Tarnish Bow & Pearl Suite',
      subtitle: '18K Gold & South Sea Pearl',
      description: '18K gold ribbon bow pendant necklace with South Sea pearl drop, bow earrings, and matching ring set.',
      image: '/assets/images/slideshow-1.jpg',
      slug: 'necklaces'
    },
    {
      id: 'model-portrait',
      type: 'Atelier Collection',
      icon: '💎',
      title: 'Elegance Made Forever',
      subtitle: 'Modern Sculptural Grace',
      description: 'Sculptural ribbon bow pendant necklace and drop earrings designed for effortless modern sophistication.',
      image: '/assets/images/slideshow-2.jpg',
      slug: 'earrings'
    },
    {
      id: 'couple-gifting',
      type: 'Bespoke Moments',
      icon: '🌸',
      title: 'Surprise Your Loved Ones',
      subtitle: 'Unforgettable Gestures',
      description: 'An intimate gifting gesture — precious gold pendants and luxury gift boxes for unforgettable moments.',
      image: '/assets/images/slideshow-3.jpg',
      slug: 'pendants'
    },
    {
      id: 'luxury-unboxing',
      type: 'Luxury Experience',
      icon: '🎁',
      title: 'Celebratory Luxury Gifting',
      subtitle: 'Signature Gift Packaging',
      description: 'Unbox timeless gold treasures packaged in our signature luxury gift box with celebratory toast.',
      image: '/assets/images/slideshow-4.jpg',
      slug: 'rings'
    }
  ];

  get currentSlide() {
    return this.videoSlideshowList[this.currentSlideIndex];
  }

  occasionList = [
    {
      id: 'daily-wear',
      title: 'Daily Wear',
      subtitle: 'Minimalist & Effortless',
      description: 'Sleek, lightweight everyday gold & diamond pieces designed for effortless elegance and work-to-dinner style.',
      image: '/assets/images/occasion-daily-wear.jpg',
      slug: 'daily-wear'
    },
    {
      id: 'wedding',
      title: 'Wedding',
      subtitle: 'Eternal Heirloom Grace',
      description: 'Heirloom-worthy statements — the pieces you save for the day you want to remember forever.',
      image: '/assets/images/occasion-wedding.jpg',
      slug: 'wedding'
    },
    {
      id: 'gifting',
      title: 'Gifting',
      subtitle: 'Precious Tokens of Love',
      description: 'Curated luxury jewellery gifts crafted to celebrate life’s most precious milestones, anniversaries, and birthdays.',
      image: '/assets/images/occasion-gifting.jpg',
      slug: 'gifting'
    },
    {
      id: 'festive',
      title: 'Festive',
      subtitle: 'Grand Celebration Shimmer',
      description: 'Traditional and contemporary shimmer for grand celebrations, pujas, and bright festive moments.',
      image: '/assets/images/occasion-festive.jpg',
      slug: 'festive'
    }
  ];

  editorialPhoto: string = '/assets/images/editorial-artisanal-craft.jpg';

  @ViewChild('heritageSection') heritageSection?: ElementRef<HTMLElement>;
  @ViewChild('heritageBg') heritageBg?: ElementRef<HTMLElement>;

  private isTicking = false;

  private mockDataService = inject(MockDataService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isTicking) {
      window.requestAnimationFrame(() => {
        this.updateParallaxScrollEffect();
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  }

  private updateParallaxScrollEffect(): void {
    if (typeof window === 'undefined' || !this.heritageSection || !this.heritageBg) return;
    const el = this.heritageSection.nativeElement;
    const bg = this.heritageBg.nativeElement;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);

      // Smooth background image zoom out on scroll (starts at scale 1.28 -> scales down to 1.03)
      // and vertical parallax shift (-75px -> +75px)
      const scale = 1.28 - (progress * 0.25);
      const translateY = (progress - 0.5) * -75;

      bg.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }
  }

  ngOnInit(): void {
    fetch(API_ENDPOINTS.HOMEPAGE_CONFIG)
      .then(res => res.json())
      .then(data => {
        if (data?.success && data?.data?.editorial_photo) {
          this.editorialPhoto = data.data.editorial_photo;
          this.cdr.markForCheck();
        }
      })
      .catch(err => console.error('Failed to load homepage config:', err));

    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.mockDataService.getFeaturedProducts().subscribe(prods => {
      this.featuredProducts = prods;
    });

    this.mockDataService.getNewArrivals().subscribe(prods => {
      this.newArrivals = [...prods].sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : (parseInt(String(a.id), 10) || 0);
        const idB = typeof b.id === 'number' ? b.id : (parseInt(String(b.id), 10) || 0);
        return idB - idA;
      }).slice(0, 4);
    });

    this.mockDataService.getBestsellers().subscribe(prods => {
      this.bestsellerProducts = [...prods].sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : (parseInt(String(a.id), 10) || 0);
        const idB = typeof b.id === 'number' ? b.id : (parseInt(String(b.id), 10) || 0);
        return idB - idA;
      });
    });

    this.startSlideshowTimer();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateParallaxScrollEffect(), 100);

    if (typeof window !== 'undefined') {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              entry.target.classList.add('revealed');
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        const revealTargets = document.querySelectorAll(
          '.scroll-reveal, .scroll-reveal-stagger, .editorial-section, .occasion-section, .brand-intro-section, .new-arrivals-section, .why-choose-grid, .insta-grid-section'
        );
        revealTargets.forEach(el => observer.observe(el));
      } else {
        const revealTargets = document.querySelectorAll(
          '.scroll-reveal, .scroll-reveal-stagger, .editorial-section, .occasion-section, .brand-intro-section, .new-arrivals-section, .why-choose-grid, .insta-grid-section'
        );
        revealTargets.forEach(el => el.classList.add('in-view', 'revealed'));
      }
    }
  }

  getDiscountPercentage(product: ProductCardData): number {
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

  addToBag(product: ProductCardData, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      slug: product.slug
    } as any, 1);
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  startSlideshowTimer(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.slideProgress = 0;
    const durationMs = 3500;
    const stepMs = 50;

    this.progressInterval = setInterval(() => {
      if (!this.isPaused) {
        this.slideProgress += (stepMs / durationMs) * 100;
        if (this.slideProgress >= 100) {
          this.currentSlideIndex = (this.currentSlideIndex + 1) % this.videoSlideshowList.length;
          this.slideProgress = 0;
        }
        this.cdr.detectChanges();
      }
    }, stepMs);
  }

  pauseSlideshow(): void {
    this.isPaused = true;
  }

  resumeSlideshow(): void {
    this.isPaused = false;
  }

  selectSlide(index: number): void {
    this.currentSlideIndex = index;
    this.startSlideshowTimer();
    this.cdr.detectChanges();
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.videoSlideshowList.length;
    this.startSlideshowTimer();
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.videoSlideshowList.length) % this.videoSlideshowList.length;
    this.startSlideshowTimer();
    this.cdr.detectChanges();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/images/placeholder-jewellery.svg';
  }
}
