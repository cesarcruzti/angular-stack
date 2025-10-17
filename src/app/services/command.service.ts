import { Injectable, signal } from '@angular/core';
import { CommandProgress, createInitialProgress } from '../model/command-progress.model';
import { PaperRange } from '../model/paper-range.model';
import { HttpClient } from '@angular/common/http';
import { BoxPlotDatum } from '../components/graph/graph';
import { BestPerformance } from '../model/best-performance.model';

@Injectable({ providedIn: 'root' })
export class CommandService {
  

  public readonly progress = signal<CommandProgress>(createInitialProgress());

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

  getPerformanceHistory() {
    return this.http.get<BoxPlotDatum[]>('/bff/performance-history');
  }

  getBestPerformance() {
    return this.http.get<BestPerformance>('/bff/best-performance');
  }
}
