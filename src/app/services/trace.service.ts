import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TraceService {
  private traceparent?: string;
  private correlationid?: string;

  setHeaders(headers: { traceparent?: string; correlationid?: string }) {
    if (headers.traceparent) {
      this.traceparent = headers.traceparent;
    }
    if (headers.correlationid) {
      this.correlationid = headers.correlationid;
    }
  }

  getHeaders(): { traceparent?: string; correlationid?: string } {
    return {
      traceparent: this.traceparent,
      correlationid: this.correlationid,
    };
  }
}
