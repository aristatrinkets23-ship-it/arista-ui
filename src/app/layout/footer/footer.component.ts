import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/mock/mock-data.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container footer-grid">
        <!-- Brand Column -->
        <div class="footer-col brand-col">
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo-link" aria-label="Arista Trinkets Home">
              <span class="footer-logo-full" role="img" aria-label="Arista Trinkets Fine Jewellery"></span>
            </a>
          </div>
          <p class="brand-tagline">
            Handcrafted fine jewellery created with timeless gold, silver, and precious stones for every occasion.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="col-title">Collections</h4>
          <ul class="footer-links">
            <ng-container *ngIf="categories.length > 0">
              <li *ngFor="let cat of categories">
                <a routerLink="/shop" [queryParams]="{ category: cat.slug }">{{ cat.name }}</a>
              </li>
            </ng-container>
            <ng-container *ngIf="categories.length === 0">
              <li><a routerLink="/shop">All Collections</a></li>
            </ng-container>
          </ul>
        </div>

        <!-- Customer Care -->
        <div class="footer-col">
          <h4 class="col-title">Customer Care</h4>
          <ul class="footer-links">
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/contact">Contact Us</a></li>
            <li><a routerLink="/account">My Account</a></li>
            <li><a routerLink="/cart">Shopping Bag</a></li>
          </ul>
        </div>

        <!-- Newsletter Column -->
        <div class="footer-col newsletter-col">
          <h4 class="col-title">The Arista Club</h4>
          <p class="newsletter-desc">Subscribe to receive private invitations to new collection launches.</p>
          <form class="newsletter-form" (submit)="onNewsletterSubmit($event)">
            <input type="email" placeholder="Enter your email address" class="newsletter-input" aria-label="Email Address" required />
            <button type="submit" class="newsletter-btn">Join</button>
          </form>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="copyright-bar">
        <div class="container copyright-content">
          <p>&copy; 2026 Arista Trinkets Jewellery. All rights reserved.</p>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="separator">|</span>
            <a routerLink="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background-color: #1A120B;
      color: var(--brand-pearl-beige);
      padding-top: 36px;
      border-top: 3px solid var(--brand-warm-gold);
    }

    @media (min-width: 768px) {
      .site-footer {
        padding-top: 56px;
      }
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      padding-bottom: 36px;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: 2fr 1fr 1fr 2fr;
        gap: 28px;
        padding-bottom: 48px;
      }
    }

    .footer-brand {
      display: inline-flex;
      align-items: center;
      margin-bottom: 14px;
    }

    .footer-logo-link {
      display: inline-flex;
      align-items: center;
      gap: 0;
      text-decoration: none;
      padding: 4px 0;
      transition: transform var(--transition-fast), opacity var(--transition-fast);
    }
    .footer-logo-link:hover {
      transform: translateY(-1px);
      opacity: 0.92;
    }

    .footer-logo-full {
      display: inline-block;
      width: 148px;
      height: 48px;
      background-image: url('/assets/images/full-logo-transparent.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left center;
      filter: brightness(0) invert(1);
    }

    .brand-tagline {
      font-size: 0.92rem;
      color: #C2B3A7;
      line-height: 1.6;
      max-width: 300px;
    }

    .col-title {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      color: var(--brand-warm-gold);
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: var(--brand-pearl-beige);
      font-size: 0.92rem;
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--brand-warm-gold);
    }

    .newsletter-desc {
      font-size: 0.9rem;
      color: #C2B3A7;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      gap: 8px;
    }

    .newsletter-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(207, 168, 116, 0.3);
      border-radius: var(--radius-sm);
      color: #FFFFFF;
      font-size: 0.88rem;
    }

    .newsletter-input::placeholder {
      color: #9E8E82;
    }

    .newsletter-input:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
    }

    .newsletter-btn {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      text-transform: uppercase;
      transition: background var(--transition-fast);
    }

    .newsletter-btn:hover {
      background-color: #E2B882;
    }

    .copyright-bar {
      border-top: 1px solid rgba(207, 168, 116, 0.15);
      padding: 20px 0;
      font-size: 0.82rem;
      color: #A39387;
    }

    .copyright-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      text-align: center;
    }

    @media (min-width: 768px) {
      .copyright-content {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .legal-links {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .legal-links a {
      color: #C2B3A7;
      text-decoration: none;
    }
    .legal-links a:hover {
      color: var(--brand-warm-gold);
    }
    .separator {
      color: #7D6452;
    }
  `]
})
export class FooterComponent implements OnInit {
  categories: Category[] = [];

  private mockDataService = inject(MockDataService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.mockDataService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    alert('Thank you for joining The Arista Club!');
  }
}
