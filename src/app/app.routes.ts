import { Routes } from '@angular/router';
import { ShortenComponent } from './shorten/shorten.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shorten/shorten.component').then((m) => m.ShortenComponent),
  },
];
