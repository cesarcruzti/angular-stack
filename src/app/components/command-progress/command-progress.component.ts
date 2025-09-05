import { Component, signal, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { CommandProgressService } from '../../services/command-progress.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-command-progress',
  templateUrl: './command-progress.component.html',
  styleUrls: ['./command-progress.component.scss'],
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatProgressBarModule]
})
export class CommandProgressComponent implements OnInit, OnDestroy {

  private service = inject(CommandProgressService);

  public progress = this.service.progress;


  ngOnInit(){
    this.service.startListening();
  }

  ngOnDestroy(){
    this.service.stopListening();
  }


  
}