import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from '../environment.service';


@Component({
    selector: 'app-smart-contact',
    templateUrl: './smart-contact.component.html',
    styleUrls: ['./smart-contact.component.scss']
})
export class SmartContactComponent implements OnInit {

    year = new Date().getFullYear();
    vCardFile;
    smartContactImage: {
        url: String,
        height: String,
        margin: String
    }[];



    constructor(private envService: EnvironmentService) {
    }

    ngOnInit() {
        this.vCardFile = `assets/vcard/${this.envService.read('vCardFile')}`;
        this.smartContactImage = this.envService.read('smartContactImage');
    }

}
