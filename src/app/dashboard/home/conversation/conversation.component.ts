import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConversationService } from './conversation.service';
import * as _ from 'lodash';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../socket.service';
import { HomeService } from '../home.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
    panelStyle = { 'box-shadow': '0 8px 22px 0 rgba(0, 0, 0, 0.12)' };

    totalMessageCount = 0;
    totalCount: Number = 0;
    conversations: Array<any> = [];
    topHeader: boolean = null;
    /** Engager */
    messages: Array<any> = [];
    user_id: string;
    subscription: Subscription;
    socketSubscription: Subscription;
    navigationSubscription: Subscription;
    obtainEvent;
    goBack: Boolean = false;
    loadershow: Boolean = false;
    // Pagination
    page = sessionStorage.getItem('conversationPage') ?
        parseInt(sessionStorage.getItem('conversationPage'), 10) : 1;
    paginationDisabled = false;

 public static applyFontIcon(channel): string[] {
    let returnElement = ['far'];
    switch (channel) {
      case 'sms':
        returnElement = ['fab', 'fa-comments'];
        break;
      case 'viberpa':
        returnElement = ['fab', 'fa-viber'];
        break;
      case 'fbmessenger':
        returnElement = ['fab', 'fa-facebook-messenger'];
        break;
      case 'wechat':
        returnElement = ['fab', 'fa-weixin'];
        break;
        case 'whatsappofficial':
        returnElement = ['fab', 'fa-whatsapp'];
        break;
	  case 'bbm':
        returnElement = ['fab', 'fa-blackberry'];
        break;
      case 'kik':
      case 'zalo':
      case 'threema':
      case 'alexa':
        returnElement = ['fab', 'custom-icon', 'custom-' + channel];
        break;
      default:
        returnElement = ['fab', 'fa-' + channel];
        break;
    }
    return returnElement;
  }

    public static applyTypeIcon(type): string[] {
        let returnElement = ['far'];
        if (type) {
            type = type.toLowerCase();
            switch (type) {
                case 'text':
                    returnElement = ['far', 'fa-comment'];
                    break;
                case 'voice':
                case 'audio':
                    returnElement = ['fas', 'fa-microphone'];
                    break;
                case 'image':
                    returnElement = ['far', 'fa-image'];
                    break;
                case 'map location':
                case 'map':
                case 'location':
                    returnElement = ['fas', 'fa-location-arrow'];
                    break;
                default:
                    returnElement = ['far', 'fa-comment'];
            }
        }
        return returnElement;
    }



    constructor(private conversationService: ConversationService, private router: Router,
        private socket: SocketService, private homeService: HomeService, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.loadershow = true;
        this.subscription = this.homeService.getMessage().subscribe(data => {
            console.log(data);
            if (data.type === 'search' && data.message) {
                this.searchConversation(data.message);
            } /* else if (this.obtainEvent && this.obtainEvent.type === 'engageUser') {
                this.obtainEventHandle();
            } */ else {
                this.pageChanged(this.page);
            }
        });

        /*const engager = JSON.parse(localStorage.getItem('user'));
        this.user_id = engager.user_id;
        this.conversationService.engagedUsers(engager.user_id).subscribe(response => {
            if (response.success) {
                for (const i of Object.keys(response.data)) {
                    this.messageBox(response.data[i].user_phone_no, 0);
                }
            }
        }, error => {
            console.log('engagedUsers', error);
        });*/

        /*this.obtainEvent = this.initialiseInvites();
        if (this.obtainEvent && this.obtainEvent.type === 'engageUser') {
            this.obtainEventHandle();
        } else {*/
            this.pageChanged(this.page);
       // }

        this.setNavigationSubscription();


        this.socketSubscription = this.socket.getMessage().subscribe(message => {
            this.getNotification(message);
        });

    }

    ngOnDestroy() {
        this.loadershow = false;
        const regExpresssion = new RegExp(environment.dashboardPrefix + '/conversations/', 'gi');
        if (!this.router.url.match(regExpresssion)) {
            sessionStorage.removeItem('conversationPage');
        }
        this.subscription.unsubscribe();
        this.socketSubscription.unsubscribe();

        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    setNavigationSubscription() {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.obtainEvent = this.initialiseInvites();
                if (this.obtainEvent && this.obtainEvent.type === 'engageUser') {
                    this.obtainEventHandle();
                }
            }
        });
    }

    initialiseInvites() {
        const returnValue = this.homeService.getNotification();
        this.homeService.setNotification(null);
        return returnValue;
    }

    obtainEventHandle() {
        this.goBack = true;
        this.conversations = (<any>Object).values(this.obtainEvent.info);
        this.totalMessageCount = 1;
        this.totalCount = 1;
        console.log(this.obtainEvent);
    }

    handleGoBack() {
        this.goBack = false;
        this.page = 1;
        this.pageChanged(this.page);
    }


    listConversations(args): void {
        this.loadershow = true;
        this.paginationDisabled = true;
        this.conversationService.userMessages(args).subscribe(data => {
            this.paginationDisabled = false;
            this.totalMessageCount = data.info && data.info.totalMessageCount ? data.info.totalMessageCount : 0;
            this.totalCount = data.info && data.info.totalCount ? data.info.totalCount : 0;

            this.conversations = _.filter(data.info, (value, key) => {
                return key !== 'totalCount' && key !== 'totalMessageCount';
            });
            this.topHeader = this.conversations.length > 0;
           this.loadershow = false;
        }, error => {
            console.log('/dashboard/user/messages error', error);
            this.topHeader = false;
        });

    }

    pageChanged(page) {
        this.page = page;
        const args = {
            filter: 'All',
            limit: 10,
            skip: (this.page * 10) - 10,
            recordcount:100
        };
        this.listConversations(args);
    }

    messageBox(id, skip) {
        const arg = {
            id,
            skip
        };

       /* this.conversationService.userMessagesList(arg).subscribe(response => {
            if (response) {
                let data = _.filter(response.info, (value, key) => {
                    return key !== 'totalCount' && key !== 'totalMessageCount';
                });

                // $scope.messages[id] = $scope.item.concat(Object.values($scope.coversation));
                this.messages.push({ id, data });
            }
        });*/
    }

    conversationDetails(userId) {
        console.log("---hooooppp");
      //  alert("hai");
        localStorage.userId = userId;
        sessionStorage.setItem('conversationPage', this.page.toString());
        this.router.navigate([`/${environment.dashboardPrefix}/conversations/${userId}`]);
    }

    /*registerPopup(conversation, skip) {
        console.log("--heeiiii--");
        this.conversationService.engagerSetting(this.user_id).subscribe(response => {
            if (response.success === true) {

                if (response.data && response.data.length < 4) {
                    //this.chatBox_open = true;
                    const engageArg = {
                        engage_enabled: true,
                        connectionName: conversation.connectionName,
                        engager_id: this.user_id,
                        user_id: conversation.id,
                        messageId: conversation.msgId,
                        phone_no: conversation.phoneNo
                    };
                    this.conversationService.engagerChecking(engageArg).subscribe(responseCheck => {
                        if (responseCheck.status === false) {
                            this.messageBox(conversation.phoneNo, skip);
                        }
                    }, error => {
                        this.toastr.error('', 'Sorry, Something went wrong.');
                    });
                } else {
                    this.toastr.error('', 'Can only handle three chats at a time.');
                }
            } else {
                this.toastr.error('', 'Sorry, Something went wrong');
            }
        });
    }*/

    applyFontIcon(channel): string[] {
        return ConversationComponent.applyFontIcon(channel);
    }
    applyTypeIcon(type): string[] {
        return ConversationComponent.applyTypeIcon(type);
    }

    getNotification(message) {
        const updateData = _.find(this.messages, { id: message.phoneNo });
        if (updateData) {
            updateData.data.unshift(message);
            updateData.data = _.uniqBy(updateData.data, 'msgId');
        }
        // const id = message.phoneNo;
        // const connectionName = message.connectionName;

        // const messageSelectionMain = _.find(this.conversations, { connectionName });

        /* var message_selection = _.find($scope.messages[id], function (obj) {
            return obj.msgId === $scope.msgid;
        });

        if (message_selection != undefined) {
            $scope.messages[id].unshift(message);
            $scope.messages[id] = _.uniq($scope.messages[id], 'msgId');

        } else {
            if ($scope.messages[id] != undefined) {
                $scope.messages[id].unshift(message);
                $scope.messages[id] = _.uniq($scope.messages[id], 'msgId');
            }
        } */
        this.conversations = this.conversations.filter(item => item.connectionName !== message.connectionName);
        this.conversations.unshift(message);

        this.totalMessageCount++;

        // $scope.messageslist($scope.items);
    }

    searchConversation(data) {
        this.conversationService.searchConversation(data).subscribe((response: any) => {
            console.log('response', response);
            this.paginationDisabled = false;
            this.totalMessageCount = response.info && response.info.totalMessageCount ?
                response.info.totalMessageCount : 0;
            this.totalCount = response.info && response.info.totalCount ? response.info.totalCount : 0;

            this.conversations = _.filter(response.info, (value, key) => {
                return key !== 'totalCount' && key !== 'totalMessageCount';
            });
            this.topHeader = this.conversations.length > 0;


        });
    }

    applyfontcolor(channel:any):string{

        let returnElement = '#2AC940'
        switch (channel) {
          case 'sms':
            returnElement = 'f4ac0c'
            break;
          case 'viberpa':
            returnElement = '#2d275b'
            break;
          case 'fbmessenger':
            returnElement = ' #1E87F0'
            break;
          case 'wechat':
            returnElement = '#2DC100'
            break;
            case 'whatsappofficial':
            returnElement = '#2AC940'
            break;
            case 'whatsapp':
            returnElement = '#2AC940'
            break;
          case 'bbm':
            returnElement = '#3D3D3D'
            break;
          case 'kik':
            returnElement = '#5DCD11'
            break;
            case 'telegram':
            returnElement = '#2da5d9'
            break;
          case 'zalo':
                returnElement = '#0068ff'
                break;
          case 'threema':
                returnElement = '#05CCFF'
                break;
          case 'alexa':

            returnElement = '#2AC940'
            break;
          default:
            returnElement = '#2AC940'
            break;
        }
        return returnElement;
    }

}
