import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AmChartsService, AmChart } from '@amcharts/amcharts3-angular';
import { Router, NavigationEnd } from '@angular/router';
import { OverviewService } from './overview.service';
import * as _ from 'lodash';
import * as moment from 'moment';
export class Hero {

  constructor(
    public id: number,
    public name: string,
    public power: string,
    public alterEgo?: string
  ) {  }

}
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  dashboardPrefix = environment.dashboardPrefix;
  toDate: any = moment();
  fromDate: any = moment().subtract(30, 'days');
  dateTo: any;
  dateFrom: any;
  users: Array<any> = [];
  date: any;
  viewdropdown:boolean = false;
  sessiondate:any;
  colorCode: any = {};
  totalUserCount: string;
  graphValues: any = {};
  conversations: Array<any> = [];
  messageChannel: any = 'day';
  radioStatus: any;
  private chart: AmChart;
  private activityGraphData: Array<any> = [];
  private activitysessionGraphData:Array<any> = [];
  model :any = {
    power:'messages'
  };
  model2 :any = {
    power:'last30'
  };
  count: { intents: number, entities: number, conversation: number,sessionCount: number,totalcount: number } = {
    intents: 0,
    entities: 0,
    conversation: 0,
    sessionCount:0,
    totalcount:0
  };
  showoverviewloader: any = false;

  private static monthString: Array<any> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  page = sessionStorage.getItem('conversationPage') ?
    parseInt(sessionStorage.getItem('conversationPage'), 10) : 1;
  showloader: any = false;

  static formatToDate(date: String) {
    let tempDate: any = date.split('-');
    tempDate = tempDate.reverse();
    tempDate = tempDate.map(item => parseInt(item, 10));
    return new Date(tempDate[0], tempDate[2], tempDate[1]);
  }

  constructor(private AmCharts: AmChartsService, private router: Router, private overviewService: OverviewService) {

  }

  changedatepicker(){
    if(this.model2.power == "last30"){
      this.viewdropdown=false;
      let r = new Date();
      let d = new Date();
      d.setDate(d.getDate() - parseInt('30'));
      this.fromDate = d;
      this.toDate = r;
      let datevaluesArray = [];
      datevaluesArray.push(this.fromDate,this.toDate);
      this.dateChanges(datevaluesArray)
    }else{
      this.viewdropdown=true;
    }
  }
  changemessages() {

     this.calculateActivityGraphData();

    if(this.model.power == 'messages'){
      this.count.totalcount = this.count.conversation;
    this.graphValues = {
      name: 'overviewGraph',
      value: 'count',
      title: '_id',
      graph: this.date,
      date: true,
      dateFormat: 'MM-DD-YYYY'
    };
    console.log("graphvalue-----",this.graphValues);
  }else{
    this.count.totalcount = this.count.sessionCount;
    this.graphValues = {
      name: 'overviewGraph',
      value: 'count',
      title: '_id',
      graph: this.sessiondate,
      date: true,
      dateFormat: 'MM-DD-YYYY'
    };
    console.log("graphvalue-----",this.graphValues);
  }
  }

  changeChannel(channel) {
    this.messageChannel = channel;
    console.log('channel', "model",this.model);
    this.changemessages();
    /*this.calculateActivityGraphData();
    this.graphValues = {
      name: 'overviewGraph',
      value: 'count',
      title: '_id',
      graph: this.date,
      date: true,
      dateFormat: 'MM-DD-YYYY'
    };*/
  }


  dateChanges(dateArray) {
 console.log("===dtat",dateArray);
    //     var start = moment("2019-01-10", "YYYY-MM-DD");
    // var end = moment("2018-12-15", "YYYY-MM-DD");
    //console.log(Math.floor(moment.duration(start.diff(end)).asDays()));
    if (dateArray) {
      this.model.power='messages';
      this.showoverviewloader = true;
      this.showloader = true;
      this.radioStatus = moment(dateArray[1]).diff(moment(dateArray[0]), 'days') > 30 ? false : true;
      console.log("---OPLOO", this.radioStatus);
      if (this.radioStatus == false) {
        this.messageChannel = 'week';

      }



    this.dateTo = dateArray && dateArray[0].getTime() ? dateArray[0].getTime() : Date.parse(this.toDate._d);
    this.dateFrom = dateArray && dateArray[1].getTime() ? dateArray[1].getTime() : Date.parse(this.fromDate._d);
    console.log('datearray', this.toDate);
    this.overviewService.overview(this.dateTo, this.dateFrom).subscribe(data => {
      console.log("data",data,"model",this.model);
      // this.count.intents = data.info.intents;
      // this.count.entities = data.info.entities;
      this.count.conversation = data.info.conversation;
      this.count.sessionCount = data.info.sessionCount;
      this.count.totalcount = this.count.conversation;

    });
    this.overviewService.graphCount(this.dateTo, this.dateFrom).subscribe(data => {
      if (data) {
        console.log("data",data);
        this.showloader = false;
        this.showoverviewloader = false;
      }
      console.log("--UERS---",data);

      this.users = data.info && data.info.users ? data.info.users : [];
      this.users.forEach((item) => {
        if (item._id == 'fbmessenger') {
          item._id = 'FB Messenger';
        }
        if (item._id == 'bbm') {
          item._id = 'BBM';
        }
        if (item._id == 'viberpa') {
          item._id = 'Viber';
        }
        if (item._id == 'wechat') {
          item._id = 'WeChat';
        }
        if (item._id == 'whatsapp' || item._id == 'whatsappofficial') {
          item._id = 'WhatsApp';
        }
      });

      this.users.sort(((a, b) => a._id.localeCompare(b._id)));
      this.users.forEach((key, index) => {
        this.colorCode[key._id] = this.getRandomColor(index);
      });

      this.totalUserCount = this.users.reduce(function (s, f) {
        return s + f.count;
      }, 0);
      console.log("---JioopDate--",data.info);
      this.date = data.info && data.info.date ? data.info.date : [];
      this.sessiondate = data.info && data.info.date ? data.info.date : [];
      this.activityGraphData = data.info && data.info.date ? data.info.date : [];
      this.activitysessionGraphData = data.info && data.info.sessiondate ? data.info.sessiondate : [];
      this.calculateActivityGraphData();
      console.log("---JioopDate-this.date-",this.date);
      this.graphValues = {
        name: 'overviewGraph',
        value: 'count',
        title: '_id',
        graph: this.date,
        date: true,
        dateFormat: 'MM-DD-YYYY'
      };
    });
  }

  }

  conversationDetails(userId) {
    localStorage.userId = userId;
    sessionStorage.setItem('conversationPage', this.page.toString());
    this.router.navigate([`/${environment.dashboardPrefix}/conversations/${userId}`]);
  }

  ngOnInit() {
  }

  getRandomColor(index): string {
    const includedColors = ['#1E87F0', ' #F8C239', '#ff6600', '#33cc00', '#113344', '#445500', '#00bb66',
      '#884411', '#808080', '#55ccff', '#33ff00', '#ff00aa'];
    if (index < includedColors.length) {
      return includedColors[index];
    } else {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }

  userPercentage(channel, count, totalValue): any {
    let totalCount = 0;
    for (let i = 0; i < totalValue.length; i++) {
      totalCount += totalValue[i].count;
    }
    const percentage = (count / totalCount) * 100;
    return {
      'width': percentage + '%',
      'background-color': this.colorCode[channel]
    };
  }

  userLegendPercentage(id): any {

    return {
      'width': '20px',
      'height': '10px',
      'background-color': this.colorCode[id]
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  calculateActivityGraphData(): void {
    if(this.model.power == 'session'){


    console.log("this.date",this.date);
    if (this.sessiondate && this.sessiondate.length) {
      console.log(this.activitysessionGraphData);
      this.sessiondate = this.activitysessionGraphData;
      if (this.messageChannel === 'day') {
        this.date.sort((a, b) => {
          const tempA: any = OverviewComponent.formatToDate(a._id);
          const tempB: any = OverviewComponent.formatToDate(b._id);
          return <any>new Date(tempA) - <any>new Date(tempB);
        });
      } else if (this.messageChannel === 'week') {
        const weekCount = _.reduce(this.sessiondate, function (res, item) {
          const currentWeek = moment(item._id, 'MM-DD-YYYY').isoWeek();
          if (res.hasOwnProperty('Week ' + currentWeek)) {
            res['Week ' + currentWeek].count += item.count;
          } else {
            res['Week ' + currentWeek] = {
              _id: 'Week ' + currentWeek,
              count: item.count
            };
          }
          return res;
        }, {});
        this.sessiondate = _.values(weekCount);
      } else if (this.messageChannel === 'month') {
        const monthCount = _.reduce(this.sessiondate, function (res, item) {
          const currentMonth = moment(item._id, 'MM-DD-YYYY').month();
          if (res.hasOwnProperty(OverviewComponent.monthString[currentMonth])) {
            res[OverviewComponent.monthString[currentMonth]].count += item.count;
          } else {
            res[OverviewComponent.monthString[currentMonth]] = {
              _id: OverviewComponent.monthString[currentMonth],
              count: item.count
            };
          }
          return res;
        }, {});
        this.sessiondate = _.values(monthCount);
      }
    }
  }else{

    if (this.date && this.date.length) {
      console.log(this.activityGraphData);
      this.date = this.activityGraphData;
      if (this.messageChannel === 'day') {
        this.date.sort((a, b) => {
          const tempA: any = OverviewComponent.formatToDate(a._id);
          const tempB: any = OverviewComponent.formatToDate(b._id);
          return <any>new Date(tempA) - <any>new Date(tempB);
        });
      } else if (this.messageChannel === 'week') {
        const weekCount = _.reduce(this.date, function (res, item) {
          const currentWeek = moment(item._id, 'MM-DD-YYYY').isoWeek();
          if (res.hasOwnProperty('Week ' + currentWeek)) {
            res['Week ' + currentWeek].count += item.count;
          } else {
            res['Week ' + currentWeek] = {
              _id: 'Week ' + currentWeek,
              count: item.count
            };
          }
          return res;
        }, {});
        this.date = _.values(weekCount);
      } else if (this.messageChannel === 'month') {
        const monthCount = _.reduce(this.date, function (res, item) {
          const currentMonth = moment(item._id, 'MM-DD-YYYY').month();
          if (res.hasOwnProperty(OverviewComponent.monthString[currentMonth])) {
            res[OverviewComponent.monthString[currentMonth]].count += item.count;
          } else {
            res[OverviewComponent.monthString[currentMonth]] = {
              _id: OverviewComponent.monthString[currentMonth],
              count: item.count
            };
          }
          return res;
        }, {});
        this.date = _.values(monthCount);
      }
    }

  }
  }

}
