import { Injectable, signal } from '@angular/core';
import { CommandStatus } from '../model/command-status.model';
import { CommandProgress } from '../model/command-progress.model';

@Injectable({ providedIn: 'root' })
export class CommandProgressService {
  private url = '/bff/stream/response';

  public readonly progress = signal<CommandProgress>({running: 0, processed: 0});

  private eventSource?: EventSource;

  startListening() {
    if (this.eventSource) return;

    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      const dataString = JSON.parse(event.data);
      const data: CommandStatus = JSON.parse(dataString);
      
      var running = this.progress().running;
      var processed = this.progress().processed;

      if(data.status === 'RUNNING'){
        running++
      } else if(data.status === 'PROCESSED'){
        processed++
      }

      this.progress.set( {running, processed});
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
