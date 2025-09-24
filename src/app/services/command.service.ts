import { Injectable, signal } from '@angular/core';
import { CommandProgress } from '../model/command-progress.model';
import { PaperRange } from '../model/paper-range.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CommandService {

  public readonly progress = signal<CommandProgress>({pending: 0, running: 0, processed: 0, failed: 0, start: 0, end: 0, expected: 0});

  private eventSource?: EventSource;

  constructor(private http: HttpClient) {}

  startListening() {
    if (this.eventSource) return;

    this.eventSource = new EventSource("/bff/stream/progress");

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

  sendCommand(ranges: PaperRange[]){
    return this.http.post('/bff/command', ranges);
  }
}
