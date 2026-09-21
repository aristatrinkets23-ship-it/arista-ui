import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { Category } from '../../core/models/category.model';
import { MockDataService } from '../../core/mock/mock-data.service';

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
    <!-- Hero Banner Section -->
    <section class="hero-section">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-subtitle">The New 2026 Fine Jewellery Collection</span>
          <h1 class="hero-title">Timeless Elegance,<br>Handcrafted for You</h1>
          <p class="hero-description">
            Discover our exquisite collection of 18K solid gold, sterling silver, and ethically sourced diamond creations designed for life's most precious milestones.
          </p>
          <div class="hero-actions">
            <a routerLink="/shop" class="hero-cta-link">
              <app-button variant="primary" size="lg">Explore Collection &rarr;</app-button>
            </a>
            <a routerLink="/about" class="hero-cta-link">
              <app-button variant="outline-light" size="lg">Our Atelier Craft</app-button>
            </a>
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
            HANDCRAFTED QUALITY
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
            HANDCRAFTED QUALITY
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

    <!-- Brand Introduction Section -->
    <section class="brand-intro-section">
      <div class="container intro-content text-center">
        <span class="intro-eyebrow">Handcrafted Fine Jewellery</span>
        <h2 class="intro-heading">Where Modern Artistry Meets Heritage Precision</h2>
        <p class="intro-tagline">
          “Timeless pieces, thoughtfully crafted to celebrate every you. ♡”
        </p>
        <div class="brand-mood-tags">
          <span class="mood-pill">ELEGANT</span>
          <span class="mood-pill">FEMININE</span>
          <span class="mood-pill">MINIMAL</span>
          <span class="mood-pill">TIMELESS</span>
          <span class="mood-pill">REFINED</span>
        </div>
      </div>
    </section>

    <!-- Featured Collections Grid -->
    <section class="section-padding bg-pearl">
      <div class="container">
        <app-section-heading
          subtitle="Curated Selection"
          title="Browse By Category"
          align="center"
        ></app-section-heading>

        <div *ngIf="categories.length > 0" class="category-grid">
          <a
            *ngFor="let cat of categories"
            [routerLink]="['/shop']"
            [queryParams]="{ category: cat.slug }"
            class="category-card"
          >
            <div class="category-img-wrapper">
              <img [src]="cat.image" [alt]="cat.name" class="category-img" loading="lazy" (error)="onImageError($event)" />
            </div>
            <div class="category-info">
              <h3 class="category-name">{{ cat.name }}</h3>
              <span class="category-count">{{ cat.itemCount }} {{ cat.itemCount === 1 ? 'Item' : 'Items' }}</span>
              <span class="category-cta">SHOP COLLECTION &rarr;</span>
            </div>
          </a>
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
    <section class="section-padding occasion-section">
      <div class="container">
        <app-section-heading
          subtitle="FIND YOUR MOMENT"
          title="Shop by Occasion"
          align="center"
        ></app-section-heading>

        <div class="occasion-accordion">
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

    <!-- Featured Products Section -->
    <section class="section-padding">
      <div class="container">
        <app-section-heading
          subtitle="Customer Favorites"
          title="Featured Creations"
          align="center"
        ></app-section-heading>

        <div *ngIf="featuredProducts.length > 0" class="grid-products">
          <app-product-card
            *ngFor="let product of featuredProducts"
            [product]="product"
          ></app-product-card>
        </div>

        <div *ngIf="featuredProducts.length === 0" class="empty-section-notice" style="text-align: center; padding: 40px 24px; background: rgba(207, 168, 116, 0.08); border-radius: 12px; border: 1px dashed var(--brand-warm-gold); max-width: 600px; margin: 0 auto;">
          <h3 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.3rem; margin-bottom: 8px;">No Products in Catalog</h3>
          <p style="color: #666; font-size: 0.92rem; margin-bottom: 20px;">Add jewellery pieces from the Admin Dashboard to feature them on the storefront.</p>
          <a routerLink="/admin" style="padding: 10px 24px; text-decoration: none; border-radius: 50px; font-weight: 700; background: var(--brand-warm-gold); color: #1A120B; font-size: 0.88rem; display: inline-block;">
            ⚙ Go to Admin to Add Products & Categories
          </a>
        </div>
      </div>
    </section>

    <!-- Editorial / Brand Visual Section -->
    <section class="editorial-section">
      <div class="container editorial-grid">
        <div class="editorial-media">
          <img src="/assets/images/editorial-artisanal-craft.jpg" alt="Master Goldsmith Crafting Fine Jewellery" class="editorial-img ken-burns" (error)="onImageError($event)" />
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

    .hero-content {
      max-width: 620px;
      text-align: left;
    }

    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: var(--font-size-eyebrow);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3.5px;
      color: var(--brand-warm-gold);
      margin-bottom: 16px;
      display: block;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 4.8vw, 3.8rem);
      color: #FFFFFF;
      margin-bottom: 20px;
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

    .category-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    @media (min-width: 768px) {
      .category-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }

    @media (min-width: 992px) {
      .category-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
    }

    .category-card {
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-sm);
    }

    .category-card:hover {
      border-color: var(--brand-warm-gold);
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .category-img-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      background-color: var(--brand-pearl-beige);
      overflow: hidden;
    }

    .category-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
      display: block;
    }

    .category-card:hover .category-img {
      transform: scale(1.06);
    }

    .category-info {
      padding: 12px 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    @media (min-width: 768px) {
      .category-info {
        padding: 16px 12px;
      }
    }

    .category-name {
      font-family: var(--font-serif);
      font-size: var(--font-size-card-title);
      font-weight: 600;
      color: var(--brand-mocha-brown);
      margin: 0;
      line-height: 1.25;
    }

    .category-count {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .category-cta {
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-warm-gold);
      font-weight: 700;
      margin-top: 6px;
      transition: color var(--transition-fast);
    }

    .category-card:hover .category-cta {
      color: var(--brand-mocha-brown);
    }

    /* Editorial Section */
    .editorial-section {
      padding: 64px 0;
      background-color: var(--brand-pearl-beige);
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
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

    /* Shop by Occasion Accordion Styles */
    .occasion-section {
      background-color: var(--brand-pearl-beige, #FAF7F2);
      padding: 72px 0;
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
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredProducts: ProductCardData[] = [];
  activeOccasionId = 'wedding';

  currentSlideIndex = 0;
  slideProgress = 0;
  progressInterval: any;
  isPaused = false;

  videoSlideshowList = [
    {
      id: 'bow-pearl-flatlay',
      type: 'Curated Suite',
      icon: '✨',
      title: 'Handcrafted Bow & Pearl Suite',
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

  private mockDataService = inject(MockDataService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.mockDataService.getFeaturedProducts().subscribe(prods => {
      this.featuredProducts = prods;
    });

    this.startSlideshowTimer();
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
