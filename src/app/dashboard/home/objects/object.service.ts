import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/internal/operators';

import { EnvironmentService } from '../../../environment.service';
import { DashboardService } from '../../dashboard.service';


@Injectable({
    providedIn: 'root'
})
export class ObjectService {
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

    listAssignees(): Observable<any> {
        this.httpOptions.params = null;
        return this.http.get<any>(`${this.apiUrl}/dashboard/assignees/list`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    getObjects(): Observable<any> {
        this.httpOptions.params = null;
        return this.http.get<any>(`${this.apiUrl}/dashboard/entity`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    getCustomizedObjects(args): Observable<any> {
        this.httpOptions.params = new HttpParams().set('approve', args.approve).set('limit', args.limit).set('skip', args.skip);
        return this.http.get<any>(`${this.apiUrl}/dashboard/entity/customized_entity`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    handleObject(handle, args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/entity/${handle}`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    getObjectSynonym(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/entity/values/synonyms`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    getCustomizedObjectsSynonym(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/custom/entity/synonyms`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    customEntityValueUpdate(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/custom/entity/value/update`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    enitityValuesAdd(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/entity/values/add`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    customEntityValueDelete(args): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/dashboard/custom/entity/value/delete`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }



}
