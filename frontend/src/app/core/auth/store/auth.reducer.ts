import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,
  
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.access_token,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    token: response.access_token,
    loading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(AuthActions.logout, AuthActions.logoutComplete, () => initialAuthState),
);