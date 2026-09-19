import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="icon-box">
        <ng-content select="[slot=icon]"></ng-content>
      </div>
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
      <div class="action-box">
        <ng-content select="[slot=action]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: var(--space-3xl) var(--space-md);
      background-color: var(--brand-pearl-beige);
      border-radius: var(--radius-md);
      border: 1px dashed var(--color-border);
    }
    .icon-box {
      margin-bottom: var(--space-md);
      color: var(--brand-warm-gold);
    }
    .title {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      color: var(--brand-mocha-brown);
      margin-bottom: var(--space-xs);
    }
    .description {
      color: var(--color-text-muted);
      max-width: 400px;
      margin: 0 auto var(--space-lg);
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No Items Found';
  @Input() description: string = 'There are currently no items to display in this category.';
}
