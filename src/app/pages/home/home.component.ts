import { Component, OnInit, inject } from '@angular/core';
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
      <div class="container hero-content">
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
            <app-button variant="outline" size="lg">Our Atelier Craft</app-button>
          </a>
        </div>

        <!-- Floating Feature Highlight Bar -->
        <div class="hero-feature-bar">
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <div class="feature-text">
              <strong>FREE SHIPPING</strong>
              <span>On Every Order</span>
            </div>
          </div>
          <span class="feature-divider"></span>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <div class="feature-text">
              <strong>30-DAY RETURNS</strong>
              <span>No Questions Asked</span>
            </div>
          </div>
          <span class="feature-divider"></span>
          <div class="feature-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div class="feature-text">
              <strong>SECURE PAYMENT</strong>
              <span>Encrypted Checkout</span>
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

        <div class="category-grid">
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
              <span class="category-count">{{ cat.itemCount }} Items</span>
              <span class="category-cta">SHOP COLLECTION &rarr;</span>
            </div>
          </a>
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

        <div class="grid-products">
          <app-product-card
            *ngFor="let product of featuredProducts"
            [product]="product"
          ></app-product-card>
        </div>
      </div>
    </section>

    <!-- Editorial / Brand Visual Section -->
    <section class="editorial-section">
      <div class="container editorial-grid">
        <div class="editorial-media">
          <img src="/assets/images/placeholder-banner.svg" alt="Arista Editorial Jewellery Craft" class="editorial-img" />
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
      background: linear-gradient(135deg, rgba(247, 233, 230, 0.88) 0%, rgba(242, 239, 232, 0.92) 50%, rgba(232, 227, 243, 0.88) 100%), url('/assets/images/placeholder-banner.svg');
      background-size: cover;
      background-position: center;
      padding: 56px 0;
      text-align: center;
      border-bottom: 1px solid var(--color-border);
    }

    @media (min-width: 768px) {
      .hero-section {
        padding: 92px 0;
      }
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-subtitle {
      font-family: var(--font-sans);
      font-size: var(--font-size-eyebrow);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: var(--brand-warm-gold);
      margin-bottom: 8px;
      display: block;
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: var(--font-size-hero-title);
      color: var(--brand-mocha-brown);
      margin-bottom: 16px;
      line-height: 1.15;
      font-weight: 700;
    }

    .hero-description {
      font-size: var(--font-size-hero-body);
      color: #4A3A2C;
      margin-bottom: 32px;
      line-height: 1.6;
      max-width: 640px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-cta-link {
      display: inline-block;
      text-decoration: none;
    }

    /* Hero Feature Bar */
    .hero-feature-bar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 36px;
      padding: 12px 28px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(207, 168, 116, 0.4);
      border-radius: var(--radius-full);
      box-shadow: 0 4px 20px rgba(91, 70, 54, 0.08);
      max-width: 100%;
      flex-wrap: wrap;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--brand-mocha-brown);
    }

    .feature-item svg {
      color: var(--brand-warm-gold);
      flex-shrink: 0;
    }

    .feature-text {
      display: flex;
      flex-direction: column;
      text-align: left;
      line-height: 1.25;
    }

    .feature-text strong {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--brand-mocha-brown);
    }

    .feature-text span {
      font-size: 0.68rem;
      color: #776655;
    }

    .feature-divider {
      width: 1px;
      height: 24px;
      background-color: rgba(207, 168, 116, 0.4);
    }

    @media (max-width: 640px) {
      .hero-feature-bar {
        gap: 12px;
        padding: 10px 16px;
      }
      .feature-divider {
        display: none;
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
      aspect-ratio: 4 / 3;
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
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  featuredProducts: ProductCardData[] = [];

  private mockDataService = inject(MockDataService);

  ngOnInit(): void {
    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.mockDataService.getFeaturedProducts().subscribe(prods => {
      this.featuredProducts = prods;
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/images/placeholder-jewellery.svg';
  }
}
