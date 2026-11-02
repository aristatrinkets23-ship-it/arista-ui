import { Component, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
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
    <section class="about-hero animate-on-scroll hero-animate">
      <div class="hero-bg-overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-eyebrow animate-child">The Atelier Story</span>
          <h1 class="hero-title animate-child">Crafting Timeless Moments of Grace</h1>
          <p class="hero-desc animate-child">
            Arista Trinkets was born from a passion for timeless jewellery design, hand-sculpted gold artistry, and uncompromised ethical standards.
          </p>
        </div>
      </div>
    </section>

    <!-- Brand Philosophy Section -->
    <section class="section-padding story-section animate-on-scroll">
      <div class="container story-grid">
        <div class="story-text animate-slide-left">
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
        <div class="story-image-box animate-slide-right">
          <img src="/assets/images/about-heritage-artisan.webp" alt="Arista Fine Jewellery Collection Box" class="story-img" />
          <div class="story-img-badge">
            <span class="badge-number">100%</span>
            <span class="badge-text">Demi Fine & Anti-Tarnish</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Arista Section with Parallax Background -->
    <section class="heritage-parallax-banner-section animate-on-scroll" #heritageSection>
      <div class="heritage-parallax-bg" #heritageBg></div>
      <div class="heritage-parallax-overlay"></div>
      
      <div class="container why-choose-container">
        <!-- Header -->
        <div class="why-choose-header animate-fade-up">
          <span class="why-choose-eyebrow">OUR PROMISE</span>
          <h2 class="why-choose-title">Why Choose <em>Arista</em></h2>
          <div class="why-choose-underline"></div>
        </div>

        <!-- 5 Feature Promise Cards Grid -->
        <div class="why-choose-grid">
          <!-- Card 1: Uncompromising Quality -->
          <div class="why-choose-card animate-stagger-card" style="--stagger-index: 1">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polygon points="12 2 22 8.5 12 22 2 8.5 12 2"></polygon>
                <line x1="2" y1="8.5" x2="22" y2="8.5"></line>
                <line x1="12" y1="2" x2="7" y2="8.5"></line>
                <line x1="12" y1="2" x2="17" y2="8.5"></line>
                <line x1="7" y1="8.5" x2="12" y2="22"></line>
                <line x1="17" y1="8.5" x2="12" y2="22"></line>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Uncompromising Quality</h3>
            <p class="why-choose-card-text">Every stone and setting is checked by hand before it ships.</p>
          </div>

          <!-- Card 2: True Craftsmanship -->
          <div class="why-choose-card animate-stagger-card" style="--stagger-index: 2">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">True Craftsmanship</h3>
            <p class="why-choose-card-text">Small-batch made by artisans, not stamped out on a line.</p>
          </div>

          <!-- Card 3: Certified Authenticity -->
          <div class="why-choose-card animate-stagger-card" style="--stagger-index: 3">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Certified Authenticity</h3>
            <p class="why-choose-card-text">Every piece ships with a certificate of authenticity.</p>
          </div>

          <!-- Card 4: Gift-Ready Packaging -->
          <div class="why-choose-card animate-stagger-card" style="--stagger-index: 4">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Gift-Ready Packaging</h3>
            <p class="why-choose-card-text">Boxed and wrapped like a gift, even when it's for you.</p>
          </div>

          <!-- Card 5: Service That Listens -->
          <div class="why-choose-card animate-stagger-card" style="--stagger-index: 5">
            <div class="why-choose-icon-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <h3 class="why-choose-card-title">Service That Listens</h3>
            <p class="why-choose-card-text">Real people for sizing, styling, or after-sales help.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Brand Pillars -->
    <section class="section-padding bg-pearl pillars-section animate-on-scroll">
      <div class="container">
        <div class="animate-fade-up">
          <app-section-heading
            subtitle="Uncompromising Standards"
            title="The Three Pillars of Arista"
            align="center"
          ></app-section-heading>
        </div>

        <div class="pillars-grid">
          <div class="pillar-card animate-stagger-card" style="--stagger-index: 1">
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

          <div class="pillar-card animate-stagger-card" style="--stagger-index: 2">
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

          <div class="pillar-card animate-stagger-card" style="--stagger-index: 3">
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
    <section class="section-padding text-center cta-section animate-on-scroll">
      <div class="container animate-fade-up">
        <h2 class="cta-heading">Discover Your Signature Piece</h2>
        <p class="cta-sub">Explore our curated collections of rings, necklaces, earrings, and bracelets.</p>
        <div class="cta-actions">
          <a routerLink="/shop">
            <app-button variant="primary" size="lg">Explore Collections &rarr;</app-button>
          </a>
          <a routerLink="/contact">
            <app-button variant="outline" size="lg">Contact Us</app-button>
          </a>
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

    /* Sub-element animations */
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

    .animate-fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: 0.1s;
    }

    .animate-stagger-card {
      opacity: 0;
      transform: translateY(32px) scale(0.96);
      transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
                  transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), 
                  background-color 0.35s ease, 
                  border-color 0.35s ease, 
                  box-shadow 0.35s ease;
      transition-delay: calc(var(--stagger-index, 1) * 0.1s);
    }

    .in-view .animate-slide-left,
    .in-view .animate-slide-right,
    .in-view .animate-fade-up,
    .in-view .animate-stagger-card,
    .animate-slide-left.in-view,
    .animate-slide-right.in-view,
    .animate-fade-up.in-view,
    .animate-stagger-card.in-view {
      opacity: 1;
      transform: translateX(0) translateY(0) scale(1);
    }

    /* About Hero Styling */
    .about-hero {
      position: relative;
      background-image: url('/assets/images/hero-about.webp');
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
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--color-border);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      aspect-ratio: 4 / 3;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .story-image-box:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 45px rgba(207, 168, 116, 0.22);
    }

    .story-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .story-image-box:hover .story-img {
      transform: scale(1.05);
    }

    .story-img-badge {
      position: absolute;
      bottom: 20px;
      right: 20px;
      background: rgba(26, 18, 11, 0.85);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid var(--brand-warm-gold);
      border-radius: 12px;
      padding: 12px 18px;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      animation: floatBadge 4s ease-in-out infinite;
    }

    @keyframes floatBadge {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .badge-number {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--brand-warm-gold);
      line-height: 1;
    }

    .badge-text {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #E2D6C6;
      margin-top: 2px;
    }

    /* Featured Heritage Parallax Banner Section - Why Choose Arista */
    .heritage-parallax-banner-section {
      position: relative;
      padding: 96px 0;
      overflow: hidden;
      background-color: #1A120B;
      border-top: 1px solid rgba(207, 168, 116, 0.3);
      border-bottom: 1px solid rgba(207, 168, 116, 0.3);
    }

    .heritage-parallax-bg {
      position: absolute;
      inset: -90px;
      background-image: url('/assets/images/heritage-banner-bg.webp');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      will-change: transform;
      transform-origin: center center;
      filter: brightness(0.92) contrast(1.02);
      backface-visibility: hidden;
      transform: translate3d(0, 0, 0) scale(1.28);
    }

    .heritage-parallax-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(35, 25, 20, 0.52) 0%,
        rgba(26, 18, 11, 0.38) 50%,
        rgba(35, 25, 20, 0.58) 100%
      );
      pointer-events: none;
    }

    .why-choose-container {
      position: relative;
      z-index: 3;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .why-choose-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .why-choose-eyebrow {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.78rem;
      letter-spacing: 0.32em;
      color: var(--brand-warm-gold, #CFA874);
      font-weight: 700;
      text-transform: uppercase;
      display: block;
      margin-bottom: 10px;
    }

    .why-choose-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      color: #FFFDF9;
      font-weight: 400;
      margin: 0 0 14px 0;
      line-height: 1.2;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    }

    .why-choose-title em {
      font-style: italic;
      color: var(--brand-warm-gold, #CFA874);
    }

    .why-choose-underline {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--brand-warm-gold, #CFA874), transparent);
      margin: 0 auto;
      transition: width 0.8s ease;
    }

    .in-view .why-choose-underline {
      width: 90px;
    }

    .why-choose-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
    }

    @media (max-width: 1100px) {
      .why-choose-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .why-choose-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
      }
    }

    @media (max-width: 480px) {
      .why-choose-grid {
        grid-template-columns: 1fr;
      }
    }

    .why-choose-card {
      background: rgba(26, 18, 11, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(207, 168, 116, 0.25);
      border-radius: 20px;
      padding: 36px 20px 32px 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      position: relative;
    }

    .why-choose-card:hover {
      transform: translateY(-8px) scale(1.02);
      background: rgba(35, 25, 18, 0.78);
      border-color: rgba(207, 168, 116, 0.7);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(207, 168, 116, 0.25);
    }

    .why-choose-icon-box {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      border: 1.5px solid rgba(207, 168, 116, 0.6);
      background: rgba(207, 168, 116, 0.08);
      color: #D4AF37;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      transition: all 0.35s ease;
      box-shadow: 0 0 15px rgba(207, 168, 116, 0.1);
    }

    .why-choose-card:hover .why-choose-icon-box {
      background: var(--brand-warm-gold, #CFA874);
      color: #1A120B;
      border-color: #D4AF37;
      transform: scale(1.1) rotate(6deg);
      box-shadow: 0 0 20px rgba(207, 168, 116, 0.4);
    }

    .why-choose-card-title {
      font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
      font-size: 1.15rem;
      font-weight: 500;
      color: #FFFFFF;
      margin: 0 0 10px 0;
      line-height: 1.3;
      letter-spacing: 0.01em;
    }

    .why-choose-card-text {
      font-family: var(--font-sans, system-ui, sans-serif);
      font-size: 0.88rem;
      color: rgba(243, 236, 228, 0.82);
      line-height: 1.6;
      margin: 0;
      font-weight: 400;
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
      padding: 36px 28px;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .pillar-card:hover {
      border-color: var(--brand-warm-gold);
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 16px 36px rgba(207, 168, 116, 0.18);
    }

    .pillar-icon {
      color: var(--brand-warm-gold);
      margin-bottom: 18px;
      display: flex;
      justify-content: center;
      transition: transform 0.4s ease;
    }

    .pillar-card:hover .pillar-icon {
      transform: scale(1.15) translateY(-3px);
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
export class AboutComponent implements AfterViewInit {
  @ViewChild('heritageSection') heritageSection?: ElementRef<HTMLElement>;
  @ViewChild('heritageBg') heritageBg?: ElementRef<HTMLElement>;

  private isTicking = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isTicking) {
      window.requestAnimationFrame(() => {
        this.updateParallaxScrollEffect();
        this.isTicking = false;
      });
      this.isTicking = true;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateParallaxScrollEffect();
      this.initScrollObserver();
    }, 100);
  }

  private initScrollObserver(): void {
    if (typeof window === 'undefined') return;

    const targets = document.querySelectorAll(
      '.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-fade-up, .animate-stagger-card'
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
      // Fallback for non-supported browsers
      targets.forEach((el) => el.classList.add('in-view'));
    }
  }

  private updateParallaxScrollEffect(): void {
    if (typeof window === 'undefined' || !this.heritageSection || !this.heritageBg) return;
    const el = this.heritageSection.nativeElement;
    const bg = this.heritageBg.nativeElement;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalDist = windowHeight + rect.height;
      const currentDist = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);

      const scale = 1.28 - (progress * 0.25);
      const translateY = (progress - 0.5) * -75;

      bg.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    }
  }
}

