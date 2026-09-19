import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'section-heading text-' + align">
      <span *ngIf="subtitle" class="subtitle">{{ subtitle }}</span>
      <h2 class="title">{{ title }}</h2>
      <div *ngIf="showDivider" class="gold-divider"></div>
    </div>
  `,
  styles: [`
    .section-heading {
      margin-bottom: 24px;
    }

    @media (min-width: 768px) {
      .section-heading {
        margin-bottom: 40px;
      }
    }

    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }

    .subtitle {
      display: block;
      font-family: var(--font-sans);
      font-size: var(--font-size-section-sub);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--brand-warm-gold);
      margin-bottom: 4px;
    }

    .title {
      font-family: var(--font-serif);
      font-size: var(--font-size-section-title);
      color: var(--brand-mocha-brown);
      font-weight: 700;
      line-height: 1.2;
    }

    .gold-divider {
      width: 50px;
      height: 2px;
      background-color: var(--brand-warm-gold);
      margin-top: 10px;
    }

    .text-center .gold-divider {
      margin-left: auto;
      margin-right: auto;
    }
  `]
})
export class SectionHeadingComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() align: 'left' | 'center' | 'right' = 'center';
  @Input() showDivider: boolean = true;
}
