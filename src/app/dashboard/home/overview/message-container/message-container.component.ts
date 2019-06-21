import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit {

  @Input() message;
  @Input() index;

  constructor() {
  }

  ngOnInit() {
  }

}
