import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntentsService } from './intents.service';
import { Observable, forkJoin } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromptModalComponent } from '../shared/prompt-modal/prompt-modal.component';
import { HomeService } from '../home.service';


@Component({
    selector: 'app-intents',
    templateUrl: './intents.component.html',
    styleUrls: ['./intents.component.scss']
})
export class IntentsComponent implements OnInit, OnDestroy {

    menuItems = [];

    suffix: String = '';
    value: String = '';
    mainItems = [];
    assignees = [];
    newButton: Boolean = true; // Button on bottom to add new Intent
    sideBar: Boolean = false; // Button on bottom to add new Intent
    intent = {
        name: '',
        description: '',
        examples: [],
        disable: false,
        add: false,
        update: false,
        reject: false,
        comment: ''
    };
    userType: String;
    navigationSubscription;
    obtainEvent;
    types: any = [
        { value: 'pending', name: 'Pending Intents' },
        { value: 'approved', name: 'Approved Intents' },
        { value: 'rejected', name: 'Rejected Intents' }
    ];
    goBack: Boolean = false;

    // Pagination
    page = {
        pending: 1,
        approved: 1,
        rejected: 1
    };
    paginationDisabled = false;


    constructor(private intentService: IntentsService, private router: Router, private toastr: ToastrService,
        private modalService: NgbModal, private homeService: HomeService) {
    }



    ngOnInit() {
        if (this.obtainEvent && this.obtainEvent.type === 'addIntent') {
            this.obtainEventHandle();
        } else {
            this.setMenu('Watson Intents');
        }
        this.setNavigationSubscription();
        this.intentService.listAssignees().subscribe(asignData => {
            if (asignData.status === 200) {
                this.assignees = asignData.info;
                this.assignees.map(item => delete item.notification_count);
            }
        });
        this.userType = JSON.parse(localStorage.getItem('user')).user_type;
    }

    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we
        // don't then we will continue to run our initialiseInvites()
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    initialiseInvites() {
        console.log('homeService', this.homeService.getNotification());
        const returnValue = this.homeService.getNotification();
        this.homeService.setNotification(null);
        return returnValue;
    }

