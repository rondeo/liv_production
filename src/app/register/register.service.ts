import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '../environment.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  apiUrl: String;
  httpOptions: any;

  constructor(private http: HttpClient, private envService: EnvironmentService) {
    this.apiUrl = this.envService.read('apiUrl');
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'auth': this.envService.read('Authorization')
      })
    };
  }

  getIp(): Observable<any> {
    return this.http.get('https://ipinfo.io');
  }


  listRooms(args): Observable<any> {
    this.httpOptions.params = new HttpParams().set('sandbox', args.sandbox);
    return this.http.get<any>(`${this.apiUrl}/v1/room/list`, this.httpOptions);
  }

  unAllocateRoom(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/v1/room/unallocate`, args, this.httpOptions);
  }

  roomUserList(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/v1/room/users/list`, args, this.httpOptions);
  }

  guestRegister(args): Observable<any> {
    this.httpOptions.params = null;
    return this.http.post<any>(`${this.apiUrl}/v1/guest/register`, args, this.httpOptions);
  }

}
