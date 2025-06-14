import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shorten/shorten.component').then((m) => m.ShortenComponent),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then((m) => m.AnalyticsComponent),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./legal/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./legal/terms/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'cookies',
    loadComponent: () =>
      import('./legal/cookies/cookies.component').then((m) => m.CookiesComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
