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
    path: 'buttons',
    data: {
      preloadOnHover: true,
      preloadKey: 'buttons',
    },
    loadComponent: () =>
      import('./pages/buttons-showcase/buttons-showcase').then((m) => m.ButtonsShowcase),
  },
  {
    path: 'breadcrumbs',
    data: {
      preloadOnHover: true,
      preloadKey: 'breadcrumbs',
    },
    loadComponent: () =>
      import('./pages/breadcrumb-showcase/breadcrumb-showcase').then((m) => m.BreadcrumbShowcase),
  },
];
