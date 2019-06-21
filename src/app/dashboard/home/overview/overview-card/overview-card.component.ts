import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss']
})


export class OverviewCardComponent implements OnInit {

  @Input() type;
  @Input() value;

  chooseType: { name: string, className: string, iClass: string, value: string, route: string };
  types: Array<{ name: string, className: string, iClass: string, value: string, route: string }> = [
    {
      name: 'intent',
      className: 'overview-card-intent',
      iClass: 'fa fa-outdent',
      value: 'Intents',
      route: environment.dashboardPrefix + '/intents'
    },
    {
      name: 'object',
      className: 'overview-card-things',
      iClass: 'fa fa-list-ul',
      value: 'Objects',
      route: environment.dashboardPrefix + '/objects'
    },
    {
      name: 'conversation',
      className: 'overview-card-conversation',
      iClass: 'fa fa-comment',
      value: 'Conversations',
      route: environment.dashboardPrefix + '/conversations'
    }
  ];


  constructor() {
  }

  ngOnInit() {
    this.chooseType = _.find(this.types, {name: this.type});
  }

}
