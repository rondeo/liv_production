import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecentConversationService } from './recent-conversation.service';
import * as _ from 'lodash';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../socket.service';
import { HomeService } from '../home.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import async from 'async';


declare const openpgp: any;
declare var bootbox: any;

@Component({
  selector: 'app-recent-conversation',
  templateUrl: './recent-conversation.component.html',
  styleUrls: ['./recent-conversation.component.scss']
})
export class RecentConversationComponent implements OnInit {

  panelStyle = { 'box-shadow': '0 8px 22px 0 rgba(0, 0, 0, 0.12)' };
  toDate: any = moment();
  model :any = {
    power:'last30'
  };
  search:string = "";
  categoryname:string =  '1';
  viewdropdown:boolean = false;
  fromDate: any = moment().subtract(30, 'days');
  startDate: any;
  endDate: any;
  currentDate: any;
  totalMessageCount = 0;
  totalCount: Number = 0;
  conversations: Array<any> = [];
  topHeader: boolean = null;
  /** Engager */
  messages: Array<any> = [];
  conversationID: Array<any> = [];
  conversationlist: any;
  userlistdata: any;
  sessionlistdata: any;
  sessiondetails: any;
  sessiontotalCount: any;
  unanswerdetails: any;
  unanswertotal: any;
  userviewList: any;
  userviewtotal: any;
  unanswerview: any;
  unanswercheck=false;
  sessionviewList: any;
  sessionlisttotal: any;
  sessionpagelisttotal: any;
  sessionlist: any;
  unanswerlist: any;
  user_id: string;
  subscription: Subscription;
  socketSubscription: Subscription;
  navigationSubscription: Subscription;
  obtainEvent;
  goBack: Boolean = false;
  loadershow = false;
  showLoader = false;
  downloadButton = false;
  sessionType: any = 'all';
  // Pagination
  page = sessionStorage.getItem('conversationPage') ?
    parseInt(sessionStorage.getItem('conversationPage'), 10) : 1;
  pagelist = 1;
  sessionpage = 1;
  unanswerpage = 1;
  sessionlistpage = 1;
  paginationDisabled = false;
  unRecognizedInputs = false;
  reportLoader = false;
  view = false;
  userview = false;
  listview = false;
  listviewSession = false;
  sessionlistview = false;
  viewsession = false;
  viewAll = true;
  viewunanswered=true;
  viewsessionAll = true;
  currentRoute: String;
  buttonText="Decrypt";
  mattabValue:any='userview';
  public messageId;
  searchvalue:string;


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


  constructor(private conversationService: RecentConversationService, private router: Router,
    private socket: SocketService, private homeService: HomeService, private toastr: ToastrService) {

  }


  onKeydown1(event:any,value:any=[]) {

    if (event.key === "Enter") {
      this.homeService.sendMessage({
        type: 'loader',
        showLoader: true
      });
      this.searchvalue = value;
      this.searchconversations()

    }
  }

