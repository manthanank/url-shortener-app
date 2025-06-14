import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shorten/shorten').then((m) => m.Shorten),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics').then(
        (m) => m.Analytics
      ),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./legal/privacy/privacy').then(
        (m) => m.Privacy
      ),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./legal/terms/terms').then((m) => m.Terms),
  },
  {
    path: 'cookies',
    loadComponent: () =>
      import('./legal/cookies/cookies').then(
        (m) => m.Cookies
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
