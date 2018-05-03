import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';


@Injectable()
export class EventService {
  public getEvents(): Observable<any> {
    const dateObj = new Date();
    const yearMonth = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
    let data: any = [
      {
      title: 'All Day Event',
      start: yearMonth + '-01'
      },
      {
        title: 'Long Event',
        start: yearMonth + '-07',
        end: yearMonth + '-10'
      },
      {
        title: 'Conference',
        start: yearMonth + '-11',
        end: yearMonth + '-13'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: yearMonth + '-28'
      }];
    return Observable.of(data);
  }
}
