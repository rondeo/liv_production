import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() toDate;
  @Input() fromDate;
  @Output() valueChange = new EventEmitter<Date[]>();

  bsRangeValue: Date[];

  constructor() {
  }

  ngOnInit() {
    this.bsRangeValue = [new Date(Date.parse(this.fromDate._d)), new Date(Date.parse(this.toDate._d))];
  }

  onValueChange(value: Date[]): void {
    this.valueChange.emit(value);
  }


}
