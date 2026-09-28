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
            Demi fine, anti tarnish jewellery created with timeless gold, silver, and precious stones for every occasion.
          </p>
          <!-- Social Links -->
          <div class="footer-socials" aria-label="Social media connections">
            <a href="#" class="social-icon" aria-label="Instagram" (click)="$event.preventDefault()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Facebook" (click)="$event.preventDefault()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Pinterest" (click)="$event.preventDefault()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.67 7.9 6.42 9.34-.09-.78-.17-1.98.04-2.83.19-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.53 1.9 1.56 1.9 1.88 0 3.32-1.98 3.32-4.84 0-2.53-1.82-4.3-4.41-4.3-3.01 0-4.78 2.26-4.78 4.59 0 .91.35 1.89.79 2.42.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.2-.05.21-.18.26-.41.16-1.53-.71-2.48-2.94-2.48-4.73 0-3.85 2.8-7.39 8.07-7.39 4.24 0 7.53 3.02 7.53 7.06 0 4.21-2.65 7.6-6.34 7.6-1.24 0-2.41-.64-2.81-1.4l-.76 2.91c-.28 1.06-1.04 2.39-1.55 3.22C9.84 21.81 10.9 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="WhatsApp" (click)="$event.preventDefault()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="col-title">Collections</h4>
          <ul class="footer-links">
            <ng-container *ngIf="categories.length > 0">
              <li *ngFor="let cat of categories">
                <a routerLink="/shop" [queryParams]="{ category: cat.slug }">{{ formatCategoryName(cat.name) }}</a>
              </li>
            </ng-container>
            <ng-container *ngIf="categories.length === 0">
              <li><a routerLink="/shop">Necklaces</a></li>
              <li><a routerLink="/shop">Rings</a></li>
              <li><a routerLink="/shop">Earrings</a></li>
              <li><a routerLink="/shop">Pendants</a></li>
              <li><a routerLink="/shop">Silver Pendants</a></li>
              <li><a routerLink="/shop">Nath</a></li>
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
            <li><a routerLink="/about">Certifications</a></li>
          </ul>
        </div>

        <!-- Newsletter Column -->
        <div class="footer-col newsletter-col">
          <h4 class="col-title">The Arista Club</h4>
          <p class="newsletter-desc">Subscribe to receive private invitations to new collection launches and VIP previews.</p>
          <form class="newsletter-form" (submit)="onNewsletterSubmit($event)">
            <input type="email" placeholder="Enter your email address" class="newsletter-input" aria-label="Email Address" required />
            <button type="submit" class="newsletter-btn">Join</button>
          </form>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="copyright-bar">
        <div class="container copyright-content">
          <p class="copyright-text">&copy; 2026 Arista Trinkets Jewellery. All rights reserved.</p>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="separator">&bull;</span>
            <a routerLink="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background-color: #1A120B;
      color: #F5EBDD;
      padding-top: 56px;
      border-top: 3px solid #CFA874;
      font-family: 'Montserrat', var(--font-sans, sans-serif);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
      padding-bottom: 48px;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: 2.2fr 1fr 1fr 2fr;
        gap: 32px;
        padding-bottom: 56px;
      }
    }

    .footer-brand {
      display: inline-flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .footer-logo-link {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    .footer-logo-link:hover {
      transform: translateY(-2px);
      opacity: 0.95;
    }

    .footer-logo-full {
      display: inline-block;
      width: 170px;
      height: 52px;
      background-image: url('/assets/images/full-logo-transparent.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left center;
      filter: brightness(0) invert(1);
    }

    .brand-tagline {
      font-size: 0.92rem;
      color: #C2B3A7;
      line-height: 1.65;
      max-width: 320px;
      margin-bottom: 20px;
    }

    .footer-socials {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(207, 168, 116, 0.3);
      color: #F5EBDD;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .social-icon:hover {
      background: #CFA874;
      color: #1A120B;
      border-color: #CFA874;
      transform: translateY(-2px);
    }

    .col-title {
      font-family: 'Playfair Display', var(--font-serif, serif);
      font-size: 1.15rem;
      font-weight: 600;
      color: #CFA874;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 13px; /* 12-14px link gap requirement */
    }

    .footer-links a {
      color: #F5EBDD;
      font-size: 0.92rem;
      text-decoration: none;
      transition: color 0.25s ease, transform 0.25s ease;
      display: inline-block;
    }

    .footer-links a:hover {
      color: #CFA874;
      transform: translateX(3px);
    }

    .newsletter-desc {
      font-size: 0.9rem;
      color: #C2B3A7;
      margin-bottom: 18px;
      line-height: 1.6;
    }

    .newsletter-form {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .newsletter-input {
      flex: 1;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(207, 168, 116, 0.35);
      border-radius: 4px;
      color: #FFFFFF;
      font-family: inherit; /* Montserrat requirement */
      font-size: 0.9rem;
      height: 46px;
      transition: border-color 0.25s ease, background 0.25s ease;
    }

    .newsletter-input::placeholder {
      color: #9E8E82;
    }

    .newsletter-input:focus {
      outline: none;
      border-color: #CFA874;
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.2);
    }

    .newsletter-btn {
      background-color: #CFA874;
      color: #1A120B;
      border: none;
      padding: 0 24px;
      height: 46px; /* matching height with input */
      border-radius: 4px;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 1px;
      cursor: pointer;
      text-transform: uppercase;
      transition: background 0.25s ease, transform 0.25s ease;
      white-space: nowrap;
    }

    .newsletter-btn:hover {
      background-color: #E2B882;
      transform: translateY(-1px);
    }

    .copyright-bar {
      border-top: 1px solid rgba(207, 168, 116, 0.2);
      padding: 22px 0;
      margin-top: 16px;
      font-size: 0.85rem;
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
        text-align: left;
      }
    }

    .copyright-text {
      margin: 0;
    }

    .legal-links {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .legal-links a {
      color: #C2B3A7;
      text-decoration: none;
      transition: color 0.25s ease;
    }

    .legal-links a:hover {
      color: #CFA874;
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

  formatCategoryName(name: string): string {
    if (!name) return '';
    const lower = name.toLowerCase().trim();
    if (lower === 'neckless' || lower === 'necklace') return 'Necklaces';
    if (lower === 'pendant') return 'Pendants';
    if (lower === 'silver pendant') return 'Silver Pendants';
    if (lower === 'nath') return 'Nath';
    return name;
  }

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    alert('Thank you for joining The Arista Club!');
  }
}
