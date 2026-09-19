import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field">
      <label *ngIf="label" [for]="id" class="form-label">
        {{ label }} <span *ngIf="required" class="required">*</span>
      </label>
      <ng-content></ng-content>
      <span *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</span>
      <span *ngIf="hint && !errorMessage" class="hint">{{ hint }}</span>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: var(--space-md);
      display: flex;
      flex-direction: column;
    }
    .form-label {
      font-size: 0.85rem;
      font-weight: var(--font-weight-medium);
      color: var(--brand-mocha-brown);
      margin-bottom: var(--space-xs);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .required { color: var(--color-error); }
    .error-msg { font-size: 0.75rem; color: var(--color-error); margin-top: 4px; }
    .hint { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px; }
  `]
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
}
