import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { DropdownModule } from 'primeng/dropdown';
import { TagInputModule } from 'ngx-chips';
import { GoTopButtonModule } from 'ng2-go-top-button';

import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { MsgCenterComponent } from './home/navbar/msg-center/msg-center.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { OverviewComponent } from './home/overview/overview.component';
import { ConversationComponent } from './home/conversation/conversation.component';
import { AnalyticsComponent } from './home/analytics/analytics.component';
import { IntentsComponent } from './home/intents/intents.component';
import { ObjectsComponent } from './home/objects/objects.component';
import { QuestionComponent } from './home/question/question.component';
import { PageHeaderComponent } from './home/shared/page-header/page-header.component';
import { OverviewCardComponent } from './home/overview/overview-card/overview-card.component';
import { PanelComponent } from './home/shared/panel/panel.component';
import { MessageContainerComponent } from './home/overview/message-container/message-container.component';
import { DateRangePickerComponent } from './home/shared/date-range-picker/date-range-picker.component';
import { PieChartComponent } from './home/shared/pie-chart/pie-chart.component';
import { BarChartComponent } from './home/shared/bar-chart/bar-chart.component';
import { PaginationComponent } from './home/shared/pagination/pagination.component';
import { ListComponent } from './home/conversation/list/list.component';
import { MenubarComponent } from './home/shared/menubar/menubar.component';

import { DateToGoPipe } from '../date-to-go.pipe';
import { TruncatePipe } from '../truncate.pipe';
import { ArrayReversePipe } from '../array-reverse.pipe';
import { CardComponent } from './home/shared/card/card.component';
import { IntentSynonymComponent } from './home/intents/intent-synonym/intent-synonym.component';
import { PromptModalComponent } from './home/shared/prompt-modal/prompt-modal.component';
import { ObjectValuesComponent } from './home/objects/object-values/object-values.component';
import { ObjectSynonymComponent } from './home/objects/object-values/object-synonym/object-synonym.component';
import { ErrorComponent } from './error/error.component';
import { EngageComponent } from './home/conversation/engage/engage.component';
import { TriggerNotificationComponent } from './home/trigger-notification/trigger-notification.component';
import {
    
    MatInputModule,
    MatTabsModule,
  } from '@angular/material';
  import { UiSwitchModule } from 'ngx-toggle-switch';
  import { SelectDropDownModule } from 'ngx-select-dropdown';
import { RecentConversationComponent } from './home/recent-conversation/recent-conversation.component';
@NgModule({
    declarations: [
        DashboardComponent,
        LoginComponent,
        HomeComponent,
        NavbarComponent,
        MsgCenterComponent,
        SidebarComponent,
        OverviewComponent,
        ConversationComponent,
        AnalyticsComponent,
        IntentsComponent,
        ObjectsComponent,
        QuestionComponent,
        PageHeaderComponent,
        OverviewCardComponent,
        PanelComponent,
        MessageContainerComponent,
        TruncatePipe,
        DateToGoPipe,
        ArrayReversePipe,
        DateRangePickerComponent,
        PieChartComponent,
        BarChartComponent,
        PaginationComponent,
        ListComponent,
        MenubarComponent,
        CardComponent,
        IntentSynonymComponent,
        PromptModalComponent,
        ObjectValuesComponent,
        ObjectSynonymComponent,
        ErrorComponent,
        EngageComponent,
        TriggerNotificationComponent,
        RecentConversationComponent

    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DeviceDetectorModule.forRoot(),
        HttpClientModule,
        NgxSpinnerModule,
        NgbModule,
        UiSwitchModule,
        SelectDropDownModule,
        AppRoutingModule,
        InfiniteScrollModule,
        CommonModule,
        MatTabsModule,
        AmChartsModule,
        MatCardModule,
        BsDatepickerModule.forRoot(),
        ToastrModule.forRoot(),
        ToastContainerModule,
        DropdownModule,
        TagInputModule,
        GoTopButtonModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
    entryComponents: [
        PromptModalComponent
    ]
})
export class DashboardModule {
}
