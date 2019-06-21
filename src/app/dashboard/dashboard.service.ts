import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { EnvironmentService } from '../environment.service';
import { catchError, tap } from 'rxjs/internal/operators';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    public static handleError(err: HttpErrorResponse): Observable<any> {
        // handle your auth error or rethrow
        if (err && err.status === 401) {
            return of(err.error);
        }
        throw err.error;
    }

    constructor(private http: HttpClient, private envService: EnvironmentService) {
    }

    statusApi() {
        const httpOptions = {
            params: new HttpParams().set('key', this.envService.read('statusKey'))
        };
        console.log('111111111111=>',httpOptions)
        return this.http.get<any>(`${this.envService.read('apiUrl')}/status`, httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

}
