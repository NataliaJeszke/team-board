import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./view/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./view/register/register.component').then(m => m.RegisterComponent),
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
];
