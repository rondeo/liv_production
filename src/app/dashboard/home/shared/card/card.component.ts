import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() item;
  @Input() assignees = [];
  @Output() action = new EventEmitter<any>();
  @Output() assigneeChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  open(activity) {
    this.action.emit({ activity, item: this.item });
  }

  handleAssignee(item) {
    this.assigneeChange.emit(item);
  }

}
