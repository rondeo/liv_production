import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

    statusText = 'Sorry, Something went wrong';
    @Output() setStatus = new EventEmitter<any>();

    constructor(private dashboardService: DashboardService, private toastr: ToastrService) { }

    ngOnInit() {
    }

    checkApi() {
        this.dashboardService.statusApi().subscribe(arg => {
            this.setStatus.emit(true);
        }, err => {
            this.toastr.error('', 'Sorry, something went wrong');
            console.log(err);
        })
    }
}
