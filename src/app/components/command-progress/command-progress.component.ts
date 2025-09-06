import { Component, inject, OnInit, OnDestroy, Input, effect, signal, Signal } from '@angular/core';
import { CommandProgressService } from '../../services/command-progress.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { CommandProgress } from '../../model/command-progress.model';
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

  private service = inject(CommandProgressService);

  @Input() max = 5000;

  progress: CommandProgress = { pending: 0, running: 0, processed: 0, failed: 0 };

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
    return Math.min(100, (value / this.max) * 100);
  }
}