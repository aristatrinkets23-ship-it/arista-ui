import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Category } from '../../core/models/category.model';
import { CategoryService, getDefaultCategoryImage } from '../../core/services/category.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Categories Hero -->
    <section class="cat-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow">Explore By Category</span>
          <h1 class="hero-title">Signature Jewellery Collections</h1>
          <p class="hero-desc">
            From solitaire diamond rings to delicate freshwater pearl drops, discover our masterfully sculpted collections.
          </p>
        </div>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="section-padding">
      <div class="container">
        <div *ngIf="categories.length > 0" class="categories-list">
          <div *ngFor="let cat of categories; let i = index" class="cat-block" [class.reverse]="i % 2 !== 0">
            <div class="cat-image-box">
              <img
                [src]="cat.image"
                [alt]="cat.name"
                (error)="onCatImageError($event, cat)"
                class="cat-img"
              />
              <div class="cat-badge">{{ cat.itemCount }} {{ cat.itemCount === 1 ? 'Unique Design' : 'Unique Designs' }}</div>
            </div>
            <div class="cat-details">
              <span class="cat-eyebrow">Collection {{ i + 1 }}</span>
              <h2 class="cat-name">{{ cat.name }}</h2>
              <p class="cat-desc">{{ cat.description }}</p>
              <div class="cat-actions">
                <a [routerLink]="['/shop']" [queryParams]="{ category: cat.slug }">
                  <app-button variant="primary" size="md">Explore {{ cat.name }} &rarr;</app-button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="categories.length === 0" class="empty-state-card" style="text-align: center; padding: 60px 24px; background: var(--brand-pearl-beige); border-radius: 16px; border: 1px dashed var(--brand-warm-gold); max-width: 600px; margin: 0 auto;">
          <div style="font-size: 3rem; margin-bottom: 12px; color: var(--brand-warm-gold);">💎</div>
          <h2 style="font-family: var(--font-serif); color: var(--brand-mocha-brown); font-size: 1.6rem; margin-bottom: 8px;">No Categories Found</h2>
          <p style="color: #666; font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6;">There are currently no categories added to the collection catalog. Please add categories and products from the admin panel.</p>
          <a routerLink="/admin" style="padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: 700; background: var(--brand-warm-gold); color: #1A120B; font-size: 0.9rem; display: inline-block;">
            ⚙ Go to Admin to Add Products & Categories
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cat-hero {
      position: relative;
      background-image: url('/assets/images/hero-categories.jpg');
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

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    @media (min-width: 992px) {
      .categories-list {
        gap: 64px;
      }
    }

    .cat-block {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      align-items: center;
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    @media (min-width: 992px) {
      .cat-block {
        grid-template-columns: 1fr 1fr;
        padding: 40px;
        gap: 48px;
      }

      .cat-block.reverse .cat-image-box {
        order: 2;
      }
      .cat-block.reverse .cat-details {
        order: 1;
      }
    }

    .cat-image-box {
      position: relative;
      border-radius: var(--radius-sm);
      overflow: hidden;
      aspect-ratio: 4/3;
      background: var(--brand-pearl-beige);
    }

    .cat-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
    }

    .cat-block:hover .cat-img {
      transform: scale(1.04);
    }

    .cat-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(44, 34, 25, 0.85);
      backdrop-filter: blur(4px);
      color: var(--brand-warm-gold);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: var(--radius-sm);
    }

    .cat-eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 6px;
    }

    .cat-name {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 3.5vw, 2.5rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
    }

    .cat-desc {
      font-size: 1rem;
      color: #555555;
      line-height: 1.65;
      margin-bottom: 24px;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  onCatImageError(event: Event, cat?: Category): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = getDefaultCategoryImage(cat?.slug || cat?.name);
    }
  }
}
