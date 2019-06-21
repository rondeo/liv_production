import { Component, OnInit, OnDestroy, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  chart: AmChart;
  viewInit: Boolean = false;
  @Input() data;
  @Input() graphHeight: any = 250;
  id = Math.random().toString(36).substring(7);

  constructor(private AmCharts: AmChartsService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.viewInit) {
      this.makeChart();
    }
  }

  ngAfterViewInit() {
    this.makeChart();
    this.viewInit = true;
  }

  makeChart() {
    this.chart = this.AmCharts.makeChart(this.id, {
      'type': 'pie',
      'theme': 'light',
      'dataProvider': this.data && this.data.graph ? this.data.graph : [],
      'valueField': this.data.value,
      'titleField': this.data.title,
      'balloon': {
        'fixedPosition': true
      },
      'export': {
        'enabled': false
      },
      'backgroundColor': '#f7f7f7',
      'colors': ['#1E87F0', ' #F8C239', '#ff6600', '#33cc00', '#113344', '#445500', '#00bb66'
        , '#884411', '#808080', '#55ccff', '#33ff00', '#ff00aa'
      ],
      'creditsPosition': 'bottom-left',
      'labelsEnabled': false,
      'legend': {
        'position': 'right',
        'autoMargins': false,
        'useMarkerColorForLabels': true,
        'useMarkerColorForValues': true,
        'labelText': '[[title]]',
        'valueText': '[[percents]]% ([[value]])',
        'valueWidth': 100,
        'truncateLabels': 12 // custom parameter,
      },
      'outlineColor': '',
      'startDuration': 0,
      'pathToImages': 'https://cdn.amcharts.com/lib/3/images/',
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
