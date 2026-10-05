import { Component, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ContactForm } from '../../core/models/contact.model';
import { EnquiryService } from '../../core/services/enquiry.service';
import { SettingsService, StoreSettings } from '../../core/services/settings.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Contact Page Hero -->
    <section class="contact-hero animate-on-scroll">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow animate-child">Personal Concierge</span>
          <h1 class="hero-title animate-child">Connect With Our Atelier</h1>
          <p class="hero-desc animate-child">
            Whether inquiring about a custom creation, bespoke fitting, or order guidance, our luxury advisors are at your service.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Contact Section -->
    <section class="section-padding contact-main-section animate-on-scroll">
      <div class="container contact-grid">
        <!-- Contact Information Cards -->
        <div class="info-column animate-slide-left">
          <h2 class="column-title">Client Care & Appointments</h2>
          <p class="column-intro">
            Experience bespoke luxury service online or schedule a private consultation at our flagship studio.
          </p>

          <div class="contact-cards">
            <div class="info-card animate-stagger-card" style="--stagger-index: 1">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Flagship Atelier</h4>
                <p class="card-text">{{ settings.companyAddress }}</p>
              </div>
            </div>

            <div class="info-card animate-stagger-card" style="--stagger-index: 2">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Concierge Email</h4>
                <p class="card-text">{{ settings.companyEmail }}</p>
              </div>
            </div>

            <div class="info-card animate-stagger-card" style="--stagger-index: 3">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Telephone & WhatsApp</h4>
                <p class="card-text">{{ settings.companyPhone }}<br>Mon &ndash; Sat: 10:00 AM &ndash; 7:00 PM IST</p>
              </div>
            </div>
          </div>

          <!-- WhatsApp Concierge Banner -->
          <div class="whatsapp-box animate-stagger-card" style="--stagger-index: 4">
            <h4 class="wa-title">Need Instant Guidance?</h4>
            <p class="wa-text">Speak directly with a certified diamond specialist on WhatsApp.</p>
            <button type="button" class="btn-whatsapp" (click)="openWhatsApp()">
              Chat on WhatsApp Concierge &rarr;
            </button>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="form-column animate-slide-right">
          <div class="form-card">
            <h3 class="form-title">Send Us a Message</h3>
            
            <div *ngIf="isSubmitted" class="success-alert">
              <h4>Thank you for reaching out!</h4>
              <p>Your message has been received by our Atelier Concierge. We will reply within 24 hours.</p>
              <button type="button" class="btn-reset" (click)="resetForm()">Send Another Message</button>
            </div>

            <div *ngIf="submitError" class="error-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ submitError }}</span>
            </div>

            <form *ngIf="!isSubmitted" (ngSubmit)="onSubmit($event)" class="contact-form" novalidate>
              <div class="form-group">
                <label for="name" class="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  (input)="errors.name = ''"
                  placeholder="Your full name"
                  class="form-input"
                  [class.is-invalid]="!!errors.name"
                />
                <span *ngIf="errors.name" class="field-error">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  (input)="errors.email = ''"
                  placeholder="Your email address"
                  class="form-input"
                  [class.is-invalid]="!!errors.email"
                />
                <span *ngIf="errors.email" class="field-error">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [value]="formData.phone"
                  (input)="onPhoneInput($event)"
                  maxlength="10"
                  placeholder="10-digit mobile number"
                  class="form-input"
                  [class.is-invalid]="!!errors.phone"
                />
                <span *ngIf="errors.phone" class="field-error">{{ errors.phone }}</span>
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  [(ngModel)]="formData.subject"
                  required
                  class="form-select"
                >
                  <option value="Bespoke Design Inquiry">Bespoke Design Inquiry</option>
                  <option value="Product & Ring Sizing">Product & Ring Sizing</option>
                  <option value="Order & Shipping Guidance">Order & Shipping Guidance</option>
                  <option value="Atelier Private Appointment">Atelier Private Appointment</option>
                  <option value="Other Assistance">Other Assistance</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  [(ngModel)]="formData.message"
                  (input)="errors.message = ''"
                  placeholder="How may our concierge assist you today?"
                  class="form-textarea"
                  [class.is-invalid]="!!errors.message"
                ></textarea>
                <span *ngIf="errors.message" class="field-error">{{ errors.message }}</span>
              </div>

              <app-button type="submit" variant="primary" size="lg" [disabled]="isSubmitting" [loading]="isSubmitting">
                {{ isSubmitting ? 'Sending Message...' : 'Send Message &rarr;' }}
              </app-button>
            </form>
          </div>
        </div>
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

    .animate-slide-left {
      opacity: 0;
      transform: translateX(-36px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.1s;
    }

    .animate-slide-right {
      opacity: 0;
      transform: translateX(36px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.2s;
    }

    .animate-stagger-card {
      opacity: 0;
      transform: translateY(28px) scale(0.97);
      transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
                  background-color 0.35s ease, 
                  border-color 0.35s ease, 
                  box-shadow 0.35s ease;
      transition-delay: calc(var(--stagger-index, 1) * 0.1s);
    }

    .in-view .animate-slide-left,
    .in-view .animate-slide-right,
    .in-view .animate-stagger-card,
    .animate-slide-left.in-view,
    .animate-slide-right.in-view,
    .animate-stagger-card.in-view {
      opacity: 1;
      transform: translateX(0) translateY(0) scale(1);
    }

    /* Contact Hero */
    .contact-hero {
      position: relative;
      background-image: url('/assets/images/hero-contact.jpg');
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

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
    }

    @media (min-width: 992px) {
      .contact-grid {
        grid-template-columns: 1fr 1fr;
        gap: 56px;
      }
    }

    .column-title {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
    }

    .column-intro {
      font-size: 1rem;
      color: #555555;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .contact-cards {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 32px;
    }

    .info-card {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 22px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .info-card:hover {
      border-color: var(--brand-warm-gold);
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(207, 168, 116, 0.18);
    }

    .info-icon {
      color: var(--brand-warm-gold);
      flex-shrink: 0;
      margin-top: 2px;
      transition: transform 0.35s ease;
    }

    .info-card:hover .info-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .card-heading {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 4px;
    }

    .card-text {
      font-size: 0.92rem;
      color: #666666;
      line-height: 1.5;
    }

    .whatsapp-box {
      background: linear-gradient(135deg, #F0F7ED 0%, #E2F0E0 100%);
      border: 1px solid #A5D6A7;
      border-radius: var(--radius-md);
      padding: 26px;
      box-shadow: 0 8px 24px rgba(46, 125, 50, 0.08);
      transition: all 0.4s ease;
    }

    .whatsapp-box:hover {
      border-color: #2E7D32;
      box-shadow: 0 14px 32px rgba(46, 125, 50, 0.16);
      transform: translateY(-4px);
    }

    .wa-title {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      color: #2E7D32;
      margin-bottom: 6px;
    }

    .wa-text {
      font-size: 0.92rem;
      color: #388E3C;
      margin-bottom: 18px;
    }

    .btn-whatsapp {
      background-color: #2E7D32;
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      min-height: 44px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.35s ease;
      box-shadow: 0 4px 14px rgba(46, 125, 50, 0.25);
    }

    .btn-whatsapp:hover {
      background-color: #1B5E20;
      transform: scale(1.02);
      box-shadow: 0 8px 20px rgba(46, 125, 50, 0.35);
    }

    /* Form Styles */
    .form-card {
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 36px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
      transition: border-color 0.4s ease, box-shadow 0.4s ease;
    }

    .form-card:hover {
      border-color: var(--brand-warm-gold);
      box-shadow: 0 16px 40px rgba(207, 168, 116, 0.12);
    }

    .form-title {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 24px;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--brand-mocha-brown);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input, .form-select, .form-textarea {
      padding: 12px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: 0.95rem;
      color: var(--brand-mocha-brown);
      background-color: #FFFFFF;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
      box-shadow: 0 0 0 3px rgba(207, 168, 116, 0.2);
    }

    .success-alert {
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--brand-warm-gold);
      border-radius: var(--radius-md);
      padding: 28px;
      text-align: center;
      animation: alertPopIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes alertPopIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .success-alert h4 {
      font-family: var(--font-serif);
      font-size: 1.3rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
    }

    .success-alert p {
      font-size: 0.95rem;
      color: #555555;
      margin-bottom: 20px;
    }

    .form-input.is-invalid, .form-textarea.is-invalid {
      border-color: #d32f2f !important;
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.15) !important;
    }

    .field-error {
      font-size: 0.82rem;
      color: #d32f2f;
      font-weight: 500;
      margin-top: 4px;
      display: block;
      animation: alertPopIn 0.3s ease;
    }

    .error-banner {
      background-color: #FDF2F2;
      border: 1px solid #F87171;
      color: #991B1B;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.92rem;
      font-weight: 500;
      animation: alertPopIn 0.35s ease;
    }

    .error-banner svg {
      flex-shrink: 0;
      color: #DC2626;
    }

    .btn-reset {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-reset:hover {
      background-color: #C29961;
    }
  `]
})
export class ContactComponent implements AfterViewInit {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Design Inquiry',
    message: ''
  };

  errors: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  } = {};

  settings: StoreSettings;
  submitError: string = '';
  isSubmitted: boolean = false;
  isSubmitting: boolean = false;
  private enquiryService = inject(EnquiryService);
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.settings = this.settingsService.currentSettings;
    this.settingsService.settings$.subscribe(s => {
      this.settings = s;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initScrollObserver(), 100);
  }

  private initScrollObserver(): void {
    if (typeof window === 'undefined') return;

    const targets = document.querySelectorAll(
      '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-stagger-card'
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
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach((el) => observer.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('in-view'));
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Strip everything except numeric digits
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    this.formData.phone = digitsOnly;
    input.value = digitsOnly;
    this.errors.phone = '';
    this.cdr.detectChanges();
  }

  validate(): boolean {
    this.errors = {};
    let isValid = true;

    // 1. Name validation
    if (!this.formData.name || !this.formData.name.trim()) {
      this.errors.name = 'Full name is required.';
      isValid = false;
    }

    // 2. Email strict regex validation
    const emailTrimmed = (this.formData.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailTrimmed) {
      this.errors.email = 'Email address is required.';
      isValid = false;
    } else if (!emailRegex.test(emailTrimmed)) {
      this.errors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // 3. Phone strict 10 digits validation (optional field, but if provided must be exactly 10 digits)
    const phoneTrimmed = (this.formData.phone || '').trim();
    if (phoneTrimmed) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneTrimmed)) {
        this.errors.phone = 'Phone number must be exactly 10 digits.';
        isValid = false;
      }
    }

    // 4. Message validation
    if (!this.formData.message || !this.formData.message.trim()) {
      this.errors.message = 'Please enter your message.';
      isValid = false;
    }

    this.cdr.detectChanges();
    return isValid;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isSubmitting) return;

    if (!this.validate()) {
      return; // Block API call if validation fails
    }

    this.submitError = '';
    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.enquiryService.submitEnquiry(this.formData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res && res.data && res.data.emailSent === false) {
          this.submitError = 'Email could not be sent. Please check email configuration or try again.';
          this.isSubmitted = false;
        } else {
          this.submitError = '';
          this.isSubmitted = true;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.isSubmitted = false;
        const msg = err?.error?.message || 'Email could not be sent. Please try again later or reach out on WhatsApp.';
        this.submitError = msg;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: 'Bespoke Design Inquiry',
      message: ''
    };
    this.errors = {};
    this.submitError = '';
    this.isSubmitted = false;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }

  openWhatsApp(): void {
    const phone = (this.settings?.companyPhone || '9016134899').replace(/\D/g, '');
    const message = encodeURIComponent('Hello! I would like to speak with an Arista jewellery advisor.');
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank', 'noopener');
  }
}

