import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => {
  console.error('Angular Bootstrap Failure:', err);
  const rootEl = document.querySelector('app-root');
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 30px; background: #FFF8F8; color: #D32F2F; border: 2px solid #D32F2F; font-family: monospace; white-space: pre-wrap; margin: 20px;">
        <h2>Angular Bootstrap Error</h2>
        <p>${err?.stack || err?.message || err}</p>
      </div>
    `;
  }
});
