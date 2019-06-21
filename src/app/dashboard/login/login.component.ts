import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Login } from './login';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoaderService } from '../../loader/loader.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    user: Login = {
        username: '',
        password: '',
        browser_details: null
    };
    error: { message: string; status: boolean; } = {
        message: 'Sorry, Something went wrong.',
        status: false
    };

    constructor(private deviceService: DeviceDetectorService, private loginService: LoginService,
        private router: Router, private loader: LoaderService) {
    }

    ngOnInit() {
        this.setBrowserDetails();
        // Delete all items in local storage
        localStorage.clear();
    }

    sign_in(user: Login): void {
        this.loader.display(true);
        this.user = user;
        this.loginService.login(this.user).subscribe(data => {
            this.loader.display(false);
            this.error.status = false;
            if (data && data.success) {
                localStorage.setItem('user', JSON.stringify(data.user_data));
                const redirectUrl = this.loginService.redirectUrl ?
                    this.loginService.redirectUrl : environment.dashboardPrefix + data.user_data.roles.menu_tab[0].path;
                this.router.navigate([redirectUrl]);
            } else {
                this.error.status = true;
                this.error.message = data.message ? data.message : 'Sorry, Something went wrong.';
            }
        });
    }


    setBrowserDetails() {
        this.user.browser_details = this.deviceService.getDeviceInfo();
    }

}
