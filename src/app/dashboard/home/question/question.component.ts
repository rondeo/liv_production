import {Component, OnInit, ViewChild,OnDestroy, ɵConsole} from '@angular/core';
import {QuestionService} from './question.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {PromptModalComponent} from '../shared/prompt-modal/prompt-modal.component';
import {Router, NavigationEnd} from '@angular/router';
import {HomeService} from '../home.service';
import * as _ from 'underscore';
import {Subscription, Subject} from 'rxjs';
import { add } from 'ngx-bootstrap/chronos/public_api';
export class SelectedQuestion {
    _id: string;
    article_id: string;
    question_type: string;
    fetchData: boolean;
    question: string;
    answer: string;
    comment: string;
    status: string;
    sub_question: SubQuestion;
    update: boolean;
    approve: boolean;
    view: boolean;
    reject: boolean;
}
export class SubQuestion {
  sub_question: string;
  is_main_question: boolean;
}
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

// todo: Validate forms

export class QuestionComponent implements OnInit, OnDestroy {
  model: any = {
    sub_question:"",
    question:"",
    category:""

};
/*config = {
  displayKey:"category", 
  search:true ,
  height: 'auto',
  placeholder:'Select',
  customComparator: ()=>{},
  moreText: 'more' ,
  noResultsFound: 'No results found!' ,
  searchPlaceholder:'Search' ,
  searchOnKey: 'name' ,
}*/
config = {
  displayKey: "category",
  search: true,
  height: 'auto',
  placeholder:'Select Category',
};
config2 = {
  displayKey: "name",
  search: true,
  height: 'auto'
};
//config:any;
  panelStyle = {'box-shadow': '0 8px 22px 0 rgba(0, 0, 0, 0.12)'};
  subscription: Subscription;
  subscriptionSearch: Subscription;
  //selectedQuestion{add:boolean = false;
  questions: Array<any> = [];
  QABackup:Array<any> = [];
  totalCount: Number = 0;
  subvarient:Array<any> = [];
  totalMessageCount: Number = 0;
  varient:any;
  questionError = {
    status: false,
    message: 'No records found...'
  };
  search:string;
  assignees: Array<any> = [];
  // Pagination
  page = 1;
  clickval:string;
  paginationDisabled = false;
  userType: String;
  selectedQuest:SelectedQuestion;
  selectedQuestion = {
    _id: '',
    article_id: '',
    question_type: 'consumer',
    fetchData: true,
    question: '',
    answer: '',
    comment: '',
    status: '',
    sub_question: [],
    update: false,
    approve: false,
    view: false,
    add:false,
    reject: false,
    created_on:'',
    approved_by:{
      name:''
    },
    approved:'',
    category:'',
    created_by:'',
    isCollapsed:true,
    show:false,
  };
  textAreas: any[] = [];
  add_active = false;
  makeditable = [];
  goBack: Boolean = false;
  navigationSubscription;
  obtainEvent;
  flag;
  main_qtn_status = 0;
  reasonApproveStatus = false;
  tempArray = [];
  mergeArray = [];
  arabic_lan;
  category = 'category'
  language = 'en';
  QAtype;
  deleteValue:string = '';
  subquestions:any = [];
  subquestionsadd:any = [];
  variant_question:any = [];
  QAcategoryId:any;
  indexe2:number;
  updateErrorMsg = {};
  updatestatus = {};
  errorMsg = {};
  errorstatus = {};
  addErrorMsg = "";
  addstatus = false;
  tempVal = {};
  public isCollapsed: boolean = true;

  public rows: object[] = [
    { detail: 'x' },
    { detail: 'y' }
  ]; 
  collapsed:boolean = true;
  tabs123:any = ["Billing", "Broadband", "Broadband Premium", "Broadband Professional", "Business Circle Plan 5.0", "Business Complete", "Business Connect", "Business Essentials", "Business Hosted Voice", "Business ISDN 2", "Business Landline", "Business Mobile Plan", "Business TV", "Call Barring", "Call Forwarding", "Call Home for Less", "Caller Tunes", "Daily Saver Bundle", "Data Bundle", "Device Instalment Offer", "Disability & Elderly Bonus", "Disability & Eldery Bonus", "du app", "du International Calling Pack", "du Tuesday", "Enterprise Device Instalment", "Essential Business", "Exclusive Business Number", "Executive Plan", "Executive Plan Plus", "Government Plan", "Home Services", "ID Registration", "International Savings Offer", "Internet Calling Pack", "IPTV", "ISDN 30", "Kabayan Deal", "Landline", "Missed Call Notification", "MyAccount", "New Daily Data Bundles", "No Objection Certificate", "Non Stop Daily Data Bundle", "Non Stop Monthly Data Bundle", "Office 365", "One2One", "Out of Credit Service", "Parental Control", "Pay as you go plus", "Payments", "Payments & Recharge", "PayTV", "PostPaid - Control Plan", "PostPaid - Emirati Plan", "PostPaid - New Emirati Plan", "PostPaid - Smart Plan", "PostPaid - Smart Platinum", "PostPaid Mobile", "PostPaid Offer", "Power Bill", "Premier Plan 2.0", "Prepaid", "Prepaid plans", "Recharge", "Roaming", "Smart Home", "Social Data", "Social Data Pack", "Tourist Plan", "Trunk Line", "TV", "VAT", "WiFi UAE"]
  QAcategory : any =[];
  QAcategorydropdown:any = [];
  indexes:number;
  lang="lang";
  countryflg = 'assets/img/app/fl_gb.gif';
  @ViewChild('tabGroup')
  tabGroup;
  public show:boolean = false;
  results: Object;
  searchTerm$ = new Subject<string>();

