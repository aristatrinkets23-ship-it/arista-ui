import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
            <a routerLink="/" class="footer-logo-link" aria-label="Arista Trinkets">
              <span class="footer-logo-icon" role="img" aria-label="Arista Monogram"></span>
              <span class="footer-logo-img" role="img" aria-label="Arista Trinkets Fine Jewellery"></span>
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
            <li><a routerLink="/shop" [queryParams]="{ category: 'rings' }">Rings</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'necklaces' }">Necklaces</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'earrings' }">Earrings</a></li>
            <li><a routerLink="/shop" [queryParams]="{ category: 'bracelets' }">Bracelets</a></li>
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
      align-items: flex-start;
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

    .footer-logo-icon {
      display: inline-block;
      width: 36px;
      height: 36px;
      background-color: var(--brand-warm-gold);
      -webkit-mask-image: url('/assets/images/logo-icon-transparent.png');
      mask-image: url('/assets/images/logo-icon-transparent.png');
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
      position: relative;
      z-index: 2;
    }

    .footer-logo-img {
      display: inline-block;
      width: 125px;
      height: 42px;
      background-color: var(--brand-warm-gold);
      -webkit-mask-image: url('/assets/images/logo-transparent.png');
      mask-image: url('/assets/images/logo-transparent.png');
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center left;
      mask-position: center left;
      margin-left: -6px;
      position: relative;
      z-index: 1;
    }

    .brand-tagline {
      font-size: var(--font-size-footer-body);
      color: #E6DAD0;
      line-height: 1.6;
      margin-top: 8px;
    }

    .col-title {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--brand-warm-gold);
      margin-bottom: 12px;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .footer-links a {
      color: #E6DAD0;
      font-size: var(--font-size-footer-body);
      text-decoration: none;
      transition: color var(--transition-fast);
      display: inline-block;
      padding: 2px 0;
    }

    .footer-links a:hover {
      color: var(--brand-warm-gold);
    }

    .newsletter-desc {
      font-size: var(--font-size-footer-body);
      color: #E6DAD0;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    @media (min-width: 480px) {
      .newsletter-form {
        flex-direction: row;
        gap: 8px;
      }
    }

    .newsletter-input {
      flex: 1;
      padding: 12px 14px;
      min-height: 44px;
      border: 1px solid rgba(207, 168, 116, 0.3);
      background-color: #281D14;
      color: #FFFFFF;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      font-family: var(--font-sans);
    }

    .newsletter-input::placeholder {
      color: #9E8D80;
    }

    .newsletter-input:focus {
      outline: 2px solid var(--brand-warm-gold);
      border-color: var(--brand-warm-gold);
    }

    .newsletter-btn {
      background-color: var(--brand-warm-gold);
      color: #1A120B;
      border: none;
      padding: 12px 24px;
      min-height: 44px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .newsletter-btn:hover {
      background-color: #E2B882;
      color: #1A120B;
    }

    .copyright-bar {
      background-color: #120C07;
      border-top: 1px solid rgba(207, 168, 116, 0.15);
      padding: 16px 0;
      font-size: 0.82rem;
      color: #A8988C;
    }

    .copyright-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
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
export class FooterComponent {
  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    alert('Thank you for joining The Arista Club!');
  }
}
