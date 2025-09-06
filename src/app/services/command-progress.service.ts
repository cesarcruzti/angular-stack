import { Injectable, signal } from '@angular/core';
import { CommandProgress } from '../model/command-progress.model';

@Injectable({ providedIn: 'root' })
export class CommandProgressService {
  private url = '/bff/stream/progress';

  public readonly progress = signal<CommandProgress>({pending: 0, running: 0, processed: 0, failed: 0});

  private eventSource?: EventSource;

  startListening() {
    if (this.eventSource) return;

    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.progress.set(data);
    };

    this.eventSource.onerror = (err) => {
      console.error('SSE error', err);
      this.stopListening();
    };
  }

  stopListening() {
    this.eventSource?.close();
    this.eventSource = undefined;
  }
}
