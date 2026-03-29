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
  selectAuthInitialized,
} from './store/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authStore = inject(Store);

  readonly user = this.authStore.selectSignal(selectCurrentUser);
  readonly isAuthenticated = this.authStore.selectSignal(selectIsAuthenticated);
  readonly loading = this.authStore.selectSignal(selectAuthLoading);
  readonly error = this.authStore.selectSignal(selectAuthError);
  readonly token = this.authStore.selectSignal(selectToken);
  readonly initialized = this.authStore.selectSignal(selectAuthInitialized);

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