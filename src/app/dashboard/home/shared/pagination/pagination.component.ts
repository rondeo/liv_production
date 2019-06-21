import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

    @Input() page;
    @Input() disabled = false;
    @Input() collectionSize;
    @Input() noPerPage = 10;
    @Input() maxSize: Number = 3;
    @Output() pageChange = new EventEmitter<any>();
    @Input() type = null // Specifies type if multiple pagination is used in same component;



    constructor() { }

    ngOnInit() {
    }

    pageChanged() {
        if (this.type) {
            this.pageChange.emit({
                page: this.page,
                type: this.type
            });
        } else {
            this.pageChange.emit(this.page);
        }
    }

}
