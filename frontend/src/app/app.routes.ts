import { Routes } from '@angular/router';

import { authGuard } from '@core/auth/guards/auth/auth.guard';
import { guestGuard } from '@core/auth/guards/guest/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./view/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./view/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'board',
    loadComponent: () => import('./view/board/board.component').then(m => m.BoardComponent),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./view/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
