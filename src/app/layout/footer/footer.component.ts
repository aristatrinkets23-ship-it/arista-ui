import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../core/services/category.service';
import { SettingsService, StoreSettings } from '../../core/services/settings.service';
import { Category } from '../../core/models/category.model';
import { NewsletterService } from '../../core/services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <!-- Main Footer Body -->
      <div class="footer-main-body">
        <div class="container footer-grid">
          <!-- Column 1: Brand & Heritage -->
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <a routerLink="/" class="footer-logo-link" aria-label="Arista Trinkets Home">
                <span class="footer-logo-full" role="img" aria-label="Arista Trinkets Fine Jewellery"></span>
              </a>
            </div>
            <p class="brand-tagline">
              Demi-fine, anti-tarnish luxury jewellery created with timeless gold, silver, and precious stones for every occasion.
            </p>
            <div class="footer-socials" aria-label="Social media connections">
              <a href="javascript:void(0)" class="social-icon" aria-label="Instagram" title="Instagram (Coming Soon)" (click)="$event.preventDefault()">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="javascript:void(0)" class="social-icon" aria-label="Facebook" title="Facebook (Coming Soon)" (click)="$event.preventDefault()">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="javascript:void(0)" class="social-icon" aria-label="Pinterest" title="Pinterest (Coming Soon)" (click)="$event.preventDefault()">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.67 7.9 6.42 9.34-.09-.78-.17-1.98.04-2.83.19-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.53 1.9 1.56 1.9 1.88 0 3.32-1.98 3.32-4.84 0-2.53-1.82-4.3-4.41-4.3-3.01 0-4.78 2.26-4.78 4.59 0 .91.35 1.89.79 2.42.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.2-.05.21-.18.26-.41.16-1.53-.71-2.48-2.94-2.48-4.73 0-3.85 2.8-7.39 8.07-7.39 4.24 0 7.53 3.02 7.53 7.06 0 4.21-2.65 7.6-6.34 7.6-1.24 0-2.41-.64-2.81-1.4l-.76 2.91c-.28 1.06-1.04 2.39-1.55 3.22C9.84 21.81 10.9 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
                </svg>
              </a>
              <a href="javascript:void(0)" class="social-icon" aria-label="WhatsApp Concierge" title="Chat on WhatsApp" (click)="openWhatsApp()">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Curated Collections (Split in Two Parts) -->
          <div class="footer-col collections-col">
            <h4 class="col-title">Collections</h4>
            <div class="collections-dual-columns">
              <!-- Part 1 -->
              <ul class="footer-links">
                <ng-container *ngIf="categoriesPart1.length > 0">
                  <li *ngFor="let cat of categoriesPart1">
                    <a routerLink="/shop" [queryParams]="{ category: cat.slug }">{{ cat.name }}</a>
                  </li>
                </ng-container>
                <ng-container *ngIf="categoriesPart1.length === 0">
                  <li><a routerLink="/shop" [queryParams]="{ category: 'rings' }">Rings</a></li>
                  <li><a routerLink="/shop" [queryParams]="{ category: 'necklaces' }">Necklaces & Pendants</a></li>
                </ng-container>
              </ul>

              <!-- Part 2 -->
              <ul class="footer-links">
                <ng-container *ngIf="categoriesPart2.length > 0">
                  <li *ngFor="let cat of categoriesPart2">
                    <a routerLink="/shop" [queryParams]="{ category: cat.slug }">{{ cat.name }}</a>
                  </li>
                </ng-container>
                <ng-container *ngIf="categoriesPart2.length === 0">
                  <li><a routerLink="/shop" [queryParams]="{ category: 'earrings' }">Earrings</a></li>
                  <li><a routerLink="/shop" [queryParams]="{ category: 'bracelets' }">Bracelets & Bangles</a></li>
                </ng-container>
              </ul>
            </div>
          </div>

          <!-- Column 3: Customer Services -->
          <div class="footer-col">
            <h4 class="col-title">Customer Care</h4>
            <ul class="footer-links">
              <li><a routerLink="/about">About Our Heritage</a></li>
              <li><a routerLink="/contact">Contact Concierge</a></li>
              <li><a routerLink="/account">My Account & Orders</a></li>
              <li><a routerLink="/cart">Shopping Bag</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact & Studio Info (Backend Powered) -->
          <div class="footer-col contact-col">
            <h4 class="col-title">Arista Trinkets</h4>
            <ul class="contact-list">
              <li class="contact-item" *ngIf="storeSettings?.companyAddress">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CFA874" stroke-width="2" class="contact-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ storeSettings?.companyAddress }}</span>
              </li>
              <li class="contact-item" *ngIf="storeSettings?.companyEmail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CFA874" stroke-width="2" class="contact-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a [href]="'mailto:' + storeSettings?.companyEmail" class="contact-link">
                  {{ storeSettings?.companyEmail }}
                </a>
              </li>
              <li class="contact-item" *ngIf="storeSettings?.companyPhone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CFA874" stroke-width="2" class="contact-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a [href]="'tel:' + storeSettings?.companyPhone" class="contact-link">
                  {{ storeSettings?.companyPhone }}
                </a>
              </li>
              <li class="contact-item hours-item" *ngIf="storeSettings?.companyTiming">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CFA874" stroke-width="2" class="contact-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ storeSettings?.companyTiming }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Copyright & Bottom Bar (Backend Powered) -->
      <div class="copyright-bar">
        <div class="container copyright-content">
          <p class="copyright-text">&copy; 2026 {{ storeSettings?.companyName || 'Arista Trinkets Fine Jewellery' }}. All rights reserved.</p>
          <div class="legal-links">
            <a routerLink="/privacy">Privacy Policy</a>
            <span class="separator">&bull;</span>
            <a routerLink="/terms">Terms of Service</a>
            <span class="separator">&bull;</span>
            <a routerLink="/contact">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background-color: #160F09;
      color: #F5EBDD;
      border-top: 3px solid #CFA874;
      font-family: 'Montserrat', var(--font-sans, sans-serif);
    }

    /* Main Grid Body */
    .footer-main-body {
      padding: 54px 0 48px;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
    }

    @media (min-width: 640px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1.3fr 1.7fr 1fr 1.2fr;
        gap: 40px;
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
      width: 175px;
      height: 54px;
      background-image: url('/assets/images/full-logo-transparent.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left center;
      filter: brightness(0) invert(1);
    }

    .brand-tagline {
      font-size: 0.88rem;
      color: #B8A89C;
      line-height: 1.65;
      max-width: 320px;
      margin-bottom: 22px;
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(207, 168, 116, 0.25);
      color: #F5EBDD;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .social-icon:hover {
      background: #CFA874;
      color: #160F09;
      border-color: #CFA874;
      transform: translateY(-2px);
    }

    .col-title {
      font-family: 'Playfair Display', var(--font-serif, serif);
      font-size: 1.1rem;
      font-weight: 600;
      color: #CFA874;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }

    .collections-dual-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-links a {
      color: #E8DDD0;
      font-size: 0.88rem;
      text-decoration: none;
      transition: color 0.25s ease, transform 0.25s ease;
      display: inline-block;
    }

    .footer-links a:hover {
      color: #CFA874;
      transform: translateX(4px);
    }

    /* Contact Column List */
    .contact-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.86rem;
      color: #D6C8BB;
      line-height: 1.45;
    }

    .contact-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .contact-link {
      color: #D6C8BB;
      text-decoration: none;
      transition: color 0.25s ease;
    }

    .contact-link:hover {
      color: #CFA874;
    }

    .hours-item span {
      color: #A69689;
      font-size: 0.82rem;
    }

    /* Bottom Copyright Bar */
    .copyright-bar {
      border-top: 1px solid rgba(207, 168, 116, 0.15);
      padding: 22px 0;
      font-size: 0.82rem;
      color: #9C8C80;
      background-color: #120C07;
    }

    .copyright-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    @media (min-width: 768px) {
      .copyright-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
      .copyright-text {
        text-align: left;
      }
    }

    .copyright-text {
      margin: 0;
      font-size: 0.82rem;
      color: #9C8C80;
      text-align: center;
    }

    .legal-links {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .legal-links a {
      color: #B8A89C;
      text-decoration: none;
      font-size: 0.82rem;
      transition: color 0.25s ease;
      white-space: nowrap;
    }

    .legal-links a:hover {
      color: #CFA874;
    }

    .separator {
      color: #614F42;
      font-size: 0.75rem;
    }

    @media (max-width: 576px) {
      .separator {
        display: none;
      }
      .legal-links {
        gap: 8px 18px;
      }
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  storeSettings: StoreSettings | null = null;
  private settingsSub?: Subscription;

  private categoryService = inject(CategoryService);
  private newsletterService = inject(NewsletterService);
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);

  openWhatsApp(): void {
    const rawPhone = this.storeSettings?.companyPhone || this.settingsService.currentSettings?.companyPhone || '';
    let phone = rawPhone.replace(/\D/g, '');
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }
    const message = encodeURIComponent('Hello! I would like to inquire about Arista jewellery.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener');
  }

  ngOnInit(): void {
    // 1. Fetch real Categories from Backend Database API
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load categories for footer:', err)
    });

    // 2. Fetch real Store & Company Settings from Backend API
    this.settingsSub = this.settingsService.settings$.subscribe(settings => {
      if (settings) {
        this.storeSettings = settings;
        this.cdr.detectChanges();
      }
    });
    this.settingsService.fetchSettings();
  }

  ngOnDestroy(): void {
    if (this.settingsSub) {
      this.settingsSub.unsubscribe();
    }
  }

  get formattedCategories(): { name: string; slug: string }[] {
    if (!this.categories || this.categories.length === 0) return [];

    return this.categories.map(cat => ({
      name: this.formatCategoryName(cat.name),
      slug: cat.slug
    }));
  }

  get categoriesPart1(): { name: string; slug: string }[] {
    const all = this.formattedCategories;
    if (all.length === 0) return [];
    const half = Math.ceil(all.length / 2);
    return all.slice(0, half);
  }

  get categoriesPart2(): { name: string; slug: string }[] {
    const all = this.formattedCategories;
    if (all.length === 0) return [];
    const half = Math.ceil(all.length / 2);
    return all.slice(half);
  }

  formatCategoryName(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
