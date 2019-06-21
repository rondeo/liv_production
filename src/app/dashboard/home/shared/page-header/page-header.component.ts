import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  @Input() pageTitle;
  @Input() goBack: Boolean = false;
  dashboardPrefix = environment.dashboardPrefix;

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

}
