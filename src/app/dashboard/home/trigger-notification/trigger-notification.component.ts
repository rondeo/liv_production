import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable, forkJoin } from 'rxjs';

import { devices, senders } from './trigger-notification';
import { TriggerNotificationService } from './trigger-notification.service';

@Component({
    selector: 'app-trigger-notification',
    templateUrl: './trigger-notification.component.html',
    styleUrls: ['./trigger-notification.component.scss']
})
export class TriggerNotificationComponent implements OnInit {

    devices = devices;
    connections: any = [];
    sending = {};

    constructor(private triggerNotificationService: TriggerNotificationService, private toastr: ToastrService) { }

    ngOnInit() {
        this.triggerNotificationService.listConnections().subscribe(response => {
            console.log('res', response);
            let connections = response.info ? response.info : [];

            const idArray = _.map(senders, 'id');
            connections = _.filter(connections, data => _.includes(idArray, data.phone_no));

            connections.forEach(data => {
                const a = _.find(senders, { id: data.phone_no });
                data.value = a.value;
                this.sending[data.phone_no] = true;
                this.connections.push(data);
            });

            this.connections = _.sortBy(this.connections, d => d.value);

        });

    }

    sendNotification(events, type): void {
        const senders = _.filter(this.connections, data => this.sending[data.phone_no] === true);
        if (senders.length > 0) {
            const observables: Observable<any>[] = [];
            senders.forEach(value => {
                const data = {
                    'uri': 'https://bosch-assist-api.unificationengine.com/v1/notification',
                    'data': {
                        'messagepreview': '{\"event\":\"' + events + '\",\"type\":\"Sensor\",\"appliance\":\"' + type + '\"}',
                        'connectionname': value.connection_name,
                        'uri': 'bosch://' + value.connection_name + '@dff4acaa-87b1-46ef-b9ce-16c3eecbc7ee/' +
                            'cc5fbfcd39d1b9d4df0ee764f8db6562c580666a',
                        'receiveraddress': value.phone_no,
                        'senderaddress': '4915792398561',
                        'attachmenttype': 'deviceEvent',
                        'attachment': {
                            'key': type,
                            'value': events,
                            'uri': 'bsh://deviceid@' + type
                        }
                    }
                };
                observables.push(this.triggerNotificationService.notify(data));
                forkJoin(observables).subscribe(results => {
                    this.toastr.info('', 'Notification has been sent successfully.');
                }, err => {
                    this.toastr.error('', 'Sorry, Something went wrong.');
                });
            });
        } else {
            this.toastr.error('', 'Please select a number.');
        }
    }

}
