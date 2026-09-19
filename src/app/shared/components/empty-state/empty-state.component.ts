import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="empty-state">
      <div class="icon-box">
        <ng-content select="[slot=icon]"></ng-content>
        <svg *ngIf="!hasCustomIcon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
      <div class="action-box">
        <ng-content select="[slot=action]"></ng-content>
        <a *ngIf="actionText && actionPath" [routerLink]="actionPath" class="btn-action">
          {{ actionText }} &rarr;
        </a>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      background-color: var(--brand-pearl-beige);
      border-radius: var(--radius-md);
      border: 1px dashed var(--color-border);
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .icon-box {
      margin-bottom: 16px;
      color: var(--brand-warm-gold);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title {
      font-family: var(--font-serif);
      font-size: 1.6rem;
      color: var(--brand-mocha-brown);
      margin-bottom: 8px;
      text-align: center;
    }
    .description {
      color: #666666;
      font-size: 0.95rem;
      max-width: 440px;
      margin: 0 auto 24px auto;
      text-align: center;
      line-height: 1.5;
    }
    .action-box {
      display: flex;
      justify-content: center;
      width: 100%;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 10px 24px;
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }
    .btn-action:hover {
      background-color: #E2B882;
      color: #382A1F;
      transform: translateY(-2px);
      box-shadow: var(--shadow-gold);
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No Items Found';
  @Input() description: string = 'There are currently no items to display in this category.';
  @Input() actionText: string = '';
  @Input() actionPath: string = '';
  @Input() hasCustomIcon: boolean = false;
}
