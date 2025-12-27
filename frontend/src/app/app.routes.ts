import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./view/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./view/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./view/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];