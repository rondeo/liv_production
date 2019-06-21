import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomeService } from './home.service';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
    leftMargin = '270px';
    subscription: Subscription;

    constructor(private homeService: HomeService, private socket: SocketService) {
        this.subscription = this.homeService.getMessage().subscribe(data => {
            if (data.type === 'sideBar') {
                this.leftMargin = data.message ? '270px' : '70px';
            }
        });
    }

    ngOnInit() {
        this.socket.connect();
    }

    onActivate(event) {
        const scrollToTop = window.setInterval(() => {
            const pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 20); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 16);
    }
}
