import { Component, OnInit, Inject } from '@angular/core';
import { RegisterService } from './register.service';
import * as moment from 'moment';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogOverviewComponent } from './dialog.component';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-US'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class RegisterComponent implements OnInit {
  rooms: any = [];
  countryCode = 'in';
  roomNumber = '';
  date1;
  date2;
  minDate2;
  today = new Date();
  user = {
    name: '',
    phoneNo: null
  };
  phoneNumberValid = false;
  message = {
    status: false,
    type: 'error',
    text: ''
  };
  namePrefixes = ['Mr.', 'Mrs.', 'Ms.'];
  namePrefix;

  constructor(private registerService: RegisterService, public snackBar: MatSnackBar,
    public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.namePrefix = this.namePrefixes[0];
    this.registerService.getIp().subscribe(ip => {
      console.log('ip', ip);
      this.countryCode = ip.country.toLowerCase();
    }, error => {
      console.log('Ip ger error', error);
      this.countryCode = 'us';
    });
  }

  ngOnInit() {
    sessionStorage.clear();
    this.date1 = new Date();
    const tenFactor = moment().minute() - moment().minute() % 10;
    this.date1 = moment().minutes(tenFactor).toDate();
    this.date2 = moment(this.date1).add(1, 'days').toDate();
    this.date2 = moment(this.date2).set({ hours: 12, minutes: 0, seconds: 0 }).toDate();
    this.minDate2 = this.date2;


    this.route.queryParams.subscribe(queryParams => {
      console.log('queryParams', queryParams);
      let sandbox = true;
      if (queryParams.sandbox) {
        sandbox = queryParams.sandbox === 'true';
      }
      this.registerService.listRooms({ sandbox }).subscribe(data => {
        this.rooms = data.rooms;
      }, error => {
        console.log(error);
      });
    });


  }

  checkOut() {
    this.registerService.unAllocateRoom({ 'room_number': this.roomNumber }).subscribe(data => {
      this.snackBar.open(data.message, 'Close', {
        duration: 10000,
      });
    }, error => {
      console.log('checkOut error', error);
      const errorMessage = error.error && error.error.message ?
        error.error.message : 'Sorry, Something went wrong.';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 10000,
      });
    });
  }

  setTime1(data) {
    this.date1 = moment(this.date1).set({ hours: 0, minutes: 0 }).toDate();
    const tempDate = data.split(' ');
    let addHour = 0;
    if (tempDate[1] === 'pm') {
      addHour = 12;
    }
    const times = tempDate[0].split(':');
    this.date1 = moment(this.date1).add(parseInt(times[0], 10) + addHour, 'hours')
      .add(parseInt(times[1], 10), 'minutes').toDate();
    console.log(this.date1);
  }

  setTime2(data) {
    this.date2 = moment(this.date2).set({ hours: 0, minutes: 0 }).toDate();
    const tempDate = data.split(' ');
    let addHour = 0;
    if (tempDate[1] === 'pm') {
      addHour = 12;
    }
    const times = tempDate[0].split(':');
    this.date2 = moment(this.date2).add(parseInt(times[0], 10) + addHour, 'hours')
      .add(parseInt(times[1], 10), 'minutes').toDate();
    console.log(this.date2);
  }

  // Change date2 when date1 changes for validation
  changeDate1(event: MatDatepickerInputEvent<Date>) {
    this.date2 = moment(event.value).add(1, 'days').toDate();
    this.minDate2 = this.date2;
  }

  registerRoom() {
    if (this.roomNumber === '') {
      this.message.status = true;
      this.message.text = 'Please select a room number';
    } else if (this.user.name === '') {
      this.message.status = true;
      this.message.text = 'Please enter user name';
    } else if (!this.phoneNumberValid) {
      this.message.status = true;
      this.message.text = 'Invalid phone Number.';
    } else {
      this.message.status = false;
      this.message.text = '';
      const noPrefixNo = this.user.phoneNo.replace('+', '');
      const args = {
        name: this.user.name,
        prefix: this.namePrefix,
        phone_no: noPrefixNo,
        check_in: this.date1.toJSON(),
        check_out: this.date2.toJSON(),
        room_number: this.roomNumber,
        country_code: '91',
        zone: 'Asia/Calcutta'
      };

      this.registerService.roomUserList(args).subscribe(roomsArray => {
        if (roomsArray.length) {
          console.log('1111111',roomsArray[0]);
          const allotedNumber = '+' + roomsArray[0].country_code + ' ' +
            roomsArray[0].phone_no.slice(roomsArray[0].country_code.length);

          const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '450px',
            data: { allotedNumber }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.guestRegister(args);
            }
          });
        } else {
          this.guestRegister(args);
        }
      }, error => {
        console.log('roomUserList error', error);
      });
    }
  }

  guestRegister(args) {
    this.registerService.guestRegister(args).subscribe(data => {
      sessionStorage.setItem('successMessage', data.info);
      this.router.navigate(['/register/success']);
    }, error => {
      console.log('guestRegister error', error);
    });
  }

  changePhoneNo() {
    const phoneNumber = parsePhoneNumberFromString(this.user.phoneNo);
    if (phoneNumber && phoneNumber.isValid()) {
      this.phoneNumberValid = true;
    } else {
      this.phoneNumberValid = false;
    }
  }

}