  ngOnInit() {

    this.currentRoute = this.router.url;

    if (sessionStorage.getItem('privateKey')) {
      this.buttonText = 'Decrypted';
    //  $rootScope.downloadButton = true;
  } else {
     this.buttonText = 'Decrypt';
     // $rootScope.downloadButton = false;
  }
    this.showLoader = true;
    this.homeService.sendMessage({
      type: 'loader',
      showLoader: this.showLoader
    });

    if (sessionStorage.getItem('decryption') == 'yes') {

      this.downloadButton = true;

    }

    const inputFilter: boolean = JSON.parse(sessionStorage.getItem('inputFilter'));
    // console.log('inputFilterinputFilter1', inputFilter);
    if (inputFilter === true) {
      this.unRecognizedInputs = true;
    }

    this.subscription = this.homeService.getMessage().subscribe(data => {
      console.log('conversation component get message data', data);
      if (data.type === 'search' && data.message) {
        this.searchConversation(data.message);
      } else if (data.type === 'loader') {

      } else {
        //this.pageChanged(this.page);
      }
    });

   /* const engager = JSON.parse(localStorage.getItem('user'));
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

    this.obtainEvent = this.initialiseInvites();
    // if (this.obtainEvent && this.obtainEvent.type === 'engageUser') {
    //   this.obtainEventHandle();
    // } else {
    //   this.pageChanged(this.page);
    // }

   // this.setNavigationSubscription();


    this.socketSubscription = this.socket.getMessage().subscribe(message => {
      // this.getNotification(message);
    });




  }
  changemessages(){
    if(this.model.power == "last30"){
      this.viewdropdown=false;
      this.viewsession=false;
      this.listviewSession=false;
      this.view=false;
      this.listview=false;
      let d = new Date();
      let ts = d.getTime();
      let thirtyDays = ts - (30 * 24 * 60 * 60 * 1000);
      this.fromDate = ts;
      this.toDate = thirtyDays;
      this.pageChanged(this.page);
      this.sessionpageChanged(this.sessionpage);
      this.unanswerPageChanged(this.unanswerpage);
    }else{
      this.viewdropdown=true;
      this.viewsession=false;
      this.listviewSession=false;
      this.view=false;
      this.listview=false;
      let d = new Date();
      let ts = d.getTime();
      let thirtyDays = ts - (30 * 24 * 60 * 60 * 1000);
      this.fromDate = ts;
      this.toDate = thirtyDays;
    }


  }
  redirect_QA()
  {
    this.router.navigateByUrl('/dashboard/conversationalelements');
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


  showPromptModel(): void {
    this.currentRoute = this.router.url;
    console.log("this.currentRoute ",this.currentRoute );
    //const encryptedMessage = environment.defaultEncryptedMessage;
    bootbox.prompt({
      size: 'large',
      title: 'Enter your Private Key',
      inputType: 'textarea',
      callback: async (result) => {
        if (result) {
          try {
            const privateKey = await openpgp.key.readArmored(result);
            if (!privateKey || privateKey.err) {
              this.toastr.error('', 'Wrong private key');
            } else {
              const message ='';
              if (message) {
                const options = {
                  message: message,
                  privateKeys: privateKey.keys
                };
                const decryptedData = await openpgp.decrypt(options);
                if (decryptedData && decryptedData.data === 'validating encryption') {
                  sessionStorage.setItem('privateKey', result);
                  sessionStorage.setItem('decryption', 'yes');

                console.log('success');
                  this.router.navigateByUrl('/RefreshComponent', {skipLocationChange: true}).then(() =>
                    this.router.navigate([this.currentRoute]))
                  // this.router.navigate([environment.dashboardPrefix + '/conversations'])
                    .then(() => {
                      console.log('reload current page success');
                      this.buttonText='Decrypted';
                      this.toastr.success('', 'Success');
                    }, (err) => {
                      console.log('reload current page error', err);
                    });
                } else {
                  this.toastr.error('', 'Wrong private key');
                }
              } else {
                console.log('show Prompt Model Error in predefined message');
              }
            }
          } catch (error) {
            console.log('show Prompt Model catch Error', error);
            this.toastr.error('', 'Wrong private key');
          }
        } else if (typeof result === 'string') {
          this.toastr.error('', 'Wrong private key');
        }
      }
    });
  }
  dateChanges(dateArray) {
    console.log(dateArray);
    if(dateArray)
    {
       this.showLoader = true;
      this.viewsession=false;
      this.listviewSession=false;
      this.unanswercheck=false;
      this.view=false;
      this.listview=false;
      this.unanswerview=false;
      this.viewAll=true;
      this.viewsessionAll=true;
    this.toDate = dateArray && dateArray[0].getTime() ? dateArray[0].getTime() : this.toDate.getTime();
    this.fromDate = dateArray && dateArray[1].getTime() ? dateArray[1].getTime() : this.fromDate.getTime();
    console.log("datearray", this.toDate);
    console.log("datearray", this.fromDate);
    if(this.mattabValue=='userview')
    {
    this.pageChanged(this.page);
    this.showLoader = false;
    }
    if(this.mattabValue=='unanswered')
    {
    this.Unanswered();
    this.showLoader = false;
    }
    if(this.mattabValue=='sessionview')

    this.showLoader = false;

    }
  }
  ngOnDestroy() {
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

  Unanswered() {
    console.log("--UNANSWER--");
    this.loadershow=true;
    const arg = {

      skip: 0,
      limit: 10,
      filter: 'true',
      startDate: this.toDate,
      endDate: this.fromDate
    };

    this.conversationService.userMessages(arg).subscribe(response => {
      console.log("---hunanswer---",response);
      if (response) {
        this.loadershow=false;
        this.totalMessageCount = response.info && response.info.totalMessageCount ? response.info.totalMessageCount : 0;
        this.unanswerdetails = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        if(this.unanswerdetails.length)
        {
          this.unanswerViewclick(this.unanswerdetails[0]);
        }
        this.unanswertotal = response.info.totalCount;
        this.showLoader = false;
        this.homeService.sendMessage({
          type: 'loader',
          showLoader: this.showLoader
        });

      }
    });
  }
  userviewgoback() {
    //this.loadershow=true;
    this.pagelist = 1;
  this.sessionpage = 1;
  this.unanswerpage = 1;
  this.sessionlistpage = 1;
    setTimeout(()=>{
        this.listview = false;
    this.viewAll = true;
    this.viewunanswered=true;
    this.viewAll = true;
    //this.loadershow=false;
  },500);
  }
  sessionviewgoback() {
    this.pagelist = 1;
    this.sessionpage = 1;
    this.unanswerpage = 1;
    this.sessionlistpage = 1;
    this.loadershow=true;
    setTimeout(()=>{
    this.sessionlistview = false;
    this.viewsessionAll = true;
    this.viewunanswered=true;
    this.listviewSession = false;
    this.unanswercheck=false;
    this.loadershow=false;
  },500);
  }
  backfunction()
  {
    console.log("cdsadadadaasdadadadadad");
  }
  userviewshow(event) {
    console.log("--UA",event);
    this.loadershow=true;
    if(event.index===0)
    {
      this.mattabValue='userview';
      this.search = "";
      this.categoryname = '1';
      this.pageChanged(this.page);
    }
    if(event.index===1)
    {
      this.mattabValue='unanswered';
      this.search = "";
      this.categoryname = '2';
      this.Unanswered();
    }
    this.view = false;
    //this.listview = false;
    this.listviewSession = false;
    this.viewsession = false;
    this.sessionlistview = false;
    this.unanswerview = false;
    this.unanswercheck=false;
    this.viewsessionAll = true;
    //this.viewAll = true;
    this.userviewgoback();
  }
  listuserview(id, conversationlist) {
    console.log('ID from Conversation: ',id);
    console.log('Conversation List: ', conversationlist);
    this.unanswercheck=true;
    this.listview = true;
    this.loadershow=true;
    this.userlistdata = conversationlist;
    this.viewAll = false;
    this.viewunanswered=false;
    const arg = {
      id,
      skip: 0,
      limit: 10,
      filter: 'All',
      startDate: this.toDate,
      endDate: this.fromDate
    };

    this.conversationService.userMessagesList(arg).subscribe(response => {
      if (response) {
        this.loadershow=false;
        this.userviewList = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        this.userviewtotal = response.info.totalCount;

      }
    });

  }
  listsessionview(id, conversationlist) {
    this.listviewSession = true;
   // this.unanswerview=false;
   this.loadershow=true;
    this.unanswercheck=true;
    this.sessionlistdata = conversationlist;
    //console.log('Session List Data', this.sessionlistdata);
    this.viewsessionAll = false;
    const arg = {
      id,
      skip: 0,
      limit: 10,
      filter: 'All'
    };

    this.conversationService.usersessionList(arg).subscribe(response => {
      if (response) {
        this.loadershow=false;
        this.sessionviewList = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        this.sessionlisttotal = response.info.totalCount;

      }
    });

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
    this.loadershow=true;
    this.paginationDisabled = true;
    this.conversationService.userMessages(args).subscribe(data => {
      console.log("--CAME--",data);
      if(data)
      {
        this.loadershow=false;
      }
      this.paginationDisabled = false;
      this.totalMessageCount = data.info && data.info.totalMessageCount ? data.info.totalMessageCount : 0;
      this.totalCount = data.info && data.info.totalCount ? data.info.totalCount : 0;

      this.conversations = _.filter(data.info, (value, key) => {
        return key !== 'totalCount' && key !== 'totalMessageCount';
      });
      console.log("this.conversations--",this.conversations);
      if(this.conversations.length) {
        this.conversationView(this.conversations[0]);
      }
      this.topHeader = this.conversations.length > 0;
      this.homeService.sendMessage({
        type: 'loader',
        showLoader: false
      });
      this.showLoader = false;


    }, error => {
      console.log('/dashboard/user/messages error', error);
      this.topHeader = false;
    });

  }

  pageChanged(page) {

    this.page = page;
    if(this.search == ""){
    const args = {
      filter: 'All',
      limit: 10,
      skip: (this.page * 10) - 10,
      startDate: this.toDate,
      endDate: this.fromDate
    };
    if (this.unRecognizedInputs) {
      args.filter = 'true';
    }
    console.log("---hekllooo--");
    this.listConversations(args);
  }else{
    this.searchvalue = this.search;
    this.searchconversations()
  }
  }
  sessionpageChanged(page) {
    this.sessionpage = page;
    this.loadershow=true;
    if(this.search == ""){
      const arg = {

        skip: (this.sessionpage * 10) - 10,
        limit: 10,
        filter: 'All',
        startDate: this.toDate,
        endDate: this.fromDate
      };
      console.log("arg",arg);
      this.conversationService.sessionMessages(arg).subscribe(response => {
        if (response) {
          this.loadershow=false;
          this.sessiondetails = _.filter(response.info, (value, key) => {
            return key !== 'totalCount' && key !== 'totalMessageCount';
          });
          this.sessiontotalCount = response.info.totalCount;
          if( this.sessiondetails.length)
          {
          this.sessionViewclick(this.sessiondetails[0]);
          }
          this.homeService.sendMessage({
            type: 'loader',
            showLoader: this.showLoader
          });
          this.showLoader = false;
        }
      });
    }else{
      this.searchvalue = this.search;
      this.searchconversations();
    }

  }

  unanswerPageChanged(page) {
    this.unanswerpage = page;
    this.loadershow=true;
      if(this.search == ""){
      const arg = {

        skip: (this.unanswerpage * 10) - 10,
        limit: 10,
        filter: 'true',
        startDate: this.toDate,
        endDate: this.fromDate
      };

      this.conversationService.userMessages(arg).subscribe(response => {
        if (response) {
          this.loadershow=false;
          this.unanswerdetails = _.filter(response.info, (value, key) => {
            return key !== 'totalCount' && key !== 'totalMessageCount';
          });
          if(this.unanswerdetails.length)
          {
            this.unanswerViewclick(this.unanswerdetails[0]);
          }
          this.unanswertotal = response.info.totalCount;
          this.homeService.sendMessage({
            type: 'loader',
            showLoader: this.showLoader
          });
          this.showLoader = false;
        }
      });
    }else{
      this.searchvalue = this.search;
      this.searchconversations();
    }

  }
  pageChangedlist(id, page) {
    this.pagelist = page;
    this.loadershow=true;
    const arg = {
      id,
      skip: (this.pagelist * 10) - 10,
      limit: 10,
      filter: 'All',
      startDate: this.toDate,
      endDate: this.fromDate
    };

    this.conversationService.userMessagesList(arg).subscribe(response => {
      if (response) {
        this.loadershow=false;
        this.userviewList = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        this.userviewtotal = response.info.totalCount;
        this.homeService.sendMessage({
          type: 'loader',
          showLoader: this.showLoader
        });
        this.showLoader = false;

      }
    });


  }
  sessionpageChangedlist(id, page) {
    this.sessionlistpage = page;
    this.loadershow=true;
    const arg = {
      id,
      skip: (this.sessionlistpage * 10) - 10,
      limit: 10,
      filter: 'All',
      startDate: this.toDate,
      endDate: this.fromDate
    };


    this.conversationService.usersessionList(arg).subscribe(response => {
      if (response) {
        this.loadershow=false;
        this.sessionviewList = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });

        this.sessionpagelisttotal = response.info.totalCount;
        console.log("sessionpagelisttotalsessionpagelisttotal",this.sessionpagelisttotal);
        this.homeService.sendMessage({
          type: 'loader',
          showLoader: this.showLoader
        });
        this.showLoader = false;

      }
    });


  }

  inputFilterChange(value: boolean) {
    console.log('inputFilterChange value ', value);
    this.unRecognizedInputs = value;
    const args = {
      filter: 'All',
      limit: 10,
      skip: 0,
    };
    if (value === true) {
      args.filter = 'true';
    } else {
      args.filter = 'All';
    }
    this.showLoader = true;
    this.homeService.sendMessage({
      type: 'loader',
      showLoader: this.showLoader
    });
    this.listConversations(args);
  }

  messageBox(id, skip) {
    this.loadershow=true;
    const arg = {
      id,
      skip,
      startDate: this.toDate,
      endDate: this.fromDate
    };

   /* this.conversationService.userMessagesList(arg).subscribe(response => {
      if (response) {
        this.loadershow=false;
        const data = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });


      }
    });*/
  }

