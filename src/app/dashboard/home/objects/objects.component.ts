import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObjectService } from './object.service';
import { Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromptModalComponent } from '../shared/prompt-modal/prompt-modal.component';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-objects',
    templateUrl: './objects.component.html',
    styleUrls: ['./objects.component.scss']
})
export class ObjectsComponent implements OnInit, OnDestroy {
    assignees = [];
    userType: String;
    menuItems = [];
    suffix: String = '';
    value: String = '';
    mainItems = [];
    sideBar = false;
    newButton = false;
    object = {
        name: '',
        description: '',
        disable: false,
        add: false,
        update: false,
        reject: false,
        comment: ''
    };
    navigationSubscription;
    obtainEvent;
    types: any = [
        { value: 'pending', name: 'Pending Objects' },
        { value: 'approved', name: 'Approved Objects' },
        { value: 'rejected', name: 'Rejected Objects' }
    ];

    goBack: Boolean = false;
    // Pagination
    page = {
        pending: 1,
        approved: 1,
        rejected: 1
    };
    paginationDisabled = false;

    constructor(private objectService: ObjectService, private toastr: ToastrService, private modalService: NgbModal,
        private router: Router, private homeService: HomeService) {
    }

    initialiseInvites() {
        console.log('homeService', this.homeService.getNotification());
        const returnValue = this.homeService.getNotification();
        this.homeService.setNotification(null);
        return returnValue;
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
            entities: [this.obtainEvent.info],
            heading: heading,
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
            { name: 'Watson Objects', active: false },
            { name: 'Customized Objects', active: true }
        ];
    }

    setMenu(menu) {
        this.menuItems = [
            { name: 'Watson Objects', active: false },
            { name: 'Customized Objects', active: false }
        ];
        const menuData = this.menuItems.find(data => data.name === menu);
        menuData.active = true;
    }

    ngOnInit() {
        console.log('this.obtainEvent', this.obtainEvent);
        if (this.obtainEvent && this.obtainEvent.type === 'addEntity') {
            this.obtainEventHandle();
        } else {
            const objectType = sessionStorage.getItem('objectType');
            sessionStorage.removeItem('objectType');
            if (objectType && objectType === 'custom') {
                this.menuItems = [
                    { name: 'Watson Objects', active: false },
                    { name: 'Customized Objects', active: true }
                ];
            } else {
                this.menuItems = [
                    { name: 'Watson Objects', active: true },
                    { name: 'Customized Objects', active: false }
                ];
            }
        }

        this.setNavigationSubscription();
        this.objectService.listAssignees().subscribe(asignData => {
            if (asignData.status === 200) {
                this.assignees = asignData.info;
                this.assignees.map(item => delete item.notification_count);
            }
        });
        this.userType = JSON.parse(localStorage.getItem('user')).user_type;
    }

    setNavigationSubscription() {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.obtainEvent = this.initialiseInvites();
                if (this.obtainEvent && this.obtainEvent.type === 'addEntity') {
                    this.obtainEventHandle();
                }
            }
        });
    }

    ngOnDestroy() {
        // avoid memory leaks here by cleaning up after ourselves. If we
        // don't then we will continue to run our initialiseInvites()
        // method on every navigationEnd event.
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
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
        if (value === 'Watson Objects') {
            this.newButton = true;
            this.objectService.getObjects().subscribe(data => {
                if (data.entities) {
                    // data.entities.map(item => item.permissions = [{ name: 'View', action: 'viewIntent' }]);
                    this.mainItems.push({
                        entities: data.entities,
                        heading: '',
                        count: 0 // No need for pagination
                    });
                    this.suffix = ` (${data.entities.length})`;
                }
            });
        } else if (value === 'Customized Objects') {
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
                observables.push(this.objectService.getCustomizedObjects(args));
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
                            entities: item.info,
                            heading: types[index],
                            count: item.count
                        });
                    }
                });
            });
        }
    }

    objectAction(action) {
        let args;
        switch (action.activity) {
            case 'View':
                if (this.value === 'Watson Objects') {
                    // this.listSynonyms(action.item.intent);
                } else {
                    args = { _id: action.item._id };
                    this.objectService.handleObject('details', args).subscribe(data => {
                        this.sideBar = true;
                        const object = data.info;
                        object.name = data.info.entity_name;
                        object.description = data.info.entity_description;
                        object.disable = true;
                        this.object = object;
                    });
                }
                break;
            case 'Edit':
                args = { _id: action.item._id };
                this.objectService.handleObject('details', args).subscribe(data => {
                    this.sideBar = true;
                    const object = data.info;
                    object.name = data.info.entity_name;
                    object.description = data.info.entity_description;
                    object.disable = false;
                    object.update = true;
                    this.object = object;
                });
                break;
            case 'Delete':
                this.modalService.open(PromptModalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
                    if (result === 'Yes') {
                        args = { _id: action.item._id };
                        this.objectService.handleObject('delete', args).subscribe(data => {
                            if (data.status === 200) {
                                this.toastr.info('', data.info);
                                this.setMenu('Customized Objects');
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
            case 'Open':
                const type = this.value === 'Watson Objects' ? 'watson' : 'custom';
                const dataParam = this.value === 'Watson Objects' ? action.item.entity : action.item._id;
                sessionStorage.setItem('objectType', type);
                this.router.navigate([`/${environment.dashboardPrefix}/objects/${dataParam}`], { queryParams: { type } });
                break;
            case 'Approve':
                args = { _id: action.item._id };
                this.objectService.handleObject('approve', args).subscribe(data => {
                    if (data.status === 200) {
                        this.toastr.info('', data.info);
                        this.setMenu('Customized Objects');
                    } else {
                        this.toastr.error('', data.info);
                    }
                }, err => {
                    console.log('approve error', err);
                    this.toastr.error('', 'Sorry, something went wrong.');
                });
                break;
            case 'Decline':
                args = { _id: action.item._id };
                this.objectService.handleObject('details', args).subscribe(data => {
                    this.sideBar = true;
                    const object = data.info;
                    object.reject = true;
                    this.object = object;
                });
                break;

        }
    }

    addNewObject() {
        this.newButton = false;
        this.sideBar = true;
        this.object = {
            name: '',
            description: '',
            disable: false,
            add: true,
            update: false,
            reject: false,
            comment: ''
        };

    }

    cancelObject() {
        this.object = {
            name: '',
            description: '',
            disable: false,
            add: false,
            update: false,
            reject: false,
            comment: ''
        };
        this.newButton = this.value === 'Watson Objects' ? true : false;
        this.sideBar = false;

    }

    createObject(object) {
        const args = {
            entity_name: object.name,
            entity_description: object.description
        };
        this.objectService.handleObject('create', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', 'Object created successfully.');
                this.setMenu('Customized Objects');
            } else {
                this.toastr.error('', 'Sorry, something went wrong.');
            }
        }, err => {
            console.log('createObject error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });

    }

    updateObject(object) {
        object.entity_name = object.name;
        object.entity_description = object.description;
        const args = object;
        this.objectService.handleObject('update', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Objects');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('update error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });
    }

    changeAssignee(assignee) {
        console.log(assignee);
        const args = {
            assign_to: assignee.assigned_to._id,
            _id: assignee._id
        };
        this.objectService.handleObject('assign', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Objects');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('changeAssignee error', err);
            this.toastr.error('', 'Sorry, something went wrong.');
        });
    }

    rejectObject(object: any) {
        const args = {
            comment: object.comment,
            _id: object._id
        };
        this.objectService.handleObject('reject', args).subscribe(data => {
            if (data.status === 200) {
                this.toastr.info('', data.info);
                this.setMenu('Customized Objects');
            } else {
                this.toastr.error('', data.info);
            }
        }, err => {
            console.log('reject error', err);
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
        this.objectService.getCustomizedObjects(args).subscribe(results => {
            const newData = this.mainItems.find(item => item.heading.value === data.type);
            if (data.type === 'approved' || data.type === 'rejected') {
                results.info.map(resp => { delete resp.permissions });
            }
            newData.entities = results.info;
        });
    }


}
