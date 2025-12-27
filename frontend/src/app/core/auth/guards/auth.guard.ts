import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { selectIsAuthenticated } from '../store/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      
      router.navigate(['/login']);
      return false;
    })
  );
};