import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { EnvironmentService } from '../../environment.service';
import { Observable, Subject } from 'rxjs';

@Injectable({ 
    providedIn: 'root'
})
export class SocketService {

    url;
    socket;
    subject = new Subject<any>();

    constructor(private envService: EnvironmentService) {
        this.url = this.envService.read('apiUrl');

    }

    connect() {
        let userData: any = localStorage.getItem('user');
        userData = JSON.parse(userData);
        this.socket = io(this.url, {
            // reconnection: true,
            // path: '/socket.io',
            // transports: ['websocket'],
            // 'reconnection delay': 1000,
            // 'reconnection limit': 10000,
            // 'max reconnection attempts': 'Infinity',
            // 'force new connection': true,
            // //transports: ['websocket'],
            query: 'token=' + userData.token,
            // upgrade: false,
            // secure: true
        });
        this.socket.on('connect', () => {
            console.log('cconnect');
        });
        this.socket.on('disconnect', (disconnect) => {
            console.log('disconnect', disconnect);
        });
        this.socket.on('new_message', (message) => {
            console.log('message', message);
        });
    }

    disconnect() {
        this.socket.close();
    }

    getNotification(): Observable<any> {
        return Observable.create((observer) => {
            this.socket.on('new_notification', (notification) => {
                observer.next(notification);
            });
        });
    }

    getMessage(): Observable<any> {
        return Observable.create((observer) => {
            this.socket.on('new_message', (message) => {
                observer.next(message);
            });
        });
    }

    getRevenueUpdate(): Observable<any> {
        return Observable.create(observer => {
            this.socket.on('revenue-update', revenue => {
                observer.next(revenue);
            });
        });
    }
}
