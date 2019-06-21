import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SmartContactComponent} from './smart-contact/smart-contact.component';
import {RegisterComponent} from './register/register.component';
import {RegisterSuccessComponent} from './register/register-success/register-success.component';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: 'smart-contact',
    component: SmartContactComponent,
    data: {title: 'Smart Contact'},
  },
  {
    path: 'smart-contact.html',
    component: SmartContactComponent,
    data: {title: 'Smart Contact'},
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: 'Register'},
  },
  {
    path: 'register/success',
    component: RegisterSuccessComponent,
    data: {title: 'Success'},
  },
  {path: '**', redirectTo: '/smart-contact.html', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {

}
