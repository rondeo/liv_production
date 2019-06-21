import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { tap, catchError } from 'rxjs/internal/operators';

import { DashboardService } from '../../dashboard.service';
import { EnvironmentService } from '../../../environment.service';


@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    apiUrl: String;
    httpOptions: any;

    constructor(private http: HttpClient, private envService: EnvironmentService) {
        const userData = JSON.parse(localStorage.getItem('user'));
        this.apiUrl = this.envService.read('apiUrl');
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': this.envService.read('Authorization'),
                'access-token': userData.token
            })
        };

    }


    graphs(fromDate, toDate): Observable<any> {
        this.httpOptions.params = new HttpParams().set('fromdate', fromDate).set('todate', toDate);
        return this.http.get<any>(`${this.apiUrl}/dashboard/messages/graphs`,
            this.httpOptions).pipe(
                tap(),
                catchError((error) => {
                    // intercept the respons error and displace it to the console
                    DashboardService.handleError(error);
                    return of(error);
                })
            );
    }
}
