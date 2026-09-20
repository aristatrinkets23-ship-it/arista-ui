import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, SectionHeadingComponent, ButtonComponent],
  template: `
    <!-- About Page Hero -->
    <section class="about-hero">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow">The Atelier Story</span>
          <h1 class="hero-title">Crafting Timeless Moments of Grace</h1>
          <p class="hero-desc">
            Arista Trinkets was born from a passion for timeless jewellery design, hand-sculpted gold artistry, and uncompromised ethical standards.
          </p>
        </div>
      </div>
    </section>

    <!-- Brand Philosophy Section -->
    <section class="section-padding">
      <div class="container story-grid">
        <div class="story-text">
          <app-section-heading
            subtitle="Our Heritage & Vision"
            title="Sustainably Sculpted Fine Jewellery"
            align="left"
            [showDivider]="true"
          ></app-section-heading>
          <p class="story-paragraph">
            Every piece in the Arista collection begins as an artistic vision inspired by architectural symmetry, organic gemstone contours, and classical heritage iconography.
          </p>
          <p class="story-paragraph">
            We work exclusively with certified conflict-free diamonds and 100% BIS hallmarked 18K solid gold and sterling silver. Our master artisans hand-set every gemstone to ensure life-long brilliance and structural integrity.
          </p>
        </div>
        <div class="story-image-box">
          <img src="/assets/images/placeholder-banner.svg" alt="Arista Jewellery Atelier Craftsmanship" class="story-img" />
        </div>
      </div>
    </section>

    <!-- Core Brand Pillars -->
    <section class="section-padding bg-pearl">
      <div class="container">
        <app-section-heading
          subtitle="Uncompromising Standards"
          title="The Three Pillars of Arista"
          align="center"
        ></app-section-heading>

        <div class="pillars-grid">
          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 class="pillar-title">Artisanal Mastery</h3>
            <p class="pillar-desc">
              Precision hand-polishing and micro-pave setting by experienced goldsmiths with decades of master benchwork.
            </p>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 class="pillar-title">Ethical Sourcing</h3>
            <p class="pillar-desc">
              100% Kimberley Process certified diamonds and recycled precious metals that protect both artisan and environment.
            </p>
          </div>

          <div class="pillar-card">
            <div class="pillar-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 class="pillar-title">Timeless Longevity</h3>
            <p class="pillar-desc">
              Heirloom-grade craftsmanship designed to be cherished across generations with lifetime polishing support.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section-padding text-center">
      <div class="container">
        <h2 class="cta-heading">Discover Your Signature Piece</h2>
        <p class="cta-sub">Explore our curated collections of rings, necklaces, earrings, and bracelets.</p>
        <div class="cta-actions">
          <a routerLink="/shop">
            <app-button variant="primary" size="lg">Explore Collections &rarr;</app-button>
          </a>
          <a routerLink="/contact">
            <app-button variant="outline" size="lg">Contact Concierge</app-button>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-hero {
      position: relative;
      background-image: url('/assets/images/hero-about.jpg');
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

    .story-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 36px;
      align-items: center;
    }

    @media (min-width: 992px) {
      .story-grid {
        grid-template-columns: 1fr 1fr;
        gap: 56px;
      }
    }

    .story-paragraph {
      font-size: 1rem;
      color: #555555;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .story-image-box {
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      aspect-ratio: 4 / 3;
    }

    .story-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bg-pearl {
      background-color: var(--brand-pearl-beige);
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .pillars-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .pillar-card {
      background-color: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 32px 24px;
      text-align: center;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-sm);
    }

    .pillar-card:hover {
      border-color: var(--brand-warm-gold);
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .pillar-icon {
      color: var(--brand-warm-gold);
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
    }

    .pillar-title {
      font-family: var(--font-serif);
      font-size: 1.3rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 10px;
    }

    .pillar-desc {
      font-size: 0.92rem;
      color: #666666;
      line-height: 1.6;
    }

    .cta-heading {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 4vw, 2.6rem);
      color: var(--brand-mocha-brown);
      margin-bottom: 12px;
    }

    .cta-sub {
      font-size: 1rem;
      color: #666666;
      margin-bottom: 28px;
    }

    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
  `]
})
export class AboutComponent {}
