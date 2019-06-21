import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToGo'
})
export class DateToGoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let today: any = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;
    const date2 = new Date(today);
    const date1 = new Date(value);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const minutesDifference = Math.ceil(timeDiff / (1000 * 3600 * 1));
    if (dayDifference > 1) {
      return dayDifference + ' days ago';
    } else {
      return minutesDifference + ' minutes ago';
    }
  }

}