   //isCollapsed:boolean = false;
  things:Array<any> = [{
    data: "information for img1:",
    data2: "only the info img1 is displayed",
  },
    {
      data: "information for img2:",
      data2: "only the info for img2 is displayed"
    },
    {
      data: "information for img3:",
      data2: "only the  info for img3 is displayed"
    }]

  constructor(private questionService: QuestionService, private modalService: NgbModal,
              private toastr: ToastrService, private router: Router, private homeService: HomeService) {
                this.questionService.search(this.searchTerm$,this.language)
                .subscribe(results => {
                  
                  this.questions = results.info && results.info.questions ? results.info.questions : [];
                  this.setbackup(this.questions)
                  this.totalCount = results.info && results.info.totalCount ? results.info.totalCount : 0;
                });
              }
  yourFn(event:any){
    console.log("---YoursFn1");
    this.selectedQuestion.view = false;
    this.search = "";
   this.QAcategoryId = this.QAcategory[event.index]._id;
   localStorage.setItem(this.category, this.QAcategoryId);
   console.log("---this.QAcategoryId",this.QAcategoryId);
   const args = {
    limit: 10,
    skip: (this.page * 10) - 10,
    'language': this.language,
    category:this.QAcategoryId
  };
  this.listQuestions(args);
  console.log("---YoursFn0");
  }
  removeTab(val){
    console.log('hhhh',val);
  }
  clicked(index) {
    this.things[index].show = !this.things[index].show;
  };
  clicked1(index,val) {
    this.clickval = val;
    this.indexes = index;
    this.questions[index].show = !this.questions[index].show;
  };
  clicked2(index,val){
    console.log("----Conseole---cliecked");
    console.log("----Conseole---clicked2",index);
    this.clickval = val; 
    this.indexe2 = index;
    this.questions[index].isCollapsed = !this.questions[index].isCollapsed;
    this.collapsed = this.questions[index].isCollapsed
  }
  languageselection (language:string) {
    // $scope.searchQA = '';
    // this.lang = language;

  // this.msgCenterService.chnagedLanguageOption(language);
  // this.homeService.changeLanguage=language;
  localStorage.setItem(this.lang, language);
    if (language === 'en') {
      this.countryflg = 'assets/img/app/fl_gb.gif';
      this.arabic_lan =false;
    } else if (language === 'ar') {
      this.countryflg = 'assets/img/app/ae-AE.gif';
      this.arabic_lan =true;
    }
    this.homeService.sendMessage({
      type: 'language',
      message: language
    });
    if(this.QAcategory.category == undefined){
      this.QAcategory.category = 'All';
    }else{
      this.QAcategory.category = this.QAcategory.category;
    }
    const args = {
      limit: 10,
      skip: (this.page * 10) - 10,
      'language': this.language,
      category:localStorage.getItem('category')
    };
    console.log("---Langauge--args-",args);
    this.listQuestions(args);
     //$rootScope.$emit('language', language);
    // $rootScope.$emit('objectlanguage', language);
     //$rootScope.$emit('Intentlanguage', language);
     // emit 'langChange' with 'lang'

 }
  ngOnInit() {
    this.model.fetchData=false;
    this.language = localStorage.getItem('lang');
    if (this.language == 'ar') {
      this.arabic_lan = true;
    } else {
      this.arabic_lan = false;
    }

    this.subscription = this.homeService.getMessage().subscribe(data => {
      if (data.type === 'language' && data.message) {
        this.language = data.message;
        if (this.language == 'ar') {
          this.arabic_lan = true;
        } else {
          this.arabic_lan = false;
        }
        
      } else if (data.type === 'loader') {
      } else {
        this.pageChanged(this.page);
      }
    });

    this.subscriptionSearch = this.homeService.getMessage().subscribe(data => {
     
      if (data.type === 'searchQA' && data.message) {
        this.QAtype = false;
        this.searchQA(data.message);
      } else if (data.type === 'loader') {} 
      else {
        this.pageChanged(this.page);
      }
    });
    if (this.obtainEvent && this.obtainEvent.type === 'addQuestion') {
      this.obtainEventHandle();
    } else {
      this.pageChanged(this.page);
    }
    this.setNavigationSubscription();
    this.questionService.listAssignees().subscribe(asignData => {
      if (asignData.status === 200) {
        this.assignees = asignData.info;
        this.assignees.map(item => delete item.notification_count);
      } else {
      }
    });
    this.textAreas = [{
      sub_question: '',
      is_main_question: false
    }];
    this.userType = JSON.parse(localStorage.getItem('user')).user_type;
  }
 
