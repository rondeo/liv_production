import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './home/overview/overview.component';
import { ConversationComponent } from './home/conversation/conversation.component';
import { ListComponent } from './home/conversation/list/list.component';
import { QuestionComponent } from './home/question/question.component';
import { AnalyticsComponent } from './home/analytics/analytics.component';
import { IntentsComponent } from './home/intents/intents.component';
import { IntentSynonymComponent } from './home/intents/intent-synonym/intent-synonym.component';
import { ObjectsComponent } from './home/objects/objects.component';
import { ObjectValuesComponent } from './home/objects/object-values/object-values.component';
import { ObjectSynonymComponent } from './home/objects/object-values/object-synonym/object-synonym.component';
import { TriggerNotificationComponent } from './home/trigger-notification/trigger-notification.component';

import { AuthGuardService } from './auth-guard.service';
import { AuthGuardMainService } from '../auth-guard-main.service';
import { environment } from '../../environments/environment';
import {RecentConversationComponent} from './home/recent-conversation/recent-conversation.component';

const routes: Routes = [
    {
        //path: environment.dashboardPrefix.replace('/', ''),
        // https://github.com/angular/angular/issues/18662
        // Path can only use variables that are only exported (Not modified after import)
        path: environment.dashboardRoute,
        component: DashboardComponent,
        canActivate: [AuthGuardMainService],
        canActivateChild: [AuthGuardService],
        children: [
            {
                path: '',
                component: HomeComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'overviews',
                        pathMatch: 'full'
                    },
                    { path: 'overviews', component: OverviewComponent, data: { title: 'Overview' } },
                    { path: 'conversations', component: ConversationComponent, data: { title: 'Conversations' } },
                   //{ path: 'conversationalelements', component: ConversationComponent, data: { title: 'Content Elements' } },
                   {path: 'history', component: RecentConversationComponent, data: {title: 'Conversations'}},

                   { path: 'conversations/:id', component: ListComponent, data: { title: 'Conversations' } },
                    { path: 'conversationalelements', component: QuestionComponent, data: { title: 'Question & Answers' } },
                    { path: 'qustions', component: QuestionComponent, data: { title: 'Question & Answers' } },
                    { path: 'analytics', component: AnalyticsComponent, data: { title: 'Analytics' } },
                    { path: 'intents', component: IntentsComponent, data: { title: 'Intents' } },
                    { path: 'intents/:id', component: IntentSynonymComponent, data: { title: 'Intents' } },
                    { path: 'objects', component: ObjectsComponent, data: { title: 'Objects' } },
                    { path: 'objects/:id', component: ObjectValuesComponent, data: { title: 'Objects' } },
                    { path: 'objects/:id/:synonym', component: ObjectSynonymComponent, data: { title: 'Objects' } },
                    { path: 'notifications', component: TriggerNotificationComponent, data: { title: 'Trigger Notifications' } }
                ]
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { title: 'Login' },
            },
            {
                path: '**',
                redirectTo: `${environment.dashboardPrefix}/overviews`,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
