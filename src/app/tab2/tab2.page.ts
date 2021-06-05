import {Component} from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page{
  title = 'Statistiche';
  public barChartOptions: ChartOptions;
  public barChartLabels: Label[] = ['Camion', 'Pesate', 'Biocelle'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [10, 3, 5], label: 'Attivi', backgroundColor: '#20bca4aa', hoverBackgroundColor: '#20bca4ff'},
    { data: [5, 1, 2], label: 'Disattivi', backgroundColor: '#1099f9aa', hoverBackgroundColor: '#1099f9ff' }
  ];

  public pieChartOptions: ChartOptions;
  public pieChartLabels: Label[] = ['Organico', 'Inorganico', 'Carta', 'Vetro', 'Plastica'];
  public pieChartData: number[] = [300, 500, 100, 340, 120];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#20bca4aa', '#1099f9aa', '#043764aa', '#ffc409aa', '#f66342aa'],
      borderColor: '#ffffff55'
    },
  ];
  constructor() {
    this.barChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{
          ticks: {
            fontColor: 'white',
            fontSize: 15
          },
          gridLines: {
            display: false,
          }
        }],
        yAxes: [{
          ticks: {
            max : 20,
            min: 0,
            stepSize: 5,
            display: false
          },
          gridLines: {
            display: false
          }
        }],
      },
      legend:{
        labels:{
          fontColor: 'white',
          fontSize: 15
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
        }
      },
      animation: {
        onComplete() {
          const chartInstance = this.chart;
          const ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
              const data = dataset.data[index];
              // eslint-disable-next-line no-underscore-dangle
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        }
      }
    };

    this.pieChartOptions = {
      responsive: true,
      legend: {
        position: 'right',
        labels:{
          fontColor: 'white',
          fontSize: 15
        }
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label;
          },
        },
      },
    };
  }
}
