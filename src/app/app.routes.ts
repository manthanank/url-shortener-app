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
    path: '**',
    redirectTo: '',
  },
];