  collapsequestions(question:any){
    this.subvarient = question.sub_question
  }

  addActive(val) {
    this.flag = true;
    this.textAreas.forEach(item => {
      if (item.sub_question === '') {
        this.flag = false;
      }
    });


    if (val !== '') {
      const emptydata = this.textAreas.filter(item => item.sub_question == '');
      if (emptydata.length) {
        this.add_active = false;
      } else {
        this.add_active = true;
      }
    } else {
      this.add_active = false;
    }
  };

  addMore1() {
    this.flag = true;
    this.textAreas.forEach(item => {
      if (item.sub_question === '') {
        this.flag = false;
      }
    });
    if (this.flag) {
      this.textAreas.push({
        sub_question: '',
        is_main_question: false
      });
      this.flag = false;
    }

  };

  removeQA = function (x) {
    this.add_active = true;
    if (this.textAreas.length) {
      var b = this.textAreas.splice(x, 1);
      if (this.selectedQuestion.update) {
        b = b[0];
        b.sub_questions = b.sub_question;
        b.is_main_question = false;
        if (b.approve_status == 'approved') {
          b.approve_status = 'delete';
          this.tempArray.push(b);
        }
      }
    }

  };

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  initialiseInvites() {
    const returnValue = this.homeService.getNotification();
    this.homeService.setNotification(null);
    return returnValue;
  }

  obtainEventHandle() {
    this.goBack = true;
    this.questions = [this.obtainEvent.info];
    this.totalCount = 1;
  }

  handleGoBack() {
    this.goBack = false;
    this.pageChanged(this.page);
    this.cancelQuestion();
  }

