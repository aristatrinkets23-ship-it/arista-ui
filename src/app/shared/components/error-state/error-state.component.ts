import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state">
      <div class="icon">!</div>
      <h3 class="title">{{ title }}</h3>
      <p class="message">{{ message }}</p>
      <button type="button" class="btn-retry" (click)="retry.emit()">Retry</button>
    </div>
  `,
  styles: [`
    .error-state {
      text-align: center;
      padding: var(--space-2xl);
      background-color: #FFF8F8;
      border: 1px solid #F5C6CB;
      border-radius: var(--radius-md);
      margin: var(--space-lg) 0;
    }
    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--color-error);
      color: #FFFFFF;
      font-weight: bold;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-md);
    }
    .title { font-family: var(--font-serif); color: var(--brand-mocha-brown); margin-bottom: var(--space-xs); }
    .message { color: var(--color-text-secondary); margin-bottom: var(--space-md); }
    .btn-retry {
      background-color: var(--brand-mocha-brown);
      color: #FFFFFF;
      border: none;
      padding: 8px 20px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
  `]
})
export class ErrorStateComponent {
  @Input() title: string = 'Unable to Load Content';
  @Input() message: string = 'An error occurred while communicating with the server. Please try again.';
  @Output() retry = new EventEmitter<void>();
}
