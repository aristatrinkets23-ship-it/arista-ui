import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent],
  template: `
    <section class="legal-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <span class="hero-eyebrow">Client Trust & Discretion</span>
        <h1 class="hero-title">Privacy Policy</h1>
        <p class="hero-desc">
          Your privacy is an essential part of our commitment to exceptional service.
        </p>
      </div>
    </section>

    <section class="section-padding legal-body-section">
      <div class="container legal-container">
        <div class="legal-card">
          <div class="policy-block">
            <span class="policy-num">01</span>
            <div class="policy-content">
              <h3>Commitment to Discretion</h3>
              <p>
                At {{ settings.companyName || 'Arista Trinkets' }}, we hold client confidence with the utmost care. This Privacy Policy describes how we collect, use, and protect your personal information when you browse our boutique, acquire jewellery, or consult with our concierges.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">02</span>
            <div class="policy-content">
              <h3>Information We Collect</h3>
              <p>We collect information necessary to fulfill your orders and curate a bespoke shopping experience:</p>
              <ul>
                <li><strong>Contact details:</strong> Name, delivery address, phone number, and email address.</li>
                <li><strong>Order specifications:</strong> Ring sizing, metal selections, bespoke engravings, and purchase history.</li>
                <li><strong>Payment verification:</strong> Transaction identifiers and payment confirmation via our secure, RBI-authorized payment partners (e.g. Razorpay). We never store raw debit/credit card numbers or CVVs on our servers.</li>
                <li><strong>Device & Browsing:</strong> IP address, browser type, and engagement analytics to optimize boutique performance.</li>
              </ul>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">03</span>
            <div class="policy-content">
              <h3>How Your Information Is Used</h3>
              <p>Your details are used solely to:</p>
              <ul>
                <li>Securely process and insure order shipments to your doorstep.</li>
                <li>Issue hallmarked authenticity certificates, GST invoices, and dispatch tracking notifications.</li>
                <li>Provide personal concierge assistance via WhatsApp or email for custom requests and care advice.</li>
                <li>Deliver exclusive invitations to collection previews and Atelier Club privileges (only with your subscription consent).</li>
              </ul>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">04</span>
            <div class="policy-content">
              <h3>Data Protection & Confidentiality</h3>
              <p>
                We do not sell, rent, or lease your personal information to third parties. Data is shared strictly with trusted fulfillment partners (such as insured courier services and payment processors) under strict non-disclosure obligations to complete your delivery.
              </p>
            </div>
          </div>

          <div class="policy-block">
            <span class="policy-num">05</span>
            <div class="policy-content">
              <h3>Your Rights & Inquiries</h3>
              <p>
                You retain the right to review, modify, or request deletion of your personal data at any time. For privacy inquiries or data requests, please connect with our Data Protection Concierge:
              </p>
              <div class="contact-highlight">
                <p><strong>Email:</strong> {{ settings.companyEmail }}</p>
                <p><strong>Phone:</strong> {{ settings.companyPhone }}</p>
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
    .policy-content ul {
      margin: 12px 0 16px 20px;
      color: #55483E;
      line-height: 1.7;
      font-size: 0.94rem;
    }
    .policy-content li {
      margin-bottom: 8px;
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
export class PrivacyComponent {
  private settingsService = inject(SettingsService);
  get settings() {
    return this.settingsService.currentSettings;
  }
}
