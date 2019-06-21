import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/index';
// import {catchError, tap} from 'rxjs/internal/operators';
import { EnvironmentService } from '../../../../environment.service';
import { NotificationDetailsResponse, NotificationListResponse } from './message-center';

@Injectable({
    providedIn: 'root'
})
export class MsgCenterService {

    apiUrl: String;
    token = JSON.parse(localStorage.getItem('user')).token;
    httpOptions: any;

    constructor(private http: HttpClient, private envService: EnvironmentService) {
        this.apiUrl = this.envService.read('apiUrl');
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.envService.read('Authorization'),
                'access-token': JSON.parse(localStorage.getItem('user')).token
            })
        };
    }


    listNotifications(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/notifications/list`,
            args, this.httpOptions).pipe(
                // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
                // catchError(this.handleError('listNotifications', this.err))
            );
    }

    readNotification(args): Observable<object> {
        return this.http.post<object>(`${this.apiUrl}/dashboard/notification/read`, args,
            this.httpOptions).pipe(
                // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
                // catchError(this.handleError('listNotifications', this.err))
            );
    }

    detailsNotification(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/notification/details`, args,
            this.httpOptions).pipe(
                // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
                // catchError(this.handleError('listNotifications', this.err))
            );
    }

    updateSeenNotification(args): Observable<object> {
        return this.http.post<object>(`${this.apiUrl}/dashboard/user/notification/update/seen`,
            args, this.httpOptions).pipe(
                // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
                // catchError(this.handleError('listNotifications', this.err))
            );
    }

}
