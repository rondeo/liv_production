import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';

import {EnvironmentService} from '../../../environment.service';
import {DashboardService} from '../../dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class RecentConversationService {
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
//   messageList(args): Observable<any> {
//     this.httpOptions.params = new HttpParams().set('limit', args.limit).set('skip', args.skip);
//     return this.http.get<any>(`${this.apiUrl}/dashboard/user/messages`,
//     this.httpOptions).pipe(
//             tap(),
//             catchError((error) => {
//                 DashboardService.handleError(error);
//                 return of(error);
//             })
//         );
// }

sessionMessages(args): Observable<any> {
  this.httpOptions.params = null;
  return this.http.post<any>(`${this.apiUrl}/dashboard/conversation/session/list`,args,
      this.httpOptions).pipe(
          tap(),
          catchError((error) => {
              DashboardService.handleError(error);
              return of(error);
          })
      );
}
  userMessages(args): Observable<any> {
    this.httpOptions.params = new HttpParams().set('filter', args.filter)
      .set('limit', args.limit).set('skip', args.skip).set('recordcount',args.recordcount).set('startDate',args.startDate)
      .set('endDate',args.endDate);

      console.log("---this.httpOptions---",this.httpOptions);
    return this.http.get<any>(`${this.apiUrl}/dashboard/user/messages`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }
  historySearch(args): Observable<any> {
    console.log("--argobj---",args);
    this.httpOptions.params = new HttpParams()
      .set('limit', args.limit)
      .set('skip', args.skip)
      .set('search',args.search)
      .set('category',args.category)
    return this.http.get<any>(`${this.apiUrl}/dashboard/user_search`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  userMessagesList(args): Observable<any> {
    this.httpOptions.params = new HttpParams().set('filter', args.filter)
      .set('limit', args.limit).set('skip', args.skip).set('startDate',args.startDate).set('endDate',args.endDate);
    return this.http.get<any>(`${this.apiUrl}/user/messages/${args.id}`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }
 
  usersessionList(args): Observable<any> {
    this.httpOptions.params =null;
    return this.http.post<any>(`${this.apiUrl}/dashboard/conversation/session/${args.id}`,args,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }
  dashboardMessageList(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/dashboard/messages/list`, args,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );

  }

  messagesTitle(args: string): Observable<any> {
    this.httpOptions.params = null;
    return this.http.get<any>(`${this.apiUrl}/dashboard/user/messagesTitle/${args}`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  engagedUsers(engageId): Observable<any> {
    this.httpOptions.params = new HttpParams().set('engageId', engageId);
    return this.http.get<any>(`${this.apiUrl}/dashboard/engaged/users`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  engagerSetting(engageId): Observable<any> {
    this.httpOptions.params = new HttpParams().set('engagerId', engageId);
    return this.http.get<any>(`${this.apiUrl}/dashboard/engaged/users`,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  engagerChecking(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/dashboard/user/engage`, args,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  sendMessage(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/dashboard/user/send/response`, args,
      this.httpOptions).pipe(
      tap(),
      catchError((error) => {
        DashboardService.handleError(error);
        return of(error);
      })
    );
  }

  searchConversation(args): Observable<object> {
    this.httpOptions.params = null;
    return this.http.get<object>(`${this.apiUrl}/dashboard/user_search/?search=${args}`, this.httpOptions).pipe(
      // tap(data => this.log(`got data ${JSON.stringify(data)}`)),
      // catchError(this.handleError('listNotifications', this.err))
    );
  }
}
