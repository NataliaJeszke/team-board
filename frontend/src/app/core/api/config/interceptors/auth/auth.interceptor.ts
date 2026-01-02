import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthFacade } from '@core/auth/auth.facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const token = authFacade.token();

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq);
  }

  return next(req);
};