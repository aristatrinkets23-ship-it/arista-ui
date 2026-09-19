import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge badge-' + variant">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 0.7rem;
      font-family: var(--font-sans);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: var(--radius-sm);
    }
    .badge-gold { background-color: var(--brand-warm-gold); color: #FFFFFF; }
    .badge-mocha { background-color: var(--brand-mocha-brown); color: #FFFFFF; }
    .badge-blush { background-color: var(--brand-soft-blush); color: var(--brand-mocha-brown); }
    .badge-sage { background-color: var(--brand-sage-mist); color: var(--brand-mocha-brown); }
    .badge-lavender { background-color: var(--brand-lavender-haze); color: var(--brand-mocha-brown); }
  `]
})
export class BadgeComponent {
  @Input() variant: 'gold' | 'mocha' | 'blush' | 'sage' | 'lavender' = 'gold';
}
