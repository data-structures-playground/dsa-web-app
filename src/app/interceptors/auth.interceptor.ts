import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

import { AUTH_TOKEN_STORAGE_KEY } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const platformId = inject(PLATFORM_ID);
  const isApiRequest =
    request.url.startsWith('/api/')
    || request.url.startsWith('/vis-api/');

  if (!isApiRequest || !isPlatformBrowser(platformId)) {
    return next(request);
  }

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!token) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