    setNavigationSubscription() {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.obtainEvent = this.initialiseInvites();
                if (this.obtainEvent && this.obtainEvent.type === 'addIntent') {
                    this.obtainEventHandle();
                }
            }
        });
    }

    obtainEventHandle() {
        this.mainItems = [];
        this.menuItems = [];
        let heading = this.obtainEvent.info.approve_status;
        heading = this.types.find(item => item.value === heading);
        if (heading.value === 'approved' || heading.value === 'rejected') {
            delete this.obtainEvent.info.permissions;
        }
        this.mainItems.push({
            intents: [this.obtainEvent.info],
            heading,
            count: 1
        });
        this.suffix = '';
        this.value = '';
        this.sideBar = false;
        this.goBack = true;
    }

    handleGoBack() {
        this.goBack = false;
        this.menuItems = [
            { name: 'Watson Intents', active: false },
            { name: 'Customized Intents', active: true }
        ];
    }

    setMenu(menu) {
        this.menuItems = [
            { name: 'Watson Intents', active: false },
            { name: 'Customized Intents', active: false }
        ];
        const menuData = this.menuItems.find(data => data.name === menu);
        menuData.active = true;
        this.goBack = false;
    }


    changeMenu(value) {
        this.menuItems.map(menu => {
            menu.active = false;
        });
        this.page = {
            pending: 1,
            approved: 1,
            rejected: 1
        };
        const menuData = this.menuItems.find(menu => menu.name === value);
        menuData.active = true;

        this.suffix = '';
        this.value = value;
        this.mainItems = [];
        this.sideBar = false;
        if (value === 'Watson Intents') {
            this.newButton = true;
            this.intentService.getIntents().subscribe(data => {
                if (data.intents) {
                    data.intents.map(item => item.permissions = [{ name: 'View', action: 'viewIntent' }]);
                    this.mainItems.push({
                        intents: data.intents,
                        heading: '',
                        count: 0 // No pagination for watson intents
                    });
                    this.suffix = ` (${data.intents.length})`;
                }
            });
        } else if (value === 'Customized Intents') {
            this.newButton = false;
            let args;
            args = {
                limit: 9,
                skip: 0
            };
            const types = this.types;
            const observables: Observable<any>[] = [];

            types.forEach(item => {
                args.approve = item.value;
                observables.push(this.intentService.getCustomizedIntents(args));
            });
            forkJoin(observables).subscribe(results => {
                this.suffix = '';
                results.forEach((item, index) => {
                    if (item.info.length) {
                        if (types[index].value === 'approved' || types[index].value === 'rejected') {
                            item.info.map(permission => delete permission.permissions);
                        }
                        item.info.map(permission => permission.status = types[index].value);
                        this.mainItems.push({
                            intents: item.info,
                            heading: types[index],
                            count: item.count
                        });
                    }
                });
            });
        }
    }

    addNewIntent() {
        this.newButton = false;
        this.sideBar = true;
        this.intent = {
            name: '',
            description: '',
            examples: [],
            disable: false,
            add: true,
            update: false,
            reject: false,
            comment: ''
        };
    }

    cancelIntent() {
        this.intent = {
            name: '',
            description: '',
            examples: [],
            disable: false,
            add: false,
            update: false,
            reject: false,
            comment: ''
        };
        this.newButton = this.value === 'Watson Intents' ? true : false;
        this.sideBar = false;
    }

    listSynonyms(intent) {
        this.router.navigate([`/${environment.dashboardPrefix}/intents/${intent}`]);
    }

    intentAction(action) {
        let args;
        switch (action.activity) {
            case 'View':
            case 'Open':
                if (this.value === 'Watson Intents') {
                    this.listSynonyms(action.item.intent);
                } else {
                    args = { intent_id: action.item._id };
                    this.intentService.handleIntent('details', args).subscribe(data => {
                        this.sideBar = true;
                        const intent = data.info;
                        intent.name = data.info.intent_name;
                        intent.examples = data.info.user_examples;
                        intent.disable = true;
                        this.intent = intent;
                    });
                }
                break;
            case 'Edit':
                args = { intent_id: action.item._id };
                this.intentService.handleIntent('details', args).subscribe(data => {
                    this.sideBar = true;
                    const intent = data.info;
                    intent.name = data.info.intent_name;
                    intent.examples = data.info.user_examples;
                    intent.disable = false;
                    intent.update = true;
                    this.intent = intent;
                });
                break;
            case 'Delete':
                this.modalService.open(PromptModalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
                    if (result === 'Yes') {
                        args = { _id: action.item._id };
                        this.intentService.handleIntent('delete', args).subscribe(data => {
                            if (data.status === 200) {
                                this.toastr.info('', data.info);
                                this.setMenu('Customized Intents');
                            } else {
                                this.toastr.error('', data.info);
                            }
                        }, err => {
                            console.log('delete intent error', err);
                            this.toastr.error('', 'Sorry, something went wrong.');
                        });
                    }
                }, (reason) => {
                    // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
                break;
            case 'Approve':
                args = { _id: action.item._id };
                this.intentService.handleIntent('approve', args).subscribe(data => {
                    if (data.status === 200) {
                        this.toastr.info('', data.info);
                        this.setMenu('Customized Intents');
                    } else {
                        this.toastr.error('', data.info);
                    }
                }, err => {
                    console.log('approve error', err);
                    this.toastr.error('', 'Sorry, something went wrong.');
                });
                break;
            case 'Decline':
                args = { intent_id: action.item._id };
                this.intentService.handleIntent('details', args).subscribe(data => {
                    this.sideBar = true;
                    const intent = data.info;
                    intent.reject = true;
                    this.intent = intent;
                });
                break;
        }
    }

    createIntent(intent) {
        const args = {
            'intent_name': intent.name,
            'description': intent.description,
            'user_examples': intent.examples.map(item => { delete item._id; return item; })
        };
        this.intentService.handleIntent('create', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Intents');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('createIntent error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });
    }

    updateIntent(intent) {
        const args = {
            '_id': intent._id,
            'intent_name': intent.name,
            'description': intent.description,
            'user_examples': intent.examples.map(item => { delete item._id; return item; })
        };
        this.intentService.handleIntent('update', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Intents');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('update error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });
    }

    rejectIntent(intent: any) {
        const args = {
            comment: intent.comment,
            _id: intent._id
        };
        this.intentService.handleIntent('reject', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Intents');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('reject error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });

    }

    changeAssignee(assignee) {
        const args = {
            assign_to: assignee.assigned_to._id,
            _id: assignee._id
        };
        this.intentService.handleIntent('assign', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Intents');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('assign error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });

    }

    pageChanged(data) {
        this.page[data.type] = data.page;
        console.log('change page', data);
        const args = {
            limit: 9,
            skip: 9 * (data.page - 1),
            approve: data.type
        };
        this.intentService.getCustomizedIntents(args).subscribe(results => {
            const newData = this.mainItems.find(item => item.heading.value === data.type);
            if (data.type === 'approved' || data.type === 'rejected') {
                results.info.map(resp => { delete resp.permissions });
            }
            newData.intents = results.info;
        });
    }

}
