import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MsgCenterService } from './msg-center.service';
import { LoginService } from '../../../login/login.service';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import { HomeService } from '../../home.service';
import { SocketService } from '../../socket.service';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';


import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';

// import {NotificationListResponse} from './message-center';

@Component({
    selector: 'app-msg-center',
    templateUrl: './msg-center.component.html',
    styleUrls: ['./msg-center.component.scss']
})
export class MsgCenterComponent implements OnInit, OnDestroy {

    @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;

    search: FormControl = new FormControl();
    dashboardPrefix;
    userName = null;
    userType = null;
    token = null;
    count = null;
    notifications = null;
    resultList = [];
    total = null;
    currentRoute: String;
    routeSubscripion: Subscription;
    // Scrolling pagination
    pagination = {
        noOfPages: 0,
        currentPage: 1,
        pageSize: 10
    };
    notificationSpinner = false;

    headerNotifications = [];

    constructor(private router: Router, private spinner: NgxSpinnerService,
        private msgCenterService: MsgCenterService, private loginService: LoginService,
        private toastr: ToastrService, private homeService: HomeService, private socket: SocketService) {
    }


    ngOnInit() {
        this.dashboardPrefix = environment.dashboardPrefix === '/' ? '' : environment.dashboardPrefix;
        this.currentRoute = this.router.url;
        this.routeSubscripion = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.currentRoute = this.router.url;
            }
        });
        this.spinner.show();
        const userData = JSON.parse(localStorage.getItem('user'));
        this.userName = userData.user_name;
        this.userType = userData.user_type;
        this.token = userData.token;
        this.initializeResultList();
        this.socket.getNotification().subscribe(notification => {
            this.getNotification(notification);
        });

        this.toastr.overlayContainer = this.toastContainer;

        // Searching
        this.search.valueChanges.pipe(debounceTime(500)).pipe(distinctUntilChanged()).subscribe(result => {
            this.homeService.sendMessage({
                type: 'search',
                message: result
            });

        });

        // Reset search value when route changes
        this.router.events.subscribe((event) => {
            // Non changable routes
            const nonChangable: any = ['conversations'];
            /* console.log(event.url)
            let a = event.url;
            a = a.split("/");
            let found = a.some(r => nonChangable.includes(r)); */
            // todo: Fix issue when going from conversations/ to conversation-list
            // if (!found) {
            this.search.reset();
            // }
        });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.routeSubscripion.unsubscribe();
    }

    // Logout function
    logout(): void {
        // Delete all items in local storage
        localStorage.clear();
        this.loginService.logout();
        this.socket.disconnect();
        // Go to login page
        this.router.navigate([environment.dashboardPrefix + '/login']);
    }

    // Call list notification api
    initializeResultList(args = { limit: 10, skip: 0 }): void {
        this.msgCenterService.listNotifications(args).subscribe(response => {
            this.spinner.hide();
            this.count = response.count;
            this.total = response.totalCount;
            // Sort notification based on date
            this.notifications = response.info.sort((a: any, b: any) =>
                new Date(b.modified_on).getTime() - new Date(a.modified_on).getTime()
            );
            this.resultList = this.resultList.concat(this.notifications);
            this.pagination.noOfPages = Math.ceil(this.total / this.pagination.pageSize);
            this.notificationSpinner = response.totalCount > 10;
        });

    }

    // More data through pagination
    loadMoreCourses(): void {
        if (this.pagination.currentPage >= this.pagination.noOfPages) {
            return;
        }
        this.notificationSpinner = true;
        const args = {
            limit: this.pagination.pageSize,
            skip: this.pagination.currentPage * this.pagination.pageSize
        };
        this.pagination.currentPage++;
        this.initializeResultList(args);
    }

    notificationRead(notification): void {
        const argsRead = { notification_id: notification.id };
        const argsDetails = {
            category: notification.category,
            categoryId: notification.categoryId,
            id: notification.id,
            userId: notification.userId
        };
        this.msgCenterService.readNotification(argsRead).subscribe(response => {
            if (response) {
                this.resultList = [];
                this.initializeResultList();
            }
        });
        this.msgCenterService.detailsNotification(argsDetails).subscribe(response => {
            if (response) {
                switch (response.type) {
                    case 'engageUser':
                        this.homeService.setNotification({
                            type: response.type,
                            info: response.info
                        });
                        this.router.navigate([environment.dashboardPrefix + '/conversations']);
                        break;
                    case 'addIntent':
                        this.homeService.setNotification({
                            type: response.type,
                            info: response.info[0]
                        });
                        this.router.navigate([environment.dashboardPrefix + '/intents']);
                        break;
                    case 'addEntity':
                        this.homeService.setNotification({
                            type: response.type,
                            info: response.info[0]
                        });
                        this.router.navigate([environment.dashboardPrefix + '/objects']);
                        break;
                    case 'addQuestion':
                        this.homeService.setNotification({
                            type: response.type,
                            info: response.info[0]
                        });
                        this.router.navigate([environment.dashboardPrefix + '/questions']);
                        break;
                }
            }
        }, err => {
            console.log(err.error);
            const error = err.error && err.error.info ? err.error.info : 'Sorry, something went wrong';
            this.toastr.error('', error);
        });
    }

    countUpdate(): void {
        this.msgCenterService.updateSeenNotification({ count: 0 }).subscribe(() => {
            this.count = 0;
        });
    }

    getNotification(notification) {
        console.log('On component ', notification);
        this.count++;
        this.resultList.unshift(notification);
        if (notification.category === 'engageUser') {
            this.headerNotifications.push(notification);
            this.headerNotifications.sort((a, b) => {
                const first: any = new Date(b.modified_on);
                const second: any = new Date(a.modified_on);
                return first - second;
            });
            this.headerNotifications = _.uniqBy(this.headerNotifications, 'userId');

            const a = {
                disableTimeOut: true,
                positionClass: 'nav-toast-container',
                //toastClass: 'nav-toast',
                //titleClass: 'nav-toast-title',
                closeButton: true
            };

            let aa = [];
            this.headerNotifications.forEach((item, index) => {
                aa[index] = this.toastr.warning(item.userName, `Room No. ${item.roomNo}`, a);
                aa[index].onHidden.subscribe(data => {
                    console.log('hidden', index, data, aa[index]);
                    _.remove(this.headerNotifications, { id: aa[index].message });
                })
                aa[index].onTap.subscribe(data => {
                    const notification = _.find(this.headerNotifications, { userName: aa[index].message });
                    if (notification) {
                        this.notificationRead(notification);
                    }
                    console.log('onTap', index, data, aa[index]);
                })
            });

        }
    }



}
