import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/internal/operators';

import { DashboardService } from '../../dashboard.service';
import { EnvironmentService } from '../../../environment.service';

@Injectable({
    providedIn: 'root'
})
export class TriggerNotificationService {

    apiUrl: String;
    httpOptions: any;

    constructor(private http: HttpClient, private envService: EnvironmentService) {
        this.apiUrl = this.envService.read('apiUrl');
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'auth': this.envService.read('Authorization'),
                'Authorization': 'Basic ' + btoa(`${this.envService.read('Authorization')}:`)
            })
        };
    }


    listConnections(): Observable<any> {
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/v1/connection/list`, {}, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    notify(data): Observable<any> {
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/v1/notification`, data, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

}
