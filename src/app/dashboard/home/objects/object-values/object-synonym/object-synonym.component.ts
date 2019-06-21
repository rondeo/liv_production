import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectService } from '../../object.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-object-synonym',
  templateUrl: './object-synonym.component.html',
  styleUrls: ['./object-synonym.component.scss']
})
export class ObjectSynonymComponent implements OnInit {
  entity: String;
  paramValue: String = 'watson';
  synonym: String;
  synonyms: Array<any> = [];

  constructor(private route: ActivatedRoute, private objectService: ObjectService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.paramValue = params.type;
    });

  }

  ngOnInit() {
    const entity = this.route.snapshot.paramMap.get('id');
    const synonym = this.route.snapshot.paramMap.get('synonym');
    let args;
    if (this.paramValue === 'watson') {
      args = { entity, entity_value: synonym };
      this.objectService.getObjectSynonym(args).subscribe(data => {
        this.synonyms = data.synonyms;
        this.entity = entity;
        this.synonym = synonym;
      }, err => {
        this.router.navigate([`/${environment.dashboardPrefix}/objects/${this.entity}`]);
        console.log('object synonyms err', err);
      });
    } else {
      args = { _id: entity };
      this.objectService.handleObject('details', args).subscribe(object => {
        const arrayObjects = object.info.entity_values;
        const entityData = arrayObjects.find(item => item.entity_value_id === synonym);
        args = {
          _id: entity,
          value_id: synonym
        };
        this.objectService.getCustomizedObjectsSynonym(args).subscribe(data => {
          this.synonyms = data.info.synonyms;
          this.entity = entity;
          this.synonym = entityData.entity_value_name;
        }, err => {
          this.router.navigate([`/${environment.dashboardPrefix}/objects/${this.entity}`]);
          console.log('object synonyms err', err);
        });

      }, err => {
        this.router.navigate([`/${environment.dashboardPrefix}/objects/${this.entity}`]);
        console.log('object values err', err);
      });

    }

  }

}
