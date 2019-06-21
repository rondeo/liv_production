import { Injectable } from '@angular/core';
import * as webNotification from 'simple-web-notification/web-notification';

@Injectable({
    providedIn: 'root'
})
export class WebNotificationService {

    constructor() { }


    requestPermission() {
        webNotification.requestPermission(granted => {
            if (granted) {
                console.log('Permission Granted.');
            } else {
                console.log('Permission Not Granted.');
            }
        });
    }

    showNotification(data) {
        webNotification.showNotification(data.title ? data.title : null, {
            body: data.body,
            icon: 'assets/images/favicon.png',
            onClick: function onNotificationClicked() {
                console.log('Notification clicked.');
            },
            autoClose: 10000
        }, (error, hide) => {
            if (error) {
                console.log('Unable to show notification: ' + error.message);
            } /* else {
                console.log('Notification Shown.');

                setTimeout(function hideNotification() {
                    console.log('Hiding notification....');
                    hide(); //manually close the notification (you can skip this if you use the autoClose option)
                }, 5000);
            } */
        });
    }

}
