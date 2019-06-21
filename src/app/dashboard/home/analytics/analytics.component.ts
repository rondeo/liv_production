import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';


import { AnalyticsService } from './analytics.service';
import { SocketService } from '../socket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    toDate: any = moment();
    fromDate: any = moment().subtract(30, 'days');
    users: Array<any> = [];
    totalUserCount: string;
    colorCode: any = {};
    device: Array<any> = [];
    graphDevice: any = {};
    intent: Array<any> = [];
    graphIntent: any = {};
    type: Array<any> = [];
    graphType: any = {};
    date: Array<any> = [];
    graphDate: any = {};
    revenue: Array<any> = [];
    userCount: Array<any> = [];
    graphRevenue: any = {};
    graphUsersDay: any = {};
    messageUserChannel: any = 'day';
    usersCountDayData: Array<any> = [];
    activityDayData: Array<any> = [];
    messageDayChannel: any = 'day';
    private activityGraphData: Array<any> = [];
    private usersCountGraphData: Array<any> = [];
    private static monthString: Array<any> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    radioStatus: any;
    creditTypes = {
        'park': 'Car Parking',
        'charge': 'Car Charging',
        'laundry': 'Laundry',
        'callTaxi': 'Call taxi',
        'package': 'Picking up package',
        'fridgeTempAlert': 'Fridge notifications',
        'beanOrder': 'Ordering beans',
        'milkOrder': 'Ordering milks',
        'nooneRoom': 'Air Conditioner notifications',
        'partNumber': 'Ordering parts',
        'orderPizza': 'Ordering pizza'
    };

    socketSubscription: Subscription;
    static formatToDate(date: String) {
        let tempDate: any = date.split('-');
        tempDate = tempDate.reverse();
        tempDate = tempDate.map(item => parseInt(item, 10));
        return new Date(tempDate[0], tempDate[2], tempDate[1]);
    }


    constructor(private analyticService: AnalyticsService, private socket: SocketService,
        private toastr: ToastrService) {

    }

    ngOnInit() {
        // this.dateChanges([new Date(Date.parse(this.fromDate)), new Date(Date.parse(this.toDate))]);
        this.socketSubscription = this.socket.getRevenueUpdate().subscribe(revenue => {
            this.revenue = _.unionBy(revenue.data, this.revenue, '_id');
            this.revenue.sort((a, b) => {
                const tempA: any = AnalyticsComponent.formatToDate(a._id);
                const tempB: any = AnalyticsComponent.formatToDate(b._id);
                return <any>new Date(tempA) - <any>new Date(tempB);
            });

            this.graphRevenue = {
                value: 'total',
                title: '_id',
                graph: this.revenue,
                date: true,
                dateFormat: 'MM-DD-YYYY',
                valueTitle: 'Revenue(in $)',
                showLabel: true,
                minimumValue: 'unset'
            };
            this.toastr.info('', `$${revenue.amount} has been credited to your account towards
             ${this.creditTypes[revenue.type]}. Total earnings today: 
             $${this.revenue[this.revenue.length - 1].total}.`);

        });
    }


    ngOnDestroy() {
        this.socketSubscription.unsubscribe();
    }

    changeUserCount(channel){
      console.log("channel", channel);
      this.usersCountDayData= this.userCount;
      console.log('usersCountDayData',this.usersCountDayData,'userCount',this.userCount);

      this.usersCountGraphData = this.usersCountDayData;
      console.log('usersCountGraphData',this.usersCountGraphData);

      console.log("this.activityGraphData", this.usersCountGraphData);
      this.calculateUsersCountGraphData();
      this.graphUsersDay = {
        name: 'UserCount',
        value: 'count',
        title: '_id',
        graph: this.usersCountDayData,
        date: true,
        dateFormat: 'MM-DD-YYYY'
      };
    }


    changeusersChannel(channel){
      
      this.messageUserChannel = channel;
      this.changeUserCount(this.messageUserChannel);
    }

        calculateUsersCountGraphData(): void {

      if (this.usersCountDayData && this.usersCountDayData.length) {
        this.usersCountDayData = this.usersCountGraphData;
        if (this.messageUserChannel === 'day') {
  
          this.usersCountDayData.sort((a, b) => {
            const tempA: any = AnalyticsComponent.formatToDate(a._id);
            const tempB: any = AnalyticsComponent.formatToDate(b._id);
            return <any>new Date(tempA) - <any>new Date(tempB);
          });
  
          /**/
        } else if (this.messageUserChannel === 'week') {
          const weekCount = _.reduce(this.usersCountDayData, function (res, item) {
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
          this.usersCountDayData = _.values(weekCount);
        } else if (this.messageUserChannel === 'month') {
          const monthCount = _.reduce(this.usersCountDayData, function (res, item) {
            const currentMonth = moment(item._id, 'MM-DD-YYYY').month();
            if (res.hasOwnProperty(AnalyticsComponent.monthString[currentMonth])) {
              res[AnalyticsComponent.monthString[currentMonth]].count += item.count;
            } else {
              res[AnalyticsComponent.monthString[currentMonth]] = {
                _id: AnalyticsComponent.monthString[currentMonth],
                count: item.count
              };
            }
            return res;
          }, {});
          this.usersCountDayData = _.values(monthCount);
        }
      }
    }

    dateChanges(dateArray) {
        if (dateArray) {
       
     
            this.fromDate = dateArray[0].getTime();
            this.toDate = dateArray[1].getTime();
            this.radioStatus = moment(dateArray[1]).diff(moment(dateArray[0]), 'days') > 30 ? false : true;
            if (this.radioStatus == false) {
              this.messageDayChannel = 'week';
              
      
            }
          }
        if (dateArray !== null) {
            this.analyticService.graphs(dateArray[0].getTime(), dateArray[1].getTime()).subscribe(data => {
                if (data.status === 200) {
                    this.users = data.info && data.info.users ? data.info.users : [];
                    this.users.sort(((a, b) => a._id.localeCompare(b._id)));
                    this.users.forEach((key, index) => {
                        this.colorCode[key._id] = this.getRandomColor(index);
                    });

                    this.totalUserCount = this.users.reduce(function (s, f) {
                        return s + f.count;
                    }, 0);

                    this.device = data.info && data.info.device ? data.info.device : [];
                    this.device.sort(((a, b) => a._id.localeCompare(b._id)));

		    this.device.map(item => {
			if (item._id === 'whatsappofficial'){
				item._id = 'whatsapp';
			}
			return item;
		    });

                    this.graphDevice = {
                        value: 'count',
                        title: '_id',
                        graph: this.device
                    };


                    this.intent = data.info && data.info.intent ? data.info.intent : [];
                    this.intent.sort(((a, b) => a._id.localeCompare(b._id)));

                    this.graphIntent = {
                        value: 'count',
                        title: '_id',
                        graph: this.intent
                    };


                    this.type = data.info && data.info.type ? data.info.type : [];
                    this.type.sort(((a, b) => a._id.localeCompare(b._id)));

                    this.graphType = {
                        value: 'count',
                        title: '_id',
                        graph: this.type
                    };

                    this.date = data.info && data.info.date ? data.info.date : [];
                    this.date.sort((a, b) => {
                        const tempA: any = AnalyticsComponent.formatToDate(a._id);
                        const tempB: any = AnalyticsComponent.formatToDate(b._id);
                        return <any>new Date(tempA) - <any>new Date(tempB);
                    });

                    this.changeChannel();
                    this.revenue = data.info && data.info.revenue ? data.info.revenue : [];
                    this.revenue.sort((a, b) => {
                        const tempA: any = AnalyticsComponent.formatToDate(a._id);
                        const tempB: any = AnalyticsComponent.formatToDate(b._id);
                        return <any>new Date(tempA) - <any>new Date(tempB);
                    });

                    this.graphRevenue = {
                        value: 'total',
                        title: '_id',
                        graph: this.revenue,
                        date: true,
                        dateFormat: 'MM-DD-YYYY',
                        valueTitle: 'Revenue(in $)',
                        showLabel: true,
                        minimumValue: 'unset'
                    };
		     this.userCount=data.info && data.info.usersCount ? data.info.usersCount : [];
          this.changeUserCount('all');
          this.graphUsersDay = {
            name: 'UserCount',
            value: 'count',
            title: '_id',
            graph: this.userCount,
            date: true,
            dateFormat: 'MM-DD-YYYY'
          };

                } else {
                    console.log('Graphs status not 200', data);
                }
            }, error2 => {
                console.log('Graphs list error', error2);
            });
        }
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
    changeDayChannel(channel) {
        this.messageDayChannel = channel;
    
        this.changeChannel();
      }
      changeChannel() {
        // console.log("channel", channel);
        // this.messageChannel = channel;
        // var dataday = _.find(this.channelActivity, { _id: this.messageChannel });
        // var sessiondataday = _.find(this.channelActivityvalue, { _id: this.messageChannel });
    
     this.activityDayData=this.date;
    
         this.activityGraphData = this.activityDayData;
        // console.log("this.activityGraphData", this.activityGraphData);
         this.calculateActivityGraphData();
        this.graphDate = {
          name:'overviewGraph',
          value: 'count',
          title: '_id',
          graph: this.activityDayData,
          date: true,
          dateFormat: 'MM-DD-YYYY'
      }
        //this.dateChanges(this.datePick);
      }
      calculateActivityGraphData(): void {
  
        if (this.activityDayData && this.activityDayData.length) {
          this.activityDayData = this.activityGraphData;
          if (this.messageDayChannel === 'day') {
    
            this.activityDayData.sort((a, b) => {
              const tempA: any = AnalyticsComponent.formatToDate(a._id);
              const tempB: any = AnalyticsComponent.formatToDate(b._id);
              return <any>new Date(tempA) - <any>new Date(tempB);
            });
    
            /**/
          } else if (this.messageDayChannel === 'week') {
            const weekCount = _.reduce(this.activityDayData, function (res, item) {
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
            this.activityDayData = _.values(weekCount);
          } else if (this.messageDayChannel === 'month') {
            const monthCount = _.reduce(this.activityDayData, function (res, item) {
              const currentMonth = moment(item._id, 'MM-DD-YYYY').month();
              if (res.hasOwnProperty(AnalyticsComponent.monthString[currentMonth])) {
                res[AnalyticsComponent.monthString[currentMonth]].count += item.count;
              } else {
                res[AnalyticsComponent.monthString[currentMonth]] = {
                  _id: AnalyticsComponent.monthString[currentMonth],
                  count: item.count
                };
              }
              return res;
            }, {});
            this.activityDayData = _.values(monthCount);
          }
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


}
