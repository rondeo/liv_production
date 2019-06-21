import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    width: any; // width-true: Sidebar open, false - minimized

    constructor(private homeService: HomeService) {
    }

    ngOnInit() {
        let width: any = localStorage.getItem('sideBarOpen');
        width = width ? (width == 'true') : true;
        this.width = width;
        this.homeService.sendMessage({
            type: 'sideBar',
            message: this.width
        });
    }

    toogleWidth() {
        this.width = !this.width;
        localStorage.setItem('sideBarOpen', this.width.toString());
        this.homeService.sendMessage({
            type: 'sideBar',
            message: this.width
        });
    }

}
