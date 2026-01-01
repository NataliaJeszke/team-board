import { createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    token: null,
    user: null,
  })),

  on(AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, () => ({
    ...initialState,
    initialized: true,
  })),

  on(AuthActions.initAuth, state => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.initAuthSuccess, (state, { token, user }) => ({
    ...state,
    token,
    user,
    loading: false,
    initialized: true,
  })),

  on(AuthActions.initAuthFailure, state => ({
    ...state,
    loading: false,
    initialized: true,
    token: null,
    user: null,
  })),

  on(AuthActions.loadProfile, state => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),

  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
