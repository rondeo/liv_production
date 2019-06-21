import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-menubar',
    templateUrl: './menubar.component.html',
    styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit, OnChanges {
    @Input() items;
    @Output() menuChange = new EventEmitter<any>();

    menu = [];

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.changeMenu(this.items);
    }

    changeMenu(items) {
        this.menu = items;
        const activeMenu = this.menu.find(item => item.active);
        if (activeMenu && activeMenu.name) {
            this.menuChange.emit(activeMenu.name);
        }
    }

    selectMenu(item) {
        this.menu.map(data => data.active = false);
        const element = this.menu.find(data => data.name === item.name);
        element.active = true;
        this.menuChange.emit(item.name);
    }


}
