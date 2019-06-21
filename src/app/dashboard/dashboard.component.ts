import {Component, HostBinding, OnInit} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {DashboardService} from './dashboard.service';
import {WebNotificationService} from '../web-notification.service';

import {slideInDownAnimation} from './home/animations';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [slideInDownAnimation]
})
export class DashboardComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  // @HostBinding('style.display') display = 'block';
  // @HostBinding('style.position') position = 'absolute';

  apiStatus: Boolean = true;

  constructor(private dashboardService: DashboardService, private webNotification: WebNotificationService) {
  }

  ngOnInit(): void {
    this.dashboardService.statusApi().subscribe(arg => {
      
      this.apiStatus = true;
    }, error => {
      
      this.apiStatus = false;
    });
    this.webNotification.requestPermission();
  }

  statusSet(data) {
    this.apiStatus = true;
  }

}
