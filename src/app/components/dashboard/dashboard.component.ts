import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PaperRange } from '../../model/paper-range.model';
import { CommandProgressComponent } from '../command-progress/command-progress.component';
import { CommandService } from '../../services/command.service';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TraceService } from '../../services/trace.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatPaginatorModule,
    CommandProgressComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private apiService = inject(ApiService);
  private commandService = inject(CommandService);
  private traceService = inject(TraceService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  public rangeSize: number = 500;
  public pageSize: number = 5;
  public currentPage = signal(0);
  public isProcessing = signal(false);

  public paperRangesSignal = this.apiService.paperRangesSignal;

  public paginatedRanges = computed<PaperRange[]>(() => {
    const all = this.paperRangesSignal();
    const start = this.currentPage() * this.pageSize;
    return all.slice(start, start + this.pageSize);
  });

  fetchRanges(): void {
    this.traceService.clearHeaders();
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.apiService.fetchAllPaperRanges(this.rangeSize);
  }

  processingCommand(): void {
    this.isProcessing.set(true);
    this.commandService.sendCommand(this.paperRangesSignal())
    .pipe(
      finalize(() => this.isProcessing.set(false))
    )
    .subscribe(()=>{
      this.paperRangesSignal.set([]);
    })
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage.set(event.pageIndex);
  }

  public readonly disableSendCommand = computed(() => {
    const rangesEmpty = this.paperRangesSignal().length === 0;
    const prog = this.commandService.progress();
    return rangesEmpty || prog.pending > 0 || prog.running > 0 || this.isProcessing();
  });
}
