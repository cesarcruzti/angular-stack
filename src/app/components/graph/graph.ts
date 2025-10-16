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
  // Armazena valores brutos por categoria
  private rawData = new Map<string, number[]>();

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
  set input(data: { categoria: string; valor: number } | null) {
    if (!data) return;

    console.log(data);

    const { categoria, valor } = data;
    const values = this.rawData.get(categoria) ?? [];
    values.push(valor);
    this.rawData.set(categoria, values);

    this.updateChartSeries();
  }

  private updateChartSeries() {
    const data: BoxPlotDatum[] = [];

    for (const [categoria, valores] of this.rawData.entries()) {
      if (valores.length < 5) continue; // Ignora até ter 5 pontos

      const sorted = [...valores].sort((a, b) => a - b);
      const min = sorted[0];
      const q1 = this.quantile(sorted, 0.25);
      const median = this.quantile(sorted, 0.5);
      const q3 = this.quantile(sorted, 0.75);
      const max = sorted[sorted.length - 1];

      data.push({
        x: categoria,
        y: [min, q1, median, q3, max]
      });
    }

    this.chartSeries = [
      {
        name: 'BoxPlot',
        data
      }
    ];

    // ✅ Atualiza a renderização manualmente
    this.cdr.markForCheck();
  }

  private quantile(arr: number[], q: number): number {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (arr[base + 1] !== undefined) {
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    } else {
      return arr[base];
    }
  }
}
