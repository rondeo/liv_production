import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HomeService } from '../home.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../../login/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { SocketService } from '../socket.service';



@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    menuItems = [];
    dashboardPrefix = environment.dashboardPrefix;
    subscription: Subscription;
    sideBarWidth = '270px'
    userName = null;
    userType = null;

    constructor(private router: Router, private homeService: HomeService, private loginService: LoginService,private socket: SocketService) {
        this.subscription = this.homeService.getMessage().subscribe(data => {
            console.log("----sidebar---",data);
            if (data.type === 'sideBar') {
                this.sideBarWidth = data.message ? '270px' : '70px';
            }
        });
    }

    ngOnInit() {
        const userData = JSON.parse(localStorage.getItem('user'));
        this.menuItems = userData.roles.menu_tab;
        this.userName = userData.user_name;
        this.userType = userData.user_type;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

     // Logout function
     logout(): void {
        // Delete all items in local storage
        localStorage.clear();
        this.loginService.logout();
        this.socket.disconnect();
	window.location.reload(); 
        // Go to login page
        this.router.navigate([environment.dashboardPrefix + '/login']);
    }


}
