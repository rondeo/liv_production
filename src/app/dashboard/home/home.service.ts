import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/index';


@Injectable({
    providedIn: 'root'
})
export class HomeService {

    notification;
    subject = new Subject<any>();

    public token;

    constructor() {
        const userData = JSON.parse(localStorage.getItem('user'));
        this.token = userData.token;
    }

    setNotification(val) {
        this.notification = val;
    }

    getNotification() {
        return this.notification;
    }

    sendMessage(message) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
