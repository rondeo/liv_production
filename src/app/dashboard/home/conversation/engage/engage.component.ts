import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ConversationService } from '../conversation.service';

@Component({
    selector: 'app-engage',
    templateUrl: './engage.component.html',
    styleUrls: ['./engage.component.scss']
})
export class EngageComponent implements OnInit, OnChanges {

    @Input() messages = [];
    outputChat = {};

    constructor(private converstaionService: ConversationService) { }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
    }

    sendMessage(message, text) {
        console.log(message, text);
        const user = JSON.parse(localStorage.getItem('user'));
        const lastMessage = message.data.pop();

        const args = {
            'message_id': lastMessage.msgId,
            'message_content': text,
            'user_id': user.user_id
        }
        this.converstaionService.sendMessage(args).subscribe(response => {
            this.outputChat[lastMessage.id] = '';
        });
    }


}
