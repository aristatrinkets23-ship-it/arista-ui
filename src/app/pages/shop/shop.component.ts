import { Component, OnInit, inject } from '@angular/core';
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
    <section class="shop-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow">The Complete Collection</span>
          <h1 class="hero-title">Fine & Fashion Jewellery</h1>
          <p class="hero-desc">
            Explore handcrafted gold rings, layered necklaces, pearl drop earrings, and diamond cuff bracelets.
          </p>
        </div>
      </div>
    </section>

    <!-- Shop Control Toolbar & Filters -->
    <section class="section-padding">
      <div class="container">
        <div class="shop-toolbar">
          <!-- Category Filter Tabs -->
          <div class="filter-tabs">
            <button
              *ngFor="let tab of filterTabs"
              type="button"
              [class.active]="selectedCategory === tab.slug"
              (click)="selectCategory(tab.slug)"
              class="tab-btn"
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

        <!-- Product Grid -->
        <div *ngIf="!isLoading && products.length > 0" class="grid-products">
          <app-product-card
            *ngFor="let product of products"
            [product]="product"
          ></app-product-card>
        </div>

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && products.length === 0"
          title="No Creations Found"
          description="We could not find any jewellery items matching your selected category."
          actionText="View All Collections"
          actionPath="/shop"
        ></app-empty-state>
      </div>
    </section>
  `,
  styles: [`
    .shop-hero {
      position: relative;
      background-image: url('/assets/images/hero-shop.jpg');
      background-size: cover;
      background-position: center right;
      background-repeat: no-repeat;
      padding: 72px 0 60px 0;
      min-height: 380px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--brand-warm-gold);
      color: #FFFFFF;
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
      max-width: 600px;
      text-align: left;
    }

    .hero-eyebrow {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: var(--brand-warm-gold);
      display: block;
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
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .tab-btn {
      background-color: var(--brand-pearl-beige);
      color: var(--brand-mocha-brown);
      border: 1px solid var(--color-border);
      padding: 10px 20px;
      min-height: 44px;
      border-radius: var(--radius-full);
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .tab-btn:hover, .tab-btn.active {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border-color: var(--brand-warm-gold);
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
    }

    .sort-select:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
    }
  `]
})
export class ShopComponent implements OnInit {
  products: ProductCardData[] = [];
  isLoading: boolean = true;
  selectedCategory: string = 'all';
  selectedSort: string = 'featured';

  filterTabs = [
    { label: 'All Jewels', slug: 'all' },
    { label: 'Rings', slug: 'rings' },
    { label: 'Necklaces', slug: 'necklaces' },
    { label: 'Earrings', slug: 'earrings' },
    { label: 'Bracelets', slug: 'bracelets' }
  ];

  private mockDataService = inject(MockDataService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const catParam = params['category'];
      if (catParam) {
        this.selectedCategory = catParam.toLowerCase();
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.mockDataService.getProducts(this.selectedCategory, this.selectedSort).subscribe(prods => {
      this.products = prods;
      this.isLoading = false;
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
