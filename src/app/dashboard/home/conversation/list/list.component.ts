import { Component, OnInit } from '@angular/core';
import { ConversationService } from '../conversation.service';
import { ConversationComponent } from '../conversation.component';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../conversation.component.scss']
})
export class ListComponent implements OnInit {

  messageTitle: any;
  userId: string;
  conversations: Array<any> = [];
  // Pagination
  page = 1;
  totalCount = 0;
  paginationDisabled = false;


  constructor(private conversationService: ConversationService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.paginationDisabled = true;
    this.conversationService.messagesTitle(this.userId).subscribe(data => {
      this.paginationDisabled = false;
      this.messageTitle = data.info ? data.info : null;
      this.listMessages();
    });
  }

  listMessages(): void {
    const args = {
      filter: 'All',
      limit: 10,
      skip: (this.page * 10) - 10,
      id: this.userId
    };
    this.paginationDisabled = true;
    this.conversationService.userMessagesList(args).subscribe(response => {
      this.paginationDisabled = false;
      this.totalCount = response.info && response.info.totalCount ? response.info.totalCount : 0;

      this.conversations = _.filter(response.info, (value, key) => {
        return key !== 'totalCount';
      });
      console.log("this.conversations",this.conversations);
    });

  }

  applyFontIcon(channel): string[] {
    return ConversationComponent.applyFontIcon(channel);
  }
  applyTypeIcon(type): string[] {
    return ConversationComponent.applyTypeIcon(type);
  }

  pageChanged(page): void {
    this.page = page;
    this.listMessages();
  }


  /* heightTree(msgList) {
    let returnminheight;
    if (msgList.length >= 10) {

      returnminheight = {
        'min-height': (msgList.length * 198) + 'px'
      };

    } else if (msgList.length <= 5) {
      returnminheight = {
        'min-height': (msgList.length * 198) + 100 + 'px'
      };

      return returnminheight;
    } else {
      returnminheight = {
        'min-height': (msgList.length * 198) + 20 + 'px'
      };
    }
    return returnminheight;

  } */
}
