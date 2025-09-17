import { HttpInterceptorFn, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { TraceService } from './trace.service';
import { tap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(Keycloak);
  const traceService = inject(TraceService);

  const traceHeaders = traceService.getHeaders();

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    ...(keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {}),
    ...(traceHeaders.traceparent ? { Traceparent: traceHeaders.traceparent } : {}),
    ...(traceHeaders.correlationid ? { Correlationid: traceHeaders.correlationid } : {}),
  });

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const newTrace = {
          traceparent: event.headers.get('Traceparent') ?? undefined,
          correlationid: event.headers.get('Correlationid') ?? undefined,
        };
        traceService.setHeaders(newTrace);
      }
    })
  );
};