import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ProductCardData } from '../../core/models/product-card-data.model';
import { MockDataService } from '../../core/mock/mock-data.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SectionHeadingComponent,
    ProductCardComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <!-- Shop Page Header -->
    <section class="shop-hero animate-on-scroll">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow animate-child">The Complete Collection</span>
          <h1 class="hero-title animate-child">Fine & Fashion Jewellery</h1>
          <p class="hero-desc animate-child">
            Explore demi fine, anti tarnish jewellery: rings, layered necklaces, pearl drop earrings, and cuff bracelets.
          </p>
        </div>
      </div>
    </section>

    <!-- Shop Control Toolbar & Filters -->
    <section class="section-padding shop-main-section animate-on-scroll">
      <div class="container">
        <div class="shop-toolbar animate-fade-up" *ngIf="filterTabs.length > 1 || products.length > 0">
          <!-- Category Filter Tabs -->
          <div class="filter-tabs">
            <button
              *ngFor="let tab of filterTabs; let i = index"
              type="button"
              [class.active]="selectedCategory === tab.slug"
              (click)="selectCategory(tab.slug)"
              class="tab-btn"
              [style.--tab-index]="i + 1"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Sort Selector -->
          <div class="sort-wrapper">
            <label for="sortSelect" class="sort-label">Sort By:</label>
            <select
              id="sortSelect"
              [value]="selectedSort"
              (change)="onSortChange($event)"
              class="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <app-loading-spinner *ngIf="isLoading" message="Curating collection..."></app-loading-spinner>

        <!-- Product Grid with Staggered Entrance -->
        <div *ngIf="!isLoading && products.length > 0" class="grid-products">
          <app-product-card
            *ngFor="let product of products; let i = index"
            [product]="product"
            class="animate-stagger-card"
            [style.--stagger-index]="(i % 8) + 1"
          ></app-product-card>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && products.length === 0"
          title="No Products Available"
          description="There are currently no jewellery items or categories in the catalog. Add categories and products from the Admin Panel."
          actionText="⚙ Go to Admin Panel to Add Products & Categories"
          actionPath="/admin"
        ></app-empty-state>
      </div>
    </section>
  `,
  styles: [`
    /* Section Scroll Reveal Animation Base */
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }

    .animate-on-scroll.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .animate-fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .animate-stagger-card {
      opacity: 0;
      transform: translateY(30px) scale(0.96);
      transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: calc(var(--stagger-index, 1) * 0.07s);
      will-change: opacity, transform;
    }

    .in-view .animate-fade-up,
    .in-view .animate-stagger-card,
    .animate-fade-up.in-view,
    .animate-stagger-card.in-view {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    /* Shop Hero */
    .shop-hero {
      position: relative;
      background-image: url('/assets/images/hero-shop.jpg');
      background-size: cover;
      background-position: center right;
      background-repeat: no-repeat;
      padding: 80px 0 68px 0;
      min-height: 400px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--brand-warm-gold);
      color: #FFFFFF;
      overflow: hidden;
    }

    .hero-bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg, 
        rgba(26, 18, 11, 0.9) 0%, 
        rgba(26, 18, 11, 0.68) 45%, 
        rgba(26, 18, 11, 0.35) 75%, 
        rgba(26, 18, 11, 0.08) 100%
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

    .hero-eyebrow {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold);
      display: inline-block;
      margin-bottom: 12px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(2.2rem, 4.2vw, 3.4rem);
      color: #FFFFFF;
      margin-bottom: 14px;
      line-height: 1.15;
      font-weight: 700;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    }

    .hero-desc {
      font-size: 1.05rem;
      color: #F3ECE4;
      line-height: 1.65;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }

    .shop-toolbar {
      display: flex;
      flex-direction: column;
      gap: 20px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 36px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--color-border);
    }

    @media (min-width: 768px) {
      .shop-toolbar {
        flex-direction: row;
      }
    }

    .filter-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .tab-btn {
      background-color: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--color-border);
      padding: 10px 22px;
      min-height: 44px;
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .tab-btn:hover {
      background-color: rgba(207, 168, 116, 0.2);
      border-color: var(--brand-warm-gold);
      transform: translateY(-2px);
    }

    .tab-btn.active {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border-color: var(--brand-warm-gold);
      box-shadow: 0 6px 18px rgba(207, 168, 116, 0.35);
      transform: translateY(-2px);
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sort-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      text-transform: uppercase;
    }

    .sort-select {
      padding: 10px 16px;
      min-height: 44px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: 0.88rem;
      color: var(--brand-mocha-brown);
      background-color: #FFFFFF;
      cursor: pointer;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .sort-select:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.2);
    }
  `]
})
export class ShopComponent implements OnInit, AfterViewInit {
  products: ProductCardData[] = [];
  isLoading: boolean = true;
  selectedCategory: string = 'all';
  selectedSort: string = 'featured';

  filterTabs: { label: string; slug: string }[] = [
    { label: 'All Jewels', slug: 'all' }
  ];

  private mockDataService = inject(MockDataService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.mockDataService.getCategories().subscribe(cats => {
      this.filterTabs = [
        { label: 'All Jewels', slug: 'all' },
        ...cats.map(c => ({ label: c.name, slug: c.slug }))
      ];
      this.cdr.detectChanges();
    });

    this.route.queryParams.subscribe(params => {
      const catParam = params['category'];
      if (catParam) {
        this.selectedCategory = catParam.toLowerCase();
      }
      this.loadProducts();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initScrollObserver(), 100);
  }

  private initScrollObserver(): void {
    if (typeof window === 'undefined') return;

    const targets = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-up, .animate-stagger-card'
    );

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      targets.forEach((el) => observer.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('in-view'));
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.mockDataService.getProducts(this.selectedCategory, this.selectedSort).subscribe(prods => {
      this.products = prods;
      this.isLoading = false;
      this.cdr.detectChanges();
      setTimeout(() => this.initScrollObserver(), 50);
    });
  }

  selectCategory(slug: string): void {
    this.selectedCategory = slug;
    this.loadProducts();
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSort = target.value;
    this.loadProducts();
  }
}

