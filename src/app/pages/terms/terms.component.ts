import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent],
  template: `
    <section class="legal-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <span class="hero-eyebrow">Client Agreement</span>
        <h1 class="hero-title">Terms of Service</h1>
        <p class="hero-desc">
          Transparency and enduring craftsmanship guide every interaction with our Atelier.
        </p>
      </div>
    </section>

    <section class="section-padding legal-body-section">
      <div class="container legal-container">
        <div class="legal-card">
          <div class="policy-block">
            <span class="policy-num">01</span>
            <div class="policy-content">
              <h3>General Provisions</h3>
              <p>
                Welcome to {{ settings.companyName || 'Arista Trinkets Atelier' }}. By browsing our website, acquiring jewellery pieces, or engaging our concierge team, you agree to comply with the terms set forth herein.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">02</span>
            <div class="policy-content">
              <h3>Authenticity & Hallmarking</h3>
              <p>
                Every jewel created by Arista is accompanied by proof of authenticity. Our precious metal creations adhere to Bureau of Indian Standards (BIS) hallmarking guidelines, and certified gemstones are thoroughly checked by certified gemologists prior to dispatch.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">03</span>
            <div class="policy-content">
              <h3>Pricing & Tax Invoices</h3>
              <p>
                All prices displayed are in Indian Rupees (INR) and are inclusive or exclusive of GST as stipulated on the checkout review. Every verified purchase receives an official GST Tax Invoice containing our registered GSTIN ({{ settings.gstNumber || '24AAACA1234A1Z4' }}).
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">04</span>
            <div class="policy-content">
              <h3>Complimentary & Insured Transit</h3>
              <p>
                To safeguard your precious acquisition, all shipments are comprehensively insured from our atelier to your doorstep. Packages require a signature or one-time delivery confirmation upon arrival.
              </p>
              <p>
                Orders above ₹{{ settings.freeDeliveryThreshold || 600 }} qualify for complimentary insured delivery across India.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">05</span>
            <div class="policy-content">
              <h3>7-Day Exchange & Quality Guarantee</h3>
              <p>
                We stand firmly behind the excellence of our craft. If your jewel arrives damaged or does not meet your expectations, we offer an easy 7-day exchange period for unworn pieces accompanied by the original tamper-evident security tag and certificate.
              </p>
              <p>
                Custom bespoke engravings or personalized pieces may be subject to individual appraisal terms.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">06</span>
            <div class="policy-content">
              <h3>Concierge & Atelier Support</h3>
              <p>
                For questions regarding orders, sizing, maintenance, or bespoke consultations, please reach out to our client care team:
              </p>
              <div class="contact-highlight">
                <p><strong>Concierge:</strong> {{ settings.companyEmail }}</p>
                <p><strong>Telephone / WhatsApp:</strong> {{ settings.companyPhone }}</p>
                <p><strong>Atelier:</strong> {{ settings.companyAddress }}</p>
                <p *ngIf="settings.companyTiming"><strong>Hours / Timing:</strong> {{ settings.companyTiming }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .legal-hero {
      position: relative;
      background: #1A120B;
      color: #F5EBDD;
      padding: 72px 0 60px;
      text-align: center;
      border-bottom: 2px solid #CFA874;
    }
    .hero-eyebrow {
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      font-weight: 700;
      color: #CFA874;
      margin-bottom: 12px;
    }
    .hero-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 2.8rem;
      margin-bottom: 12px;
      color: #FAF6F0;
    }
    .hero-desc {
      font-size: 1.05rem;
      color: #D6C7B7;
      max-width: 580px;
      margin: 0 auto;
    }
    .legal-body-section {
      background: #FAF8F5;
      padding: 64px 0 80px;
    }
    .legal-container {
      max-width: 860px;
      margin: 0 auto;
    }
    .legal-card {
      background: #FFFFFF;
      border-radius: 12px;
      padding: 48px;
      border: 1px solid rgba(207, 168, 116, 0.25);
      box-shadow: 0 10px 30px rgba(26, 18, 11, 0.04);
    }
    .policy-block {
      display: flex;
      gap: 24px;
      padding-bottom: 36px;
      margin-bottom: 36px;
      border-bottom: 1px solid #F0EAE1;
    }
    .policy-block:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }
    .policy-num {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #CFA874;
      line-height: 1.2;
      flex-shrink: 0;
      width: 36px;
    }
    .policy-content h3 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.35rem;
      color: #1A120B;
      margin-bottom: 12px;
    }
    .policy-content p {
      color: #55483E;
      line-height: 1.75;
      font-size: 0.96rem;
      margin-bottom: 12px;
    }
    .contact-highlight {
      background: #FAF6F0;
      border-left: 3px solid #CFA874;
      padding: 16px 20px;
      border-radius: 4px;
      margin-top: 16px;
    }
    .contact-highlight p {
      margin-bottom: 4px;
      font-size: 0.92rem;
    }
    @media (max-width: 640px) {
      .legal-card {
        padding: 24px 20px;
      }
      .policy-block {
        flex-direction: column;
        gap: 8px;
      }
      .hero-title {
        font-size: 2.2rem;
      }
    }
  `]
})
export class TermsComponent {
  private settingsService = inject(SettingsService);
  get settings() {
    return this.settingsService.currentSettings;
  }
}
