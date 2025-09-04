import { Injectable, signal } from '@angular/core';
import { CommandStatus } from '../model/command-status.model';

@Injectable({ providedIn: 'root' })
export class CommandProgressService {
  private url = '/bff/stream/response';

  // Signal para armazenar o status atual
  public progress = signal<CommandStatus | null>(null);

  private eventSource?: EventSource;

  startListening() {
    if (this.eventSource) return; // já está ouvindo

    this.eventSource = new EventSource(this.url);

    this.eventSource.onmessage = (event) => {
      const data: CommandStatus = JSON.parse(event.data);
      this.progress.set(data); // atualiza o signal
    };

    this.eventSource.onerror = (err) => {
      console.error('SSE error', err);
      this.stopListening(); // opcional, para fechar no erro
    };
  }

  stopListening() {
    this.eventSource?.close();
    this.eventSource = undefined;
  }
}
