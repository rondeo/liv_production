import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IntentsService } from '../intents.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-intent-synonym',
  templateUrl: './intent-synonym.component.html',
  styleUrls: ['./intent-synonym.component.scss']
})
export class IntentSynonymComponent implements OnInit {
  intent: String;
  intents: Array<any> = [];
  constructor(private route: ActivatedRoute, private intentService: IntentsService, private router: Router) { }

  ngOnInit() {
    this.intent = this.route.snapshot.paramMap.get('id');
    const args = { intent: this.intent };
    this.intentService.synonymIntents(args).subscribe(data => {
      this.intents = data.examples;
    }, err => {
      this.router.navigate([`/${environment.dashboardPrefix}/intents`]);
      console.log('intentSynonyms err', err);
    });
  }

}
