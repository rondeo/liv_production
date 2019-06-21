import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  countryCode = '';

  getIp(): Observable<any> {
    return this.http.get('https://ipinfo.io');
  }

}
