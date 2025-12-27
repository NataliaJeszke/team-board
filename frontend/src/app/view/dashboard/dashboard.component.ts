import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { AuthActions } from '../../core/auth/store/auth.actions';
import { selectCurrentUser } from '../../core/auth/store/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, ButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private store = inject(Store);
  
  currentUser$ = this.store.select(selectCurrentUser);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}