  conversationDetails(userId) {
    localStorage.userId = userId;
    sessionStorage.setItem('conversationPage', this.page.toString());
    this.router.navigate([`/${environment.dashboardPrefix}/conversations/${userId}`]);
  }

  highlightQuestion(question) {

    this.conversations.map(item => item.highlight = false);
    const element = this.conversations.find(item => item._id === question._id);
    element.highlight = true;
  }
  conversationView(id) {
    this.view = true;


    this.conversationlist = id;
    this.messageId = id.msgId;

  }
  unanswerViewclick(id) {
    this.unanswerview = true;
    console.log("ID for unanswered: ", id);

    this.unanswerlist = id;
    this.messageId = id.msgId;
  }

  sessionViewclick(id) {
    this.viewsession = true;
    this.sessionlist = id;
    this.messageId = id.msgId;

  }

  /*registerPopup(conversation, skip) {
    this.conversationService.engagerSetting(this.user_id).subscribe(response => {
      if (response.success === true) {

        if (response.data && response.data.length < 4) {
          // this.chatBox_open = true;
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
    return RecentConversationComponent.applyFontIcon(channel);
  }

  applyTypeIcon(type): string[] {
    return RecentConversationComponent.applyTypeIcon(type);
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

  onKeydownsearch(value: any = []) {
    this.homeService.sendMessage({
      type: 'loader',
      showLoader: true
    });
    this.searchvalue = value;
    this.searchconversations()

  }
  searchconversations() {
    let arg;
    this.loadershow = true;
    if (this.categoryname == '2') {
      arg = {
        search: this.searchvalue,
        category: this.categoryname,
        limit: 10,
        // skip:(this.page * 10) - 10,
        skip: 0
      }
    } else {
      arg = {
        search: this.searchvalue,
        category: this.categoryname,
        limit: 10,
        // skip:(this.page * 10) - 10,
        skip: 0
      }
    }

    this.conversationService.historySearch(arg).subscribe(response => {
      console.log("====conversation===",response);
      this.homeService.sendMessage({
        type: 'loader',
        showLoader: false
      });
      if (this.categoryname == '1') {
        this.listview = false;
        this.viewAll = true;
        this.totalMessageCount = response.info && response.info.totalMessageCount ? response.info.totalMessageCount : 0;
        this.totalCount = response.info && response.info.totalCount ? response.info.totalCount : 0;

        this.conversations = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        this.loadershow = false;
        if (this.conversations.length) {
          this.conversationView(this.conversations[0]);
        }
      }  else {
        this.totalMessageCount = response.info && response.info.totalMessageCount ? response.info.totalMessageCount : 0;
        this.unanswerdetails = _.filter(response.info, (value, key) => {
          return key !== 'totalCount' && key !== 'totalMessageCount';
        });
        this.loadershow = false;
        if (this.unanswerdetails.length) {
          this.unanswerViewclick(this.unanswerdetails[0]);
        }
        this.unanswertotal = response.info.totalCount;
      }
    }, error => {
      console.log('engagedUsers', error);
    });

  }


}
