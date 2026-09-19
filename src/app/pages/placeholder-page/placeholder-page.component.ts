import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SectionHeadingComponent } from '../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule, SectionHeadingComponent],
  template: `
    <div class="container section-padding">
      <app-section-heading
        [subtitle]="'Arista Trinkets'"
        [title]="pageTitle"
        align="center"
      ></app-section-heading>

      <div class="placeholder-box">
        <p class="placeholder-text">
          The <strong>{{ pageTitle }}</strong> module is initialized and ready for Phase 03 page feature implementation.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .placeholder-box {
      background-color: var(--brand-pearl-beige);
      border: 1px dashed var(--brand-warm-gold);
      padding: var(--space-3xl);
      border-radius: var(--radius-md);
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    .placeholder-text {
      font-size: 1rem;
      color: var(--brand-mocha-brown);
    }
  `]
})
export class PlaceholderPageComponent implements OnInit {
  pageTitle: string = 'Page';
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data && data['title']) {
        this.pageTitle = data['title'];
      }
    });
  }
}
