import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexTooltip,
  NgApexchartsModule
} from 'ng-apexcharts';

export type BoxPlotDatum = {
  x: string;
  y: [number, number, number, number, number];
};

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './graph.html',
  styleUrls: ['./graph.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Graph {
  data: BoxPlotDatum[] = [];

  public chartSeries: ApexAxisChartSeries = [];

  public chartOptions = {
    chart: {
      type: 'boxPlot',
      height: 350
    } as ApexChart,
    title: {
      text: 'Performance',
      align: 'center'
    } as ApexTitleSubtitle,
    xaxis: {
      type: 'category'
    } as ApexXAxis,
    yaxis: {
      title: {
        text: 'Time (ms)'
      }
    } as ApexYAxis,
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#5C4742',
          lower: '#A5978B'
        }
      }
    } as ApexPlotOptions,
    tooltip: {
      shared: false,
      intersect: true
    } as ApexTooltip
  };

  constructor(private cdr: ChangeDetectorRef) {}

  // ✅ Novo valor recebido
  @Input()
  set input(data: BoxPlotDatum[] | []) {
    if (!data) return;
    this.data = data;
    this.updateChartSeries(data);
  }

  private updateChartSeries(data: BoxPlotDatum[] | []) {
    this.chartSeries = [
      {
        name: 'BoxPlot',
        data
      }
    ];
    this.cdr.markForCheck();
  }

}
