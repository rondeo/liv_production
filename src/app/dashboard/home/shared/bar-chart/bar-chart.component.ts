import {Component, OnInit, OnDestroy, Input, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {AmChart, AmChartsService} from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
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
    if(this.data.name ==='UserCount'){
      var colorvalue = ["#1E87F0", "#40BCF9"];
      //console.log("this.data.colorvalue",this.data);
      // if(this.data.colorvalue=='whatsapp' ||this.data.colorvalue=='WhatsApp' )
      // {
      // colorvalue=["#1ebea5","#40BB99"];
      // }

      this.chart = this.AmCharts.makeChart(this.id, {
        "type": "serial",
			  "theme": "light",
			  "lineColor": "#CC0000",
			  "dataProvider":this.data && this.data.graph ? this.data.graph : [],
			  "valueAxes": [ {
				//"gridColor": "#FFFFFF",
				"gridAlpha": 0.2,
				"dashLength": 0
			  } ],
			  "gridAboveGraphs": false,
			  "startDuration": 1,
			  "graphs": [ {
				"balloonText": "[[category]]: <b>[[value]]</b>",
				"fillAlphas": 1,
				"lineAlpha": 0,
				"type": "column",
				"valueField": "count",
				"fillColors":colorvalue,
			  } ],
			  "chartCursor": {
				"categoryBalloonEnabled": false,
				"cursorAlpha": 0,
				"zoomable": false
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
				"gridPosition": "start",
				"labelRotation": 90,
				"gridAlpha": 0.2,
				"tickPosition": "start",
				"tickLength": 0.2
			  },
			  "chartScrollbar": {
				"updateOnReleaseOnly": true,
				"enabled": true,
			},
			  "export": {
				"enabled": true
			  },
			
			"pathToImages": "http://cdn.amcharts.com/lib/3/images/", // required for grips



      });
    }
    if (this.data.name == 'graphDate') {
      this.chart = this.AmCharts.makeChart(this.id, {
        'type': 'serial',
        'theme': 'light',
        'dataProvider': this.data && this.data.graph ? this.data.graph : [],
        'dataDateFormat': this.data.dateFormat ? this.data.dateFormat : '',
        'valueAxes': [{
          'gridColor': '#8CA0B3',
          'gridAlpha': 0.2,
          'dashLength': 0,
          'minimum': this.data.minimumValue ? this.data.minimumValue : 0,
          'title': this.data.valueTitle ? this.data.valueTitle : ''
        }],
        'gridAboveGraphs': true,
        'startDuration': 0,
        'graphs': [{
          'balloonText': '[[category]]: <b>[[value]]</b>',
          'fillAlphas': 1,
          'lineAlpha': 0,
          'type': 'column',
          'valueField': this.data.value,
          'labelText': this.data.showLabel ? `[[${this.data.value}]]` : '',
          'labelRotation': this.data.graph.length > 20 ? 270 : 0,
          'fillColors': ['#1E87F0', '#40BCF9'],
        }],
        'chartCursor': {
          'categoryBalloonEnabled': false,
          'cursorAlpha': 0,
          'zoomable': false,
          'limitToGraph': 'id'
        },
        'categoryField': this.data.title,
        'categoryAxis': {
          'parseDates': !!this.data.date,
          'gridPosition': 'start',
          'gridColor': '#8CA0B3',
          'gridAlpha': 0.2,
          'tickPosition': 'start',
          'tickLength': 20
        },
        'export': {
          'enabled': false
        },
        'mouseWheelZoomEnabled': true,
        'pathToImages': 'https://cdn.amcharts.com/lib/3/images/',

      });


      if (this.data.graph.length > 31) {
        this.AmCharts.updateChart(this.chart, () => {
          // Change whatever properties you want
          this.chart.chartScrollbar = {
            'autoGridCount': true,
            'graph': 'id',
            'scrollbarHeight': 30
          };
        });
        this.chart.addListener('rendered', this.zoomChart());
      }
    }
    if (this.data.name == 'userDate') {
      this.chart = this.AmCharts.makeChart(this.id, {
        'type': 'serial',
        'theme': 'light',
        'marginRight': 40,
        'marginLeft': 40,
        'autoMarginOffset': 20,
        'mouseWheelZoomEnabled': true,
        'dataDateFormat': 'MM-DD-YYYY',
        'startDuration': 0,
        'valueAxes': [{
          'id': 'v1',
          'axisAlpha': 0,
          'position': 'left',
          'ignoreAxisWidth': true
        }],
        'balloon': {
          'borderThickness': 1,
          'shadowAlpha': 0
        },
        'graphs': [{
          'id': 'g1',
          'balloon': {
            'drop': true,
            'adjustBorderColor': false,
            'color': '#ffffff'
          },
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletColor': '#FFFFFF',
          'bulletSize': 5,
          'hideBulletsCount': 50,
          'lineThickness': 2,
          'title': 'red line',
          'useLineColorForBulletBorder': true,
          'valueField': 'count',
          'balloonText': '<span style=\'font-size:18px;\'>[[value]]</span>',
          'lineColor': '#1E87F0',
        }],
      

        'chartCursor': {
          'pan': true,
          'valueLineEnabled': true,
          'valueLineBalloonEnabled': true,
          'cursorAlpha': 1,
          'cursorColor': '#258cbb',
          'limitToGraph': 'g1',
          'valueLineAlpha': 0.2,
          'valueZoomable': true
        },
        // "valueScrollbar": {
        //     "oppositeAxis": true,
        //     "offset": 50,
        //     "scrollbarHeight": 10
        // },
        'categoryField': '_id',
        'categoryAxis': {
          'parseDates': true,
          'dashLength': 1,
          'minorGridEnabled': true
        },
        'export': {
          'enabled': true
        },
        'dataProvider': this.data && this.data.graph ? this.data.graph : [],
        'pathToImages': 'https://cdn.amcharts.com/lib/3/images/'

      });

    }
    if (this.data.name === 'graphRating') {
      this.chart = this.AmCharts.makeChart(this.id, {
        'type': 'serial',
        'theme': 'light',
        'lineColor': '#CC0000',
        'dataDateFormat': 'MM-DD-YYYY',
        'dataProvider': this.data && this.data.graph ? this.data.graph : [],
        'valueAxes': [{
          // "gridColor": "#FFFFFF",

          'gridAlpha': 0,
          'position': 'left',

        }],
        'gridAboveGraphs': false,
        'startDuration': 0,
        'graphs': [{
          'balloonText': 'Count: <b>[[value]]</b>',
          'fillAlphas': 1,
          'lineAlpha': 0.1,
          'type': 'column',
          'valueField': 'count',
          'fillColors': ['#1E87F0', '#40BCF9'],
        }],
        'chartCursor': {
          'categoryBalloonEnabled': false,
          'cursorAlpha': 0,
          'zoomable': false
        },
        'categoryField': '_id',

        'categoryAxis': {
          'parseDates': false,
          'gridPosition': 'start',
          'dashLength': 1,
          // "labelRotation": 90,
          'gridAlpha': 0.2,
          'tickPosition': 'start',
          'tickLength': 0.2,
          'title': 'Rating',
          'position': 'bottom'
        },
        'chartScrollbar': {
          'updateOnReleaseOnly': true,
          'enabled': true,
        },
        'export': {
          'enabled': true
        },

        'pathToImages': 'https://cdn.amcharts.com/lib/3/images/', // required for grips


      });
    }

    if (this.data.name === 'activityHour') {
      this.chart = this.AmCharts.makeChart(this.id, {
        "type": "serial",
        "theme": "light",
        "lineColor": "#CC0000",
        "dataDateFormat": "MM-DD-YYYY",
        "dataProvider":this.data && this.data.graph ? this.data.graph : [],
        "valueAxes": [{
            //"gridColor": "#FFFFFF",
            "gridAlpha": 0.2,
            "dashLength": 0
        }],
        "gridAboveGraphs": false,
        "startDuration": 0,
        "graphs": [{
            "balloonText": "[[category]]: <b>[[value]]</b>",
            "fillAlphas": 1,
            "lineAlpha": 0,
            "type": "column",
            "valueField": "count",
            "fillColors": ["#1E87F0", "#40BCF9"],
        }],
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "_id",
        "categoryAxis": {
            "parseDates": false,
            "gridPosition": "start",
            // "labelRotation": 90,
            "gridAlpha": 0.2,
            "tickPosition": "start",
            "tickLength": 0.2
        },
        "chartScrollbar": {
            "updateOnReleaseOnly": true,
            "enabled": true,
        },
        "export": {
            "enabled": true
        },

        "pathToImages": "https://cdn.amcharts.com/lib/3/images/", // required for grips



      });
    }
    if (this.data.name === 'activityDay') {
      this.chart = this.AmCharts.makeChart(this.id, {
        "type": "serial",
				"theme": "light",
				"lineColor": "#CC0000",
                //"dataDateFormat": "MM-DD-YYYY",
				"dataProvider":this.data && this.data.graph ? this.data.graph : [],
				"valueAxes": [{
					//"gridColor": "#FFFFFF",
					"gridAlpha": 0.2,
					"dashLength": 0
				}],
				"gridAboveGraphs": false,
				"startDuration": 0,
				"graphs": [{
					"balloonText": "[[category]]: <b>[[value]]</b>",
					"fillAlphas": 1,
					"lineAlpha": 0,
					"type": "column",
					"valueField": "count",
					"fillColors": ["#1E87F0", "#40BCF9"],
				}],
				"chartCursor": {
					"categoryBalloonEnabled": false,
					"cursorAlpha": 0,
					"zoomable": false
				},
				"categoryField": "_id",
				"categoryAxis": {
					"parseDates": true,
					"gridPosition": "start",
					 "labelRotation": 90,
					"gridAlpha": 0.2,
					"tickPosition": "start",
					"tickLength": 0.2
				},
				"chartScrollbar": {
					"updateOnReleaseOnly": true,
					"enabled": true,
				},
				"export": {
					"enabled": true
				},

				"pathToImages": "https://cdn.amcharts.com/lib/3/images/", // required for grips



      });
    }
    if (this.data.name === 'overviewGraph') {

      this.chart = this.AmCharts.makeChart(this.id, {
        "type": "serial",
			  "theme": "light",
			  "lineColor": "#CC0000",
			  "dataProvider":this.data && this.data.graph ? this.data.graph : [],
			  "valueAxes": [ {
				//"gridColor": "#FFFFFF",
				"gridAlpha": 0.2,
				"dashLength": 0
			  } ],
			  "gridAboveGraphs": false,
			  "startDuration": 1,
			  "graphs": [ {
				"balloonText": "[[category]]: <b>[[value]]</b>",
				"fillAlphas": 1,
				"lineAlpha": 0,
				"type": "column",
				"valueField": "count",
				"fillColors":["#1E87F0", "#40BCF9"],
			  } ],
			  "chartCursor": {
				"categoryBalloonEnabled": false,
				"cursorAlpha": 0,
				"zoomable": false
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
				"gridPosition": "start",
				"labelRotation": 90,
				"gridAlpha": 0.2,
				"tickPosition": "start",
				"tickLength": 0.2
			  },
			  "chartScrollbar": {
				"updateOnReleaseOnly": true,
				"enabled": true,
			},
			  "export": {
				"enabled": true
			  },
			
			"pathToImages": "http://cdn.amcharts.com/lib/3/images/", // required for grips



      });
    }
    if (this.data.name === 'graphTrending') {

      this.chart = this.AmCharts.makeChart(this.id, {
        "type": "serial",
			  "theme": "light",
			  "lineColor": "#CC0000",
			  "dataProvider":this.data && this.data.graph ? this.data.graph : [],
			  "valueAxes": [ {
				//"gridColor": "#FFFFFF",
				"gridAlpha": 0.2,
				"dashLength": 0
			  } ],
			  "gridAboveGraphs": false,
			  "startDuration": 1,
			  "graphs": [ {
				"balloonText": "[[category]]: <b>[[value]]</b>",
				"fillAlphas": 1,
				"lineAlpha": 0,
				"type": "column",
				"valueField": "count",
				"fillColors":["#1E87F0", "#40BCF9"],
			  } ],
			  "chartCursor": {
				"categoryBalloonEnabled": false,
				"cursorAlpha": 0,
				"zoomable": false
			  },
			  "categoryField": "_id",
			  "categoryAxis": {
				"gridPosition": "start",
        "labelRotation": 90,
        "inside":true,
				"gridAlpha": 0.2,
				"tickPosition": "start",
				"tickLength": 0.2
			  },
			  "chartScrollbar": {
				"updateOnReleaseOnly": true,
				"enabled": true,
			},
			  "export": {
				"enabled": true
			  },
			
			"pathToImages": "http://cdn.amcharts.com/lib/3/images/", // required for grips



      });
    }
    
  }

  zoomChart() {
    // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
    this.chart.zoomToIndexes(this.data.graph.length - 40, this.data.graph.length - 1);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
