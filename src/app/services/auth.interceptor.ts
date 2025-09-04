import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(Keycloak);

  const token = keycloak.token;

  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
    return next(authReq);
  }

  return next(req);
};