import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ContactForm } from '../../core/models/contact.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- Contact Page Hero -->
    <section class="contact-hero text-center">
      <div class="container">
        <span class="hero-eyebrow">Personal Concierge</span>
        <h1 class="hero-title">Connect With Our Atelier</h1>
        <p class="hero-desc">
          Whether inquiring about a custom creation, bespoke fitting, or order guidance, our luxury advisors are at your service.
        </p>
      </div>
    </section>

    <!-- Main Contact Section -->
    <section class="section-padding">
      <div class="container contact-grid">
        <!-- Contact Information Cards -->
        <div class="info-column">
          <h2 class="column-title">Client Care & Appointments</h2>
          <p class="column-intro">
            Experience bespoke luxury service online or schedule a private consultation at our flagship studio.
          </p>

          <div class="contact-cards">
            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Flagship Atelier</h4>
                <p class="card-text">Arista Luxury Quarter, Suite 402<br>Bespoke Boulevard, Mumbai 400001</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Concierge Email</h4>
                <p class="card-text">concierge&#64;aristatrinkets.com<br>care&#64;aristatrinkets.com</p>
              </div>
            </div>

            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div class="info-details">
                <h4 class="card-heading">Telephone & WhatsApp</h4>
                <p class="card-text">+91 (0) 800-ARISTA (274782)<br>Mon - Sat: 10:00 AM - 7:00 PM IST</p>
              </div>
            </div>
          </div>

          <!-- WhatsApp Concierge Banner -->
          <div class="whatsapp-box">
            <h4 class="wa-title">Need Instant Guidance?</h4>
            <p class="wa-text">Speak directly with a certified diamond specialist on WhatsApp.</p>
            <button type="button" class="btn-whatsapp" (click)="openWhatsApp()">
              Chat on WhatsApp Concierge &rarr;
            </button>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="form-column">
          <div class="form-card">
            <h3 class="form-title">Send Us a Message</h3>
            
            <div *ngIf="isSubmitted" class="success-alert">
              <h4>Thank you for reaching out!</h4>
              <p>Your message has been received by our Atelier Concierge. We will reply within 24 hours.</p>
              <button type="button" class="btn-reset" (click)="resetForm()">Send Another Message</button>
            </div>

            <form *ngIf="!isSubmitted" (ngSubmit)="onSubmit($event)" class="contact-form">
              <div class="form-group">
                <label for="name" class="form-label">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  placeholder="e.g. Lady Catherine"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  placeholder="name&#64;example.com"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  [(ngModel)]="formData.phone"
                  placeholder="+91 98765 43210"
                  class="form-input"
                />
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
                  required
                  placeholder="How may our concierge assist you today?"
                  class="form-textarea"
                ></textarea>
              </div>

              <app-button type="submit" variant="primary" size="lg">Send Message &rarr;</app-button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-hero {
      background: linear-gradient(135deg, rgba(247, 233, 230, 0.9) 0%, rgba(242, 239, 232, 0.95) 100%), url('/assets/images/placeholder-banner.svg');
      background-size: cover;
      padding: 64px 0;
      border-bottom: 1px solid var(--color-border);
    }
    @media (min-width: 768px) {
      .contact-hero { padding: 88px 0; }
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
      font-size: clamp(2.1rem, 5vw, 3.5rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 16px;
    }

    .hero-desc {
      font-size: 1.05rem;
      color: #555555;
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.65;
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
      padding: 20px;
    }

    .info-icon {
      color: var(--brand-warm-gold);
      flex-shrink: 0;
      margin-top: 2px;
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
      background-color: #F0F7ED;
      border: 1px solid #C8E6C9;
      border-radius: var(--radius-md);
      padding: 24px;
    }

    .wa-title {
      font-family: var(--font-serif);
      font-size: 1.2rem;
      color: #2E7D32;
      margin-bottom: 6px;
    }

    .wa-text {
      font-size: 0.92rem;
      color: #388E3C;
      margin-bottom: 16px;
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
      transition: all var(--transition-fast);
    }

    .btn-whatsapp:hover {
      background-color: #1B5E20;
    }

    /* Form Styles */
    .form-card {
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 32px;
      box-shadow: var(--shadow-sm);
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
      transition: border-color var(--transition-fast);
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--brand-warm-gold);
    }

    .success-alert {
      background-color: var(--brand-pearl-beige);
      border: 1px solid var(--brand-warm-gold);
      border-radius: var(--radius-md);
      padding: 24px;
      text-align: center;
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

    .btn-reset {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      cursor: pointer;
    }
  `]
})
export class ContactComponent {
  formData: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Design Inquiry',
    message: ''
  };

  isSubmitted: boolean = false;

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.isSubmitted = true;
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      subject: 'Bespoke Design Inquiry',
      message: ''
    };
    this.isSubmitted = false;
  }

  openWhatsApp(): void {
    alert('Direct WhatsApp Concierge link: Opening chat with Arista Jewellery advisor...');
  }
}
