import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take, filter, switchMap } from 'rxjs/operators';

import { selectIsAuthenticated, selectAuthInitialized } from '../../store/auth.selectors';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthInitialized).pipe(
    filter(Boolean),
    switchMap(() => store.select(selectIsAuthenticated)),
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        router.navigate(['/board']);
        return false;
      }
      return true;
    })
  );
};
