import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { API_CONFIG } from '@core/api/config/tokens/api-config.token';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  const apiConfig = inject(API_CONFIG);
  
  if (
    req.url.startsWith('http') || 
    req.url.startsWith('assets/') ||
    req.url.startsWith('./assets/')
  ) {
    return next(req);
  }
  
  const apiReq = req.clone({
    url: `${apiConfig.baseUrl}${req.url}`
  });
  
  return next(apiReq);
};
