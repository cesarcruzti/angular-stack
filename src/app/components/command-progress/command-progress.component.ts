import { Component, signal, effect } from '@angular/core';
import { CommandProgressService } from '../../services/command-progress.service';
import { CommandStatus } from '../../model/command-status.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule, NgFor } from '@angular/common';

interface AnimatedCommand extends CommandStatus {
  delay: number;
}

@Component({
  selector: 'app-command-progress',
  templateUrl: './command-progress.component.html',
  styleUrls: ['./command-progress.component.scss'],
  standalone: true,
  imports: [CommonModule, NgFor, MatChipsModule, MatProgressBarModule]
})
export class CommandProgressComponent {
  commands = signal<AnimatedCommand[]>([]);

  constructor(private progressService: CommandProgressService) {
    this.progressService.startListening();

    effect(() => {
      const cmd = this.progressService.progress();
      if (!cmd) return;

      const existing = this.commands().find(c => c.commandId === cmd.commandId);
      if (!existing) {
        const delay = 0
        this.commands.update(arr => [...arr, { ...cmd, delay }]);
      } else {
        this.commands.update(arr =>
          arr.map(c => c.commandId === cmd.commandId ? { ...c, status: cmd.status } : c)
        );
      }
    });
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'RUNNING': return 'primary';
      case 'PROCESSED': return 'accent';
      case 'FAILED': return 'warn';
      default: return '';
    }
  }

  trackById(index: number, item: AnimatedCommand) {
    return item.commandId;
  }

  get processedPercent(): number {
    const cmds = this.commands();
    return cmds.length ? (cmds.filter(c => c.status === 'PROCESSED').length / cmds.length) * 100 : 0;
  }

  get runningPercent(): number {
    const cmds = this.commands();
    return cmds.length ? (cmds.filter(c => c.status === 'RUNNING').length / cmds.length) * 100 : 0;
  }

  get failedPercent(): number {
    const cmds = this.commands();
    return cmds.length ? (cmds.filter(c => c.status === 'FAILED').length / cmds.length) * 100 : 0;
  }
}