  setNavigationSubscription() {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.obtainEvent = this.initialiseInvites();
        if (this.obtainEvent && this.obtainEvent.type === 'addQuestion') {
          this.obtainEventHandle();
        }
      }
    });
  }


  pageChanged(page) {
    this.clickval = '';
    if(this.QAcategoryId !== undefined){
      this.QAcategoryId = this.QAcategoryId;
    }else{
      this.QAcategoryId = 'All';
    }
    this.page = page;
    this.selectedQuestion.view = false;
    if(this.QAcategory.category == undefined){
      this.QAcategory.category = 'All';
    }else{
      this.QAcategory.category = this.QAcategory.category;
    }
    const args = {
      limit: 10,
      skip: (this.page * 10) - 10,
      'language': this.language,
      category:this.QAcategoryId
    };
    
    this.listQuestions(args);
  }
  changePrimary(suQA:any,question:any){
    let args = {
      _id : question._id,
      sub_id: suQA._id,
      set_primary: true 
    }
    this.questionService.changePrimartQA(args).subscribe(data => {
      const args = {
        limit: 10,
        skip: (this.page * 10) - 10,
        'language': this.language,
        category:localStorage.getItem('category')
      };
      this.listQuestions(args);
    }, err => {
      this.questionError.status = true;
      this.questionError.message = 'No records found...';
    });
  }
  setbackup(questions){
   
    var duplicateObject = JSON.parse(JSON.stringify( questions ));
    this.QABackup = duplicateObject;
  }
  listQuestions(args) {
    console.log("---listQuestions1----", this.clickval);
    this.questionService.listQuestions(args).subscribe(data => {
      console.log("----wuqun---",data);
      this.questions = data.info && data.info.questions ? data.info.questions : [];
      this.setbackup(this.questions)
      this.totalCount = data.info && data.info.totalCount ? data.info.totalCount : 0;
      this.selectedQuestion.add = false;
      this.homeService.sendMessage({
        type: 'loader',
        showLoader: false
      });
      console.log("---start-deletesuccess------",this.deleteValue);
      if(this.clickval == 'edit'){
        console.log("===edit==");
        this.questions[this.indexes].show = true;
      }else if(this.clickval == 'subview' ){
        console.log("===subview==");
        this.questions[this.indexe2].isCollapsed = true;
      }else if(this.deleteValue == 'delete1'){
       
        this.questions[this.indexes].show = true;
        console.log("----deletesuccess------");
      }else if(this.deleteValue == 'delete2' ){
      
        this.questions[this.indexe2].isCollapsed = true;
      }else{
        console.log("----fnaldeletesuccess------");
        for(let i=0;i<this.questions.length;i++){
          this.questions[i].isCollapsed =false;
          this.questions[i].show = false;
        }
      }
      console.log("----QUESTIONS___------",this.questions);
     
    }, err => {
      console.log("----ERROR------");
      this.questionError.status = true;
      this.questionError.message = 'No records found...';
    });
  }

  highlightQuestion(question) {
   
    this.questions.map(item => item.highlight = false);
    const element = this.questions.find(item => item._id === question._id);
    element.highlight = true;
  }

  selectPermission(question, permission,index) {
    //console.log("--slectcomminSTART--");
    this.makeditable = [];
    if (this.QAtype) {
      const args = {
        limit: 10,
        skip: (this.page * 10) - 10,
        'language': this.language,
        category:this.QAcategoryId
      };
      this.listQuestions(args);
    }
    /*question.sub_question.forEach((item) => {
      this.makeditable.push(item._id);
    });*/
    if (this.userType === 'agent' && permission.action === 'view') {
      //console.log("-selectpermission view----");
      this.selectedQuestion._id = question._id;
      this.selectedQuestion.question = question.question;
      this.selectedQuestion.question_type = question.question_type;
      this.selectedQuestion.fetchData = question.fetch_api;
      this.selectedQuestion.article_id = question.article_id;
      this.selectedQuestion.sub_question = question.sub_question;
      this.selectedQuestion.created_on = question.created_on;
      this.selectedQuestion.approved_by = question.approved_by;
      this.selectedQuestion.approved = question.approved;
      this.selectedQuestion.category = question.category;
      this.selectedQuestion.created_by = question.created_by;
      question.sub_question.forEach((item, index) => {
        if (item.is_main_question) {
          this.main_qtn_status = index;
        }
        item.sub_question = item.sub_questions;
      });

      this.textAreas = question.sub_question;

      this.selectedQuestion.answer = question.answer;
      this.selectedQuestion.view = true;
      this.selectedQuestion.update = false;
      this.selectedQuestion.add = false;
      this.selectedQuestion.reject = false;
      this.selectedQuestion.approve = false;
    }
    if (this.userType === 'agent' && permission.action === 'add') {
      //console.log("-selectpermission addd----");
      this.selectedQuestion.view = false;
      this.selectedQuestion.update = true;
      this.selectedQuestion.add = true;

    }
    if (permission.action === 'editQuestion') {
      this.clicked1(index,"edit");
      this.selectedQuestion.update = true;
      this.flag = true;
      this.tempArray = [];
      this.tempArray = _.filter(this.textAreas, function (item) {
        return item.approve_status === 'delete';
      });

      this.textAreas = _.filter(this.textAreas, function (item) {
        return item.approve_status !== 'delete';
      });
    } else if (permission.action === 'view') {
      this.selectedQuestion._id = question._id;
      this.selectedQuestion.question = question.question;
      this.selectedQuestion.question_type = question.question_type;
      this.selectedQuestion.fetchData = question.fetch_api;
      this.selectedQuestion.article_id = question.article_id;
      this.selectedQuestion.sub_question = question.sub_question;
      this.selectedQuestion.created_on = question.created_on;
      this.selectedQuestion.approved_by = question.approved_by;
      this.selectedQuestion.approved = question.approved;
      this.selectedQuestion.category = question.category;
      this.selectedQuestion.created_by = question.created_by;
      question.sub_question.forEach((item, index) => {
        if (item.is_main_question) {
          this.main_qtn_status = index;
        }
        item.sub_question = item.sub_questions;
      });

      this.textAreas = question.sub_question;

      this.selectedQuestion.answer = question.answer;
      this.selectedQuestion.view = true;
      this.selectedQuestion.update = false;
      this.selectedQuestion.add = false;
      this.selectedQuestion.reject = false;
      this.selectedQuestion.approve = false;



    } else if (permission.action === 'deleteQuestion') {
      this.selectedQuestion = question;
      this.modalService.open(PromptModalComponent, {ariaLabelledBy: 'modal-basic-title', centered: true}).result.then((result) => {
        if (result === 'Yes') {
          this.questionService.deleteQuestions(question._id).subscribe(data => {
            if (data.status === 200) {
              this.toastr.info('', data.info);
            } else {
              this.toastr.error('', data.info);
            }
            this.pageChanged(this.page);
            this.cancelQuestion();
          }, err => {
            console.log('deleteQuestions', err);
            this.toastr.error('', 'Sorry, Something went wrong.');
          });
        }
      }, (reason) => {
      });
    } else if (permission.action === 'approveQuestion') {
      this.selectedQuestion._id = question._id;
      this.selectedQuestion.question = question.question;
      this.selectedQuestion.question_type = question.question_type;
      this.selectedQuestion.fetchData = question.fetch_api;
      this.selectedQuestion.article_id = question.article_id;
      this.selectedQuestion.sub_question = question.sub_question;
      question.sub_question.forEach((item, index) => {
        if (item.is_main_question) {
          this.main_qtn_status = index;
        }
        item.sub_question = item.sub_questions;
      });

      this.textAreas = question.sub_question;
      this.selectedQuestion.answer = question.answer;
      this.textAreas.forEach((item) => {
        if (item.approve_status === 'approved') {
          item.decline = 'Approved';
        } else if (item.approve_status === 'delete') {
          item.decline = 'Delete';
        } else {
          item.decline = 'Decline';
        }
      });
      this.reasonApproveStatus = false;
      this.selectedQuestion.comment = '';
      this.selectedQuestion.approve = true;
      this.selectedQuestion._id = question._id;
    } else if (permission.action === 'rejectQuestion') {
      this.selectedQuestion._id = question._id;
      this.selectedQuestion.question = question.question;
      this.selectedQuestion.answer = question.answer;
      this.selectedQuestion.view = false;
      this.selectedQuestion.reject = true;
      this.selectedQuestion.approve = false;
    }
    //console.log("slectcomminFInal");
  }

  searchQA(data) {
    const args = {

      data: data,
      'language': this.language
    };
    this.questionService.searchQA(args).subscribe((response: any) => {
      this.questions = response.info && response.info.questions ? response.info.questions : [];
      this.totalCount = response.info && response.info.totalCount ? response.info.totalCount : 0;
    });
  }

  declineText = function (id) {
    var flag = 0;

    this.textAreas.forEach((t) => {
      if (t._id === id) {
        if (t.decline === 'Declined' || t.decline === 'Decline') {
          t.decline = t.decline === 'Declined' ? 'Decline' : 'Declined';

        } else if (t.decline === 'Delete' || t.decline === 'Deleted') {

          t.decline = t.decline === 'Deleted' ? 'Delete' : 'Deleted';
        } else if (t.decline === 'Approved') {
          t.decline = 'Approved';

        }
      }
      if (t.decline === 'Declined') {
        flag++;
      }
    });

    if (flag > 0) {
      this.reasonApproveStatus = true;
      this.selectedQuestion.comment = '';
    } else {
      this.reasonApproveStatus = false;
      this.selectedQuestion.comment = '';
    }

  };

  cancelQuestion() {
    this.selectedQuestion = {
      _id: '',
      article_id: '',
      question_type: 'consumer',
      sub_question: [],
      status: '',
      fetchData: true,
      question: '',
      answer: '',
      comment: '',
      update: false,
      approve: false,
      view: false,
      add:false,
      reject: false,
      created_on:'',
      approved_by:{
        name:''
      },
      approved:'',
      category:'',
      created_by:'',
      isCollapsed:true,
      show:false
    };
    this.questions.map(item => item.highlight = false);
    this.textAreas = [{
      sub_question: '',
      is_main_question: false
    }];
  }

  approveQuestion(selectedQuestion) {

    var sub_questiondata = [];
    if (this.reasonApproveStatus && this.selectedQuestion.comment === '') {
      this.toastr.error('Please fill out the Reason');
    } else {
      selectedQuestion.sub_question.forEach((item) => {
        if (item.decline === 'Declined' || item.decline === 'Decline') {
          item.approve_status = item.decline === 'Decline' ? 'approved' : 'rejected';

        } else if (item.decline === 'Deleted') {

          item.approve_status = 'Deleted';
        } else if (item.decline === 'Approved') {
          item.approve_status = 'approved';

        } else if (item.decline === 'Delete') {
          item.approve_status = 'delete';

        }
        if (item.decline != 'Deleted') {
          sub_questiondata.push(item);
        }
      });
      this.selectedQuestion.sub_question = sub_questiondata;
      var data = this.selectedQuestion;

      data.comment = this.selectedQuestion.comment;

      var args = {
        _id: this.selectedQuestion._id,
        data: data
      };

      this.questionService.approveQuestion(args).subscribe(data => {
        if (data.status === 200) {
          this.toastr.info('', data.info);
          const args = {
            limit: 10,
            skip: (this.page * 10) - 10,
            'language': this.language,
            category:this.QAcategoryId
          };
          this.listQuestions(args);
        } else {
          this.toastr.error('', data.info);
        }
        this.pageChanged(this.page);
        this.cancelQuestion();
      }, err => {
        console.log('Handle question error', err);
        this.toastr.error('', 'Sorry, Something went wrong.');
      });


    }
  }
  clearText(upind:any){
    this.updateErrorMsg[upind] = "";
    this.tempVal = {};
    this.updatestatus[upind] = false
  }
  onKeydown1(event:any,value:any=[],id:any,upind:any) {
    console.log("===ONJYDOWN++");
    this.subquestions = [];
    this.updateErrorMsg[upind] = "";
    this.updatestatus[upind] = false
   

    if (event.key === "Enter") {
      this.questionService.addVarientQAValidation(value).subscribe(data => {
        console.log("===dte==",data);
        this.variant_question = "";
        if(data.status == 200){
          this.tempVal = {};
          this.updateErrorMsg[upind] = "";
          this.updatestatus[upind] = false
          this.subquestions.push({
            sub_questions: value,
            is_main_question: false,
            approve_status:'pending',
            localsaving:true
          }) ;
          this.model.sub_question = '';
          this.variant_question = '';
          this.tempVal = {};
          this.questions.find(item => item._id == id).sub_question.push(this.subquestions[0]);
        }else{
         
          this.updateErrorMsg[upind] = data.info;
          this.updatestatus[upind] = true
          console.log("===usperrr--",this.updateErrorMsg[upind]);
        }
        //this.listQuestions(args);
      }, err => {
        this.questionError.status = true;
        this.questionError.message = 'No records found...';
      });
      
      //this.questions[0].sub_questions.push(this.subquestions);
     
    }
  }
	onKeydown6(event:any,value:any=[],id:any) {
		if (event.key === "Enter") {
		  let arg = {
			_id: id,
			articleId: value
		  }
		  this.questionService.updateArticleid(arg).subscribe(data => {
			this.variant_question = "";
			if(data.status == 200){
			  
			  this.toastr.info('', data.info);
			}else{
			  this.toastr.error('', data.info);
			}
			//this.listQuestions(args);
		  }, err => {
			this.toastr.error('', 'Something went error');
		  });		 
		}
	  }
	  updateArticleId(value:any=[],id:any) {
		
		  let arg = {
			_id: id,
			articleId: value
		  }
		  this.questionService.updateArticleid(arg).subscribe(data => {
			this.variant_question = "";
			if(data.status == 200){
			  
			  this.toastr.info( data.info);
			}else{
			  this.toastr.error('', data.info);
			}
			//this.listQuestions(args);
		  }, err => {
			this.toastr.error('', 'Something went error');
		  });
		 
	  }

  clearvarientQA(){
    this.model.sub_question = '';
    this.addErrorMsg = "";
    this.addstatus = false
  }
  onKeydown(event:any,value:any=[],id:any) {
    console.log("ONKYEDAOWN-----");
    this.addErrorMsg = "";
    this.addstatus = false
    if (event.key === "Enter") {
      this.subquestions.push({
        sub_questions: '',
        is_main_question: false
      }) ;
      console.log("===");
      this.questionService.addVarientQAValidation(value).subscribe(data => {
        console.log("erroro1",data);
        this.variant_question = "";
        if(data.status == 200){
          this.addErrorMsg = "";
          this.addstatus = false
          this.subquestions.push({
            sub_questions: value,
            is_main_question: false
          }) ;
          this.subquestions.splice(this.subquestions.findIndex(item => item.sub_questions === ""), 1)
          //return array;
         
          
          this.model.sub_question = '';
          this.variant_question = '';
        }else{
          this.subquestions.splice(this.subquestions.findIndex(item => item.sub_questions === ""), 1)
         console.log("erroro",data);
          this.addErrorMsg = data.info;
          this.addstatus = true;
        }
        //this.listQuestions(args);
      }, err => {
        this.questionError.status = true;
        this.questionError.message = 'No records found...';
      });
      
    //}
     
    }
  }

  clearvarient(upind:any){
    this.errorMsg[upind] = "";
    this.errorstatus[upind] = false;
    this.tempVal = {};
  }

  onKeydown4(event:any,value,id:any,ind:any) {
    console.log("=====hai--");
    this.errorMsg[ind] = "";
    this.errorstatus[ind] = false;
    this.clickval = 'subview';
    if (event.key === "Enter") {
      let args = {
        _id: id,
        sub_question: value,
        status:'pending'
      }
      this.questionService.addVarientQA(args).subscribe(data => {
        console.log("===err",data);
        this.variant_question = "";
        if(data.status == 200){
          this.tempVal = {};
          this.errorMsg[ind] = "";
          this.errorstatus[ind] = false;
          const args = {
            limit: 10,
            skip: (this.page * 10) - 10,
            'language': this.language,
            category:localStorage.getItem('category')
          };
         
            this.listQuestions(args);
        
        }else{
          this.errorMsg[ind] = data.info;
          this.errorstatus[ind] = true;
        }
        //this.listQuestions(args);
      }, err => {
        this.questionError.status = true;
        this.questionError.message = 'No records found...';
      });
      //this.questions.find(item => item._id == id).sub_question.push(this.subquestions[0]);
      //this.questions[0].sub_questions.push(this.subquestions);
    
    }
  }
  subqaremove(value:any,questionvalue:any,deleteval:any){
   
    var newArray = this.questions.filter(function(order) {
      let idx = order.sub_question.findIndex(x =>  x._id == value);
   
     // if(questionvalue.approve_status == "rejected"){
        order.sub_question.splice(idx,1);
       return order.sub_question;
    // }
      
    });
    let quest = newArray.filter(order => order._id == questionvalue._id);
    this.clickval = '';
    this.deleteValue = deleteval;
    this.updateQuestion(quest[0]);   

  
  
}




  subqaApproveremove(value:any,questionvalue:any,deleteval:any){
    questionvalue.sub_question.filter(function(order) {
      if(order._id == value){
        return order.approve_status = 'delete'
      }
       
      
    });
    
    let quest = questionvalue;
    this.clickval = '';
    this.deleteValue = deleteval;
    this.updateQuestion(quest);  

  }
  subqaremovelocaly(value:any){
    this.subquestions = this.subquestions.filter(order => order.sub_questions !== value);        
    
  }
  
  handleQuestion(selectedQuestion) {
    console.log("handle");
	if(selectedQuestion.fetchData == false){
        selectedQuestion.question_type = 'static';
		let dt = new Date().toString();
		let seed = Date.parse(dt);;
		let holdrand = ((seed * 214013 + 2531011) >> 16) & 0x7fff; 
		let holdrand2 = ((holdrand * 214013 + 2531011) >> 16) & 0x7fff;
		if(selectedQuestion.article_id == undefined || selectedQuestion.article_id == null){
			selectedQuestion.article_id = 'label.ue.smartbutler-'+holdrand2+'static';
		}		
    }
	if(selectedQuestion.fetchData === true){
		selectedQuestion.question_type = 'dynamic';
	}
	if(selectedQuestion.fetchData === true && (selectedQuestion.article_id == undefined || selectedQuestion.article_id == null)){
      this.toastr.error('', 'Please add article id');	  
    }else{
      console.log("handle1");     
      this.subquestions.push({
        sub_questions: selectedQuestion.question,
        is_main_question: true
      })
      console.log("handle2");
      const args = {
        _id: selectedQuestion._id,
        question: selectedQuestion.question,
        status: 'pending',
        sub_question: this.subquestions,
        answer: selectedQuestion.answer,
        article_id: selectedQuestion.article_id,
        fetch_api: selectedQuestion.fetchData,
        question_type: selectedQuestion.question_type,
        comment: selectedQuestion.comment,
        language:this.language
      };
      console.log("CheckTypeOfValue-----",args);
     
      let handle;
      if (this.userType === 'agent') {
        if (selectedQuestion.update) {
          handle = 'update';
        } else {
          handle = 'create';
        }
      } else {
        handle = selectedQuestion.reject ? 'reject' : 'approve';
      }
      if (args.question === '' && args.sub_question.length === 0 && this.userType === 'agent') {
        this.toastr.error('', 'Please fill out the question');
      } else if (args.answer === '' && this.userType === 'agent') {
        this.toastr.error('', 'Please fill out the answer');
      } else {
        this.questionService.questionHandle(args, handle).subscribe(data => {
          if (data.status === 200) {
            this.model= {
              sub_question:"",
              question:""
          
          };
          this.subquestions = [];
            this.flag = false;
            this.makeditable = [];
            const args = {
              limit: 10,
              skip: (this.page * 10) - 10,
              'language': this.language,
              category:this.QAcategoryId
            };
            this.selectedQuestion.view = true;
            this.selectedQuestion.approve = false;
            this.selectedQuestion.add = false;
            this.model.fetchData=false;
            this.listQuestions(args);
            this.toastr.info('', data.info);
          } else {
            this.toastr.error('', data.info.message);
          }
          this.pageChanged(this.page);
          this.cancelQuestion();
        }, err => {
          console.log('Handle question error', err);
          this.toastr.error('', 'Sorry, Something went wrong.');
        });
      }
    }


  }

  searchQuestions(args,term){
    if(term !== undefined){
    this.questionService.searchQuestions(args,term).subscribe(data => {
      
      if (data.status === 200) {
        this.questions = data.info && data.info.questions ? data.info.questions : [];
        this.totalCount = data.info && data.info.totalCount ? data.info.totalCount : 0;
        if(this.clickval == 'edit' ){
          this.questions[this.indexes].show = true;
        }else if(this.clickval === 'subview' ){
          this.questions[this.indexe2].isCollapsed = true;
        }else{
          for(let i=0;i<this.questions.length;i++){
            this.questions[i].isCollapsed =false;
            this.questions[i].show = false;
          }
        }
      } else {
        this.toastr.error('', data.info);
      }
     
      
    }, err => {
      console.log('Handle question error', err);
      //this.toastr.error('', 'Sorry, Something went wrong.');
    });
  }
  }

  updateQuestion(selectedQuestion) {
    this.selectedQuestion.add = false;
    let changingValues = this.QABackup.filter(x => x._id === selectedQuestion._id);
    console.log("changingValues",changingValues);
     let s = selectedQuestion.sub_question.filter(o => o.deleteSub === 'newDelete');
    let r = selectedQuestion.sub_question.filter(o => !changingValues[0].sub_question.find(o2 => o._id === o2._id))
    let t = changingValues[0].sub_question.filter(o => !selectedQuestion.sub_question.find(o2 => o._id === o2._id))
    let args;

    if(s.length !== 0){
      args = {
        _id: selectedQuestion._id,
        question: selectedQuestion.question,
        status: 'pending',
        sub_question: selectedQuestion.sub_question,
        answer: selectedQuestion.answer,
        article_id: selectedQuestion.article_id,
        question_type: selectedQuestion.question_type,
        fetch_api: selectedQuestion.fetch_api,
        comment: selectedQuestion.comment,
        category: selectedQuestion && selectedQuestion.category && selectedQuestion.category._id ? selectedQuestion.category._id : null
      };
    }else if(r.length !== 0 && t.length !== 0 ){
      args = {
        _id: selectedQuestion._id,
        question: selectedQuestion.question,
        status: 'pending',
        sub_question: selectedQuestion.sub_question,
        answer: selectedQuestion.answer,
        article_id: selectedQuestion.article_id,
        question_type: selectedQuestion.question_type,
        fetch_api: selectedQuestion.fetch_api,
        comment: selectedQuestion.comment,
        category: selectedQuestion && selectedQuestion.category && selectedQuestion.category._id ? selectedQuestion.category._id : null
      };
    }else if(((changingValues[0].answer !== selectedQuestion.answer) || (changingValues[0].category !== selectedQuestion.category) || (changingValues[0].fetch_api !== selectedQuestion.fetch_api) || (changingValues[0].question_type !== selectedQuestion.question_type)) &&(changingValues[0].question == selectedQuestion.question ) ){
       args = {
        _id: selectedQuestion._id,
        question: selectedQuestion.question,
        sub_question: selectedQuestion.sub_question,
        answer: selectedQuestion.answer,
        article_id: selectedQuestion.article_id,
        question_type: selectedQuestion.question_type,
        fetch_api: selectedQuestion.fetch_api,
        comment: selectedQuestion.comment,
        category: selectedQuestion && selectedQuestion.category && selectedQuestion.category._id ? selectedQuestion.category._id : null
      };
    }else{
       args = {
        _id: selectedQuestion._id,
        question: selectedQuestion.question,
        status: 'pending',
        sub_question: selectedQuestion.sub_question,
        answer: selectedQuestion.answer,
        article_id: selectedQuestion.article_id,
        question_type: selectedQuestion.question_type,
        fetch_api: selectedQuestion.fetch_api,
        comment: selectedQuestion.comment,
        category: selectedQuestion && selectedQuestion.category && selectedQuestion.category._id ? selectedQuestion.category._id : null
      };
    }
    /*this.textAreas.forEach((item, index) => {

      if (item.sub_question !== '') {
        item.sub_questions = item.sub_question;
        selectedQuestion.question = item.sub_question;
        this.selectedQuestion.question = selectedQuestion.question;
        item.is_main_question = !!(this.main_qtn_status === index);

      }
    });*/
    //this.mergeArray = _.union(this.textAreas, this.tempArray);
    
    let handle;
    if (this.userType === 'agent') {
        handle = 'update';
    } else {
      handle = selectedQuestion.reject ? 'reject' : 'approve';
    }
    if (args.question === '' && args.sub_question.length === 0 && this.userType === 'agent') {
      this.toastr.error('', 'Please fill out the question');
    } else if (args.answer === '' && this.userType === 'agent') {
      this.toastr.error('', 'Please fill out the answer');
    } else {
      this.questionService.questionHandle(args, handle).subscribe(data => {
        if (data.status === 200) {
          this.flag = false;
          this.makeditable = [];
          const args = {
            limit: 10,
            skip: (this.page * 10) - 10,
            'language': this.language,
            category:this.QAcategoryId
          };
          this.clickval ='update';
          this.selectedQuestion.add = false;
          
          if(this.search == ""){
            this.listQuestions(args);
          }else{
            this.searchQuestions(args,this.search);
          }
         
          this.toastr.info('', data.info);
        } else {
          this.toastr.error('', data.info);
        }
        this.pageChanged(this.page);
        this.cancelQuestion();
      }, err => {
        this.toastr.error('', 'Sorry, Something went wrong.');
      });
    }


  }

  handleAssignee(question) {
    const args = {
      'assign_to': question.assigned_to._id,
      '_id': question._id
    };
    this.questionService.questionHandle(args, 'assign').subscribe(data => {
      if (data.status === 200) {
        this.toastr.info('', data.info);
      } else {
        this.toastr.error('', data.info);
      }
      
      this.pageChanged(this.page);
      this.cancelQuestion();
    }, err => {
      console.log('Handle question error', err);
      this.toastr.error('', 'Sorry, Something went wrong.');
    });
  }


}
