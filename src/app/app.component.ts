import {Component, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  data: Object;
  options = {};
  dataReady = false;
  seriesName = {
    'mailed': 'Card Was Mailed To Me',
    'producing': 'New Card Is Being Produced',
    'received': 'Case Was Received',
  };

  series = {
  };

  constructor(private http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<Object[]>('assets/USCIS_record_latest.json').subscribe(data => {
      this.parseData(data);
    });
  }

  setOption(status: string, seriesData: any[][]) {
    this.options[status] = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        width: 1000,
        height: 800
      },
      title: {
        text: this.seriesName[status]
      },
      xAxis: {
        type: 'datetime',
        title: {
          enabled: true,
          text: 'Date'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: 'Record Number'
        }
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 3,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {
            headerFormat: 'Date: {point.x:%Y-%m-%d}<br>',
            pointFormat: 'Record Number: YSC{point.y}'
          }
        }
      },
      series: [{
        name: this.seriesName[status],
        color: 'rgba(223, 83, 83, .5)',
        data: seriesData
      }]
    };
    // this.options[status] = {
    //
    //   chart: {
    //     height: null,
    //     width: null
    //   },
    //
    //   rangeSelector: {
    //     buttons: [{
    //       type: 'week',
    //       count: 1,
    //       text: '1w'
    //     }, {
    //       type: 'month',
    //       count: 1,
    //       text: '1m'
    //     }, {
    //       type: 'month',
    //       count: 3,
    //       text: '3m'
    //     }, {
    //       type: 'month',
    //       count: 6,
    //       text: '6m'
    //     }, {
    //       type: 'ytd',
    //       text: 'YTD'
    //     }, {
    //       type: 'year',
    //       count: 1,
    //       text: '1y'
    //     }, {
    //       type: 'all',
    //       text: 'All'
    //     }],
    //     selected: 0
    //   },
    //
    //   title: {
    //     text: this.seriesName[status]
    //   },
    //   yAxis: {
    //     title: {
    //       text: 'Stock Value'
    //     }
    //   },
    //   subtitle: {
    //     text: '<a href="https://www.alphavantage.co/">Source: Alpha Vantage</a>'
    //   },
    //   tooltip: {
    //     shared: true,
    //     split: false
    //   },
    //
    //   series: [{
    //     name: this.seriesName[status],
    //     data: seriesData,
    //     type: 'area',
    //     threshold: null,
    //     tooltip: {
    //       valueDecimals: 2,
    //       shared: true,
    //       split: false
    //     }
    //   }],
    //
    //   responsive: {
    //     rules: [{
    //       condition: {
    //         maxWidth: 500
    //       },
    //       chartOptions: {
    //         chart: {
    //           height: 300
    //         },
    //         subtitle: {
    //           text: null
    //         },
    //         navigator: {
    //           enabled: false
    //         }
    //       }
    //     }]
    //   }
    // };
    this.dataReady = true;
    this.ref.markForCheck();
  }

  dateToString(dateVal: number): string {
    return '';
  }

  getSeriesData(status: string, data: Object[]): any[][] {
    const timeSeries = [];
    for (const record of data) {
      if (record['status'] === this.seriesName[status]) {
        const dateArray = record['date'].split('/');
        const dateString = new Date(dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0]);
        const date = new Date(dateString);
        timeSeries.push([date.valueOf(), parseInt(record['number'], 10)]);
      }
    }
    return timeSeries;
  }

  parseData(data: Object[]) {
    for (const status of Object.keys(this.seriesName)) {
      this.series[status] = this.getSeriesData(status, data);
      this.setOption(status, this.series[status]);
    }
    this.data = data;
  }
}
