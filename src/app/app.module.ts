import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {
  MatFormFieldModule, MatSelectModule, MatButtonModule, MatDialogModule,
  MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


//import { AuthenticationModule } from './authentication/authentication.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { LoaderService } from './loader/loader.service';
import { TitleService } from './title.service';
import { ExceptionHandlerService } from './exception-handler.service';

import { AppComponent } from './app.component';
import { SmartContactComponent } from './smart-contact/smart-contact.component';
import { RegisterComponent } from './register/register.component';
import { LoaderComponent } from './loader/loader.component';
import { DialogOverviewComponent } from './register/dialog.component';

import { RegisterSuccessComponent } from './register/register-success/register-success.component';

@NgModule({
  declarations: [
    AppComponent,
    SmartContactComponent,
    RegisterComponent,
    DialogOverviewComponent,
    RegisterSuccessComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,

    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatButtonModule,
    DashboardModule,
    AppRoutingModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    InternationalPhoneModule,
    NgxMaterialTimepickerModule.forRoot()
  ],
  providers: [
    TitleService,
    LoaderService,
    { provide: ErrorHandler, useClass: ExceptionHandlerService }
  ],
  entryComponents: [DialogOverviewComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private titleService: TitleService) {
    this.titleService.init();
  }
}
