import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoginRequest, RegisterRequest } from '@core/models';

import { AuthActions } from './store/auth.actions';
import {
  selectToken,
  selectAuthError,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
} from './store/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authStore = inject(Store);

  readonly user$ = this.authStore.select(selectCurrentUser);
  readonly isAuthenticated$ = this.authStore.select(selectIsAuthenticated);
  readonly loading$ = this.authStore.select(selectAuthLoading);
  readonly error$ = this.authStore.select(selectAuthError);
  readonly token$ = this.authStore.select(selectToken);

  login(credentials: LoginRequest) {
    this.authStore.dispatch(AuthActions.login({ credentials }));
  }

  register(data: RegisterRequest) {
    this.authStore.dispatch(AuthActions.register({ data }));
  }

  logout() {
    this.authStore.dispatch(AuthActions.logout());
  }
}
