import { Component, AfterViewInit, OnDestroy, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="layout-wrapper">
      <app-header></app-header>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .main-content {
      flex: 1;
      padding-top: 72px;
    }

    @media (min-width: 992px) {
      .main-content {
        padding-top: 84px;
      }
    }
  `]
})
export class MainLayoutComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private el = inject(ElementRef);
  private routerSub!: Subscription;
  private observer!: IntersectionObserver;

  ngAfterViewInit(): void {
    this.initScrollObserver();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => this.observeElements(), 120);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.observer) this.observer.disconnect();
  }

  private initScrollObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    this.observeElements();
  }

  private observeElements(): void {
    if (!this.observer) return;

    const selectors = 'section, .category-card, app-product-card, .pillar-card, .editorial-grid, .info-card, .form-card, .brand-intro-section, .cat-block';
    const targets = this.el.nativeElement.querySelectorAll(selectors);
    
    targets.forEach((target: HTMLElement) => {
      if (!target.classList.contains('reveal')) {
        target.classList.add('reveal');
      }
      this.observer.observe(target);
    });
  }
}
