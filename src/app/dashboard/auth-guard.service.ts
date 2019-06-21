import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login/login.service';
import { filter } from 'rxjs/internal/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
    /*this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationStart)
    ).subscribe(x => {
      this.beforePreviousUrl = this.previousUrl;
      this.previousUrl = x['url'];
    });*/
  }

  previousUrl: string;
  beforePreviousUrl: string;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): boolean {
    if (this.loginService.isLoggedIn(url)) {
      return true;
    }

    const dashboardPrefix = environment.dashboardPrefix === '/' ? '' : environment.dashboardPrefix;

    if (url === dashboardPrefix + '/login') {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        const redirectUrl = this.beforePreviousUrl ? this.beforePreviousUrl : userData.roles.menu_tab[0].path;
        this.router.navigate([dashboardPrefix + redirectUrl]);
      } else {
        return true;
      }
    } else {
      // Store the attempted URL for redirecting
      this.loginService.redirectUrl = url;

      // Navigate to the login page with extras
      this.router.navigate([dashboardPrefix + '/login']);
    }

    return false;
  }
}
