import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant + ' btn-' + size + (rounded ? ' btn-rounded' : '')"
      (click)="onClick($event)"
      [attr.aria-label]="ariaLabel || null"
    >
      <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
      <span class="btn-content" [class.invisible]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-family: var(--font-sans);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
      border: 1px solid transparent;
      outline: none;
    }

    .btn-rounded {
      border-radius: var(--radius-full) !important;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Compact Sizes */
    .btn-sm { padding: 6px 16px; font-size: 0.75rem; }
    .btn-md { padding: 9px 22px; font-size: 0.82rem; }
    .btn-lg { padding: 12px 28px; font-size: 0.88rem; font-weight: 700; }

    /* Variants */
    .btn-primary {
      background-color: var(--brand-warm-gold);
      color: var(--brand-mocha-brown);
      font-weight: 600;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: #E2B882;
      color: #382A1F;
      transform: translateY(-2px);
      box-shadow: var(--shadow-gold);
    }

    .btn-secondary {
      background-color: var(--brand-mocha-brown);
      color: #FFFFFF;
      font-weight: 600;
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: #443427;
      color: #F7E9E6;
      transform: translateY(-2px);
    }

    .btn-outline {
      background: transparent;
      border-color: var(--brand-mocha-brown);
      color: var(--brand-mocha-brown);
    }
    .btn-outline:hover:not(:disabled) {
      background-color: var(--brand-mocha-brown);
      color: #FFFFFF;
    }

    .btn-ghost {
      background: transparent;
      color: var(--brand-mocha-brown);
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: var(--brand-pearl-beige);
    }

    .spinner {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .invisible { opacity: 0; }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() rounded: boolean = false;
  @Input() ariaLabel: string = '';

  @Output() btnClick = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
