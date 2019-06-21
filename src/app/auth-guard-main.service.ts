import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardMainService {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (environment.dashboardPrefix === '/' + route.routeConfig.path) {
      return this.dashboardEnableCheck();
    }
  }

  dashboardEnableCheck() {
    console.log('1111111111111111111111111111111111111111')
    if (environment.dashboardEnabled) {
      console.log('1111111111111111111111111111111111111111')
      return true;
    }
    this.router.navigate(['/']);

  }

}
