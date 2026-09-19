import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Category } from '../../core/models/category.model';
import { MockDataService } from '../../core/mock/mock-data.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Categories Hero -->
    <section class="cat-hero text-center">
      <div class="container">
        <span class="hero-eyebrow">Explore By Category</span>
        <h1 class="hero-title">Signature Jewellery Collections</h1>
        <p class="hero-desc">
          From solitaire diamond rings to delicate freshwater pearl drops, discover our masterfully sculpted collections.
        </p>
      </div>
    </section>

    <!-- Categories Grid -->
    <section class="section-padding">
      <div class="container">
        <div class="categories-list">
          <div *ngFor="let cat of categories; let i = index" class="cat-block" [class.reverse]="i % 2 !== 0">
            <div class="cat-image-box">
              <img [src]="cat.image" [alt]="cat.name" class="cat-img" />
              <div class="cat-badge">{{ cat.itemCount }} Unique Designs</div>
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
      </div>
    </section>
  `,
  styles: [`
    .cat-hero {
      background: linear-gradient(135deg, rgba(247, 233, 230, 0.9) 0%, rgba(242, 239, 232, 0.95) 100%), url('/assets/images/placeholder-banner.svg');
      background-size: cover;
      padding: 56px 0;
      border-bottom: 1px solid var(--color-border);
    }
    @media (min-width: 768px) {
      .cat-hero { padding: 80px 0; }
    }

    .hero-eyebrow {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      display: block;
      margin-bottom: 8px;
    }

    .hero-title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 5vw, 3.4rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
    }

    .hero-desc {
      font-size: 1.05rem;
      color: #555555;
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.6;
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
      aspect-ratio: 1 / 1;
      border-radius: var(--radius-md);
      overflow: hidden;
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
    }

    .cat-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cat-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      background-color: var(--brand-mocha-brown);
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

  private mockDataService = inject(MockDataService);

  ngOnInit(): void {
    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }
}
