import { Component, inject, OnInit, OnDestroy, Input, effect, signal, Signal, WritableSignal } from '@angular/core';
import { CommandProgressService } from '../../services/command-progress.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { CommandStatus } from '../../model/command-status.model';

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
  pending = this.max;
  running = 0;
  processed = 0;

  getFillPercent(value: number): number {
    return Math.min(100, (value / this.max) * 100);
  }

  constructor() {
    effect(() => {
      const { running, processed } = this.service.progress() || {};
      this.processed = processed
      this.running = running-processed
      this.pending = this.max-processed
    });
  }

  ngOnInit() {
    this.service.startListening();
  }

  ngOnDestroy() {
    this.service.stopListening();
  }



}