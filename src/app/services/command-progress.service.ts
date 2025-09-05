import { Injectable, signal } from '@angular/core';
import { CommandStatus } from '../model/command-status.model';

@Injectable({ providedIn: 'root' })
export class CommandProgressService {
  private url = '/bff/stream/response';

  public readonly progress = signal<CommandStatus[]>([]);

  private eventSource?: EventSource;

  startListening() {
    if (this.eventSource) return;

    this.eventSource = new EventSource(this.url);

    console.log('startListening');

    this.eventSource.onmessage = (event) => {
      const data: CommandStatus = JSON.parse(event.data);
      this.progress.update(prev => [...prev, data]);
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
