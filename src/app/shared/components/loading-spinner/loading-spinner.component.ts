import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-wrapper" [class.full-page]="fullPage">
      <div class="spinner"></div>
      <p *ngIf="message" class="loading-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }
    .full-page {
      min-height: 50vh;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--brand-pearl-beige);
      border-top-color: var(--brand-warm-gold);
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    .loading-text {
      margin-top: var(--space-md);
      font-size: 0.9rem;
      color: var(--brand-mocha-brown);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading Arista Trinkets...';
  @Input() fullPage: boolean = false;
}
