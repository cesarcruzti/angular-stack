import { Component, inject, OnInit, OnDestroy, Input, effect, signal, Signal } from '@angular/core';
import { CommandService } from '../../services/command.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { CommandProgress, createInitialProgress } from '../../model/command-progress.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, switchMap, of, timer } from 'rxjs';

@Component({
  selector: 'app-command-progress',
  templateUrl: './command-progress.component.html',
  styleUrls: ['./command-progress.component.scss'],
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatProgressBarModule]
})
export class CommandProgressComponent implements OnInit, OnDestroy {

  private service = inject(CommandService);

  progress: CommandProgress = createInitialProgress();

  isActive: Signal<boolean>;

  constructor() {
    const progress$ = toObservable(this.service.progress);
    const debouncedActive$ = progress$.pipe(
      switchMap(p => {
        if (p.running > 0) {
          return of(true);
        } else {
          return timer(500).pipe(
            switchMap(() => of(false))
          );
        }
      }),
      distinctUntilChanged()
    );

    this.isActive = toSignal(debouncedActive$, { initialValue: false });

    effect(() => {
      this.progress = this.service.progress();
    });
  }

  ngOnInit() {
    this.service.startListening();
  }

  ngOnDestroy() {
    this.service.stopListening();
  }

  getFillPercent(value: number): number {
    return Math.min(100, (value / this.progress.expected) * 100);
  }

  getTime() {
    if(this.progress.processed < this.progress.expected){
      return '';
    }

    let duration_ms = this.progress.end - this.progress.start;

    if (duration_ms <= 0) {
        return '';
    }

    if (duration_ms < 1000) {
        return `(${duration_ms}ms)`;
    }

    let duration_s = Math.floor(duration_ms / 1000);
    let minutes = Math.floor(duration_s / 60);
    let seconds = duration_s % 60;

    if (duration_s < 60) {
        return `(${seconds}s)`;
    }

    return `(${minutes}m ${seconds}s)`;
  }
}