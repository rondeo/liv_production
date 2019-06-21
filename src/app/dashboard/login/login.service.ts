import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/internal/operators';
import { Login, LoginResponse } from './login';
import { environment } from '../../../environments/environment';
import { EnvironmentService } from '../../environment.service';

@Injectable({
    providedIn: 'root'
})


export class LoginService {

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    err = new LoginResponse();
    loginUrl;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    /*getStatus(): Observable<object> {
      return this.http.get(`${this.loginUrl}/status`).pipe(
        tap(data => this.log(`got data ${JSON.stringify(data)}`)),
        catchError(this.handleError('getStatus', []))
      );
    }*/

    login(user: Login): Observable<LoginResponse> {
        this.err = { success: false, message: 'Something went wrong', user_data: null };
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(user.username + ':' + user.password)}`
            })
        };
        return this.http.post<LoginResponse>(`${this.loginUrl}/dashboard/user/login`, user, this.httpOptions).pipe(
            // tap(data =>  this.isLoggedIn = true),
            tap(),
            catchError(this.handleError('login', this.err))
        );
    }

    logout(): void {
        // this.isLoggedIn = false;
    }

    isLoggedIn(url: string): boolean {
        const dashboardPrefix = environment.dashboardPrefix === '/' ? '' : environment.dashboardPrefix;
        if (url === dashboardPrefix + '/login') {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                return !userData && userData.user_name;
            } catch (e) {
                return true;
            }
        } else {
            const userData = JSON.parse(localStorage.getItem('user'));
            return !!userData && userData.user_name;
        }
    }

    constructor(private http: HttpClient, private envService: EnvironmentService) {
        this.loginUrl = this.envService.read('apiUrl');
    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error('error on operation', operation, error); // log to console instead

            // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

}
