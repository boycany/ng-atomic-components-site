import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    data: {
      preloadOnHover: true,
      preloadKey: 'home',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'feature',
    data: {
      preloadOnHover: true,
      preloadKey: 'feature',
    },
    loadComponent: () => import('./pages/feature/feature').then((m) => m.Feature),
  },
];
