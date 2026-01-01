import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, take } from 'rxjs/operators';

import { AuthFacade } from '@core/auth/auth.facade';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  return authFacade.token$.pipe(
    take(1),
    switchMap(token => {
      if (token) {
        const clonedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next(clonedReq);
      }
      return next(req);
    })
  );
};