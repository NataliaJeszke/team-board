import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthApiService } from '@core/api/services/auth-api/auth-api.service';

import { AuthActions } from './auth.actions';
import { TokenStorageService } from '../services/tokenStorage/token-storage.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApi = inject(AuthApiService);
  private tokenStorage = inject(TokenStorageService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authApi.login(credentials).pipe(
          map(response => {
            const token = response.access_token;
            const user = response.user;

            this.tokenStorage.saveToken(token);
            this.tokenStorage.saveUser(user);

            return AuthActions.loginSuccess({ token, user });
          }),
          catchError(error =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message || 'Błąd logowania',
              })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authApi.register(data).pipe(
          map(response => {
            const token = response.access_token;
            const user = response.user;

            this.tokenStorage.saveToken(token);
            this.tokenStorage.saveUser(user);

            return AuthActions.registerSuccess({ token, user });
          }),
          catchError(error =>
            of(
              AuthActions.registerFailure({
                error: error?.error?.message || 'Błąd rejestracji',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/board']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.tokenStorage.clear();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      map(() => {
        const token = this.tokenStorage.getToken();
        const user = this.tokenStorage.getUser();

        if (token && user) {
          return AuthActions.initAuthSuccess({ token, user });
        }
        return AuthActions.initAuthFailure();
      })
    )
  );

  initAuthSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuthSuccess),
      switchMap(() =>
        this.authApi.getProfile().pipe(
          map(user => {
            this.tokenStorage.saveUser(user);
            return AuthActions.loadProfileSuccess({ user });
          }),
          catchError(() => {
            this.tokenStorage.clear();
            return of(AuthActions.logout());
          })
        )
      )
    )
  );
}
