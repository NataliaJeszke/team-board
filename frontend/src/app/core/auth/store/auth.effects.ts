import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';

import { AuthService } from '../service/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ data }) =>
        this.authService.register(data).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  authSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/dashboard']);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.router.navigate(['/login']);
      }),
      map(() => AuthActions.logoutComplete())
    )
  );
}