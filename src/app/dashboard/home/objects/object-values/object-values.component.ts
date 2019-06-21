import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectService } from '../object.service';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromptModalComponent } from '../../shared/prompt-modal/prompt-modal.component';

@Component({
  selector: 'app-object-values',
  templateUrl: './object-values.component.html',
  styleUrls: ['./object-values.component.scss']
})
export class ObjectValuesComponent implements OnInit {
  object: String = '';
  values: Array<any> = [];
  paramValue = 'watson';
  userType: String;
  newButton = false;
  sideBar = false;
  value = {
    value_name: '',
    synonyms: [],
    add: false,
    update: false,
    value_id: '',
    _id: ''
  };

  constructor(private route: ActivatedRoute, private objectService: ObjectService,
    private router: Router, private toastr: ToastrService, private modalService: NgbModal) {
    this.route.queryParams.subscribe(params => {
      this.paramValue = params.type;
    });

  }

  ngOnInit() {
    this.userType = JSON.parse(localStorage.getItem('user')).user_type;
    this.initPage();
  }

  initPage() {
    const entity = this.route.snapshot.paramMap.get('id');
    let args;
    if (this.paramValue === 'watson') {
      args = { entity };
      this.newButton = false;
      this.objectService.handleObject('values', args).subscribe(data => {
        this.object = entity;
        this.values = data.values;
      }, err => {
        this.router.navigate([`/${environment.dashboardPrefix}/objects`]);
        console.log('object values err', err);
      });
    } else {
      args = { _id: entity };
      this.newButton = true;
      this.objectService.handleObject('details', args).subscribe(data => {
        this.object = data.info.entity_name;
        this.values = data.info.entity_values;
      }, err => {
        this.router.navigate([`/${environment.dashboardPrefix}/objects`]);
        console.log('object values err', err);
      });
    }

  }

  objectAction(action) {
    console.log(action);
    const entity = this.route.snapshot.paramMap.get('id');
    const entityValue = action.item.entity_value_id ? action.item.entity_value_id : action.item.value;
    switch (action.activity) {
      case 'Open':
        this.router.navigate([`/${environment.dashboardPrefix}/objects/${entity}/${entityValue}`],
          { preserveQueryParams: true });
        break;
      case 'Edit':
        this.value = {
          value_name: action.item.entity_value_name,
          synonyms: action.item.synonyms,
          add: false,
          update: true,
          value_id: entityValue,
          _id: entity
        };
        this.sideBar = true;
        this.newButton = false;

        break;
      case 'Delete':
        this.modalService.open(PromptModalComponent, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
          if (result === 'Yes') {
            const args = {
              _id: entity,
              value_id: entityValue
            };
            this.objectService.customEntityValueDelete(args).subscribe(data => {
              if (data.status === 200) {
                this.toastr.info('', data.info);
                this.initPage();
                this.sideBar = false;
                this.newButton = true;
              } else {
                this.toastr.error('', data.info);
              }
            }, err => {
              console.log('delete value error', err);
              this.toastr.error('', 'Sorry, something went wrong.');
            });
          }
        }, (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        break;

    }
  }

  addNewObject() {
    this.sideBar = true;
    this.newButton = false;
    this.value = {
      value_name: '',
      synonyms: [],
      add: true,
      update: false,
      value_id: '',
      _id: ''
    };
  }

  cancelValue() {
    this.sideBar = false;
    this.newButton = true;
    this.value = {
      value_name: '',
      synonyms: [],
      add: false,
      update: false,
      value_id: '',
      _id: ''
    };

  }

  updateValue(value) {
    const args = value;

    const synonyms = args.synonyms.map(item => {
      return { synonym_name: item.synonym_name };
    });
    console.log(synonyms);
    args.synonyms = synonyms;
    this.objectService.customEntityValueUpdate(args).subscribe(data => {
      if (data.status === 200) {
        this.toastr.info('', data.info);
      } else {
        this.toastr.error('', data.info);
      }
      this.initPage();
      this.sideBar = false;
      this.newButton = true;
    }, err => {
      console.log('updateValue error', err);
      this.toastr.error('', 'Sorry, something went wrong.');
    });
  }

  addValue(value) {
    const synonyms = value.synonyms.map(item => {
      return { synonym_name: item.synonym_name };
    });
    const args = {
      _id: this.route.snapshot.paramMap.get('id'),
      entity_values: {
        entity_value_name: value.value_name,
        synonyms: synonyms
      }
    };
    this.objectService.enitityValuesAdd(args).subscribe(data => {
      if (data.status === 200) {
        this.toastr.info('', data.info);
      } else {
        this.toastr.error('', data.info);
      }
      this.initPage();
      this.sideBar = false;
      this.newButton = true;
    }, err => {
      console.log('updateValue error', err);
      this.toastr.error('', 'Sorry, something went wrong.');
    });

  }


}
