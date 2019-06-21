import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { catchError, tap } from 'rxjs/internal/operators';

import { DashboardService } from '../../dashboard.service';
import { EnvironmentService } from '../../../environment.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

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

    search(terms: Observable<any>,lang:any) {
       
        return terms.debounceTime(400)
          .distinctUntilChanged()
          .switchMap(term => this.searchEntries(term,lang));
      } 
   
      searchEntries(term,lang) {
        console.log("lang",localStorage.getItem('lang'));
        this.httpOptions.params =new HttpParams().set('search', term).set('language', localStorage.getItem('lang'));
        console.log("lang---",this.httpOptions.params);
        return this.http.get<any>(`${this.apiUrl}/dashboard/user_searchQA`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
            // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
            // catchError(this.handleError('listNotifications', this.err))
        );
      }

      listQuestions(args): Observable<any> {
          console.log("----params--",args);
          this.httpOptions.params = new HttpParams().set('category', args.category).set('limit', args.limit).set('skip', args.skip).set('language', args.language);
          return this.http.get<any>(`${this.apiUrl}/dashboard/questions/list`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
   
    searchQuestions(args:any,term:any): Observable<any> {
        
        this.httpOptions.params =new HttpParams().set('search', term).set('language', localStorage.getItem('lang'));
        return this.http.get<any>(`${this.apiUrl}/dashboard/user_searchQA`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                console.log(error);
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
	updateArticleid(args): Observable<any> {
        console.log("args",args);
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/question/update/article_id`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
    changePrimartQA(args): Observable<any> {
        console.log("args",args);
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/questions/set/primary`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }

    addVarientQAValidation(args): Observable<any> {
        console.log("args---",args);
        let argment = {
            sub_question : args
        }
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/question/check/duplicate`, argment, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
    addVarientQA(args): Observable<any> {
        console.log("args",args);
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/questions/add/sub_question`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
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
    questionHandle(args, handle): Observable<any> {
        console.log("---handle--",handle);
        console.log("---handleargs--",args);
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/questions/${handle}`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
    approveQuestion(args): Observable<any> {
        this.httpOptions.params = null;
        return this.http.post<any>(`${this.apiUrl}/dashboard/questions/approve`, args, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
    deleteQuestions(id): Observable<any> {
        this.httpOptions.params = new HttpParams().set('_id', id);
        return this.http.get<any>(`${this.apiUrl}/dashboard/questions/delete`, this.httpOptions).pipe(
            tap(),
            catchError((error) => {
                DashboardService.handleError(error);
                return of(error);
            })
        );
    }
    searchQA(args): Observable<object> {
        this.httpOptions.params =new HttpParams().set('search', args.data).set('language', args.language);
        return this.http.get<object>(`${this.apiUrl}/dashboard/user_searchQA`, this.httpOptions).pipe(
            // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
            // catchError(this.handleError('listNotifications', this.err))
        );
    }
}
