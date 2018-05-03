import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NextEvent} from './interfaces/NextEvent';

@Injectable()
export class EventsService {

  constructor(private http: HttpClient) {
  }

  private nextInterviewURL = '/getNextInterviews';

  getNextInterviews(): Observable<NextEvent[]> {
    return this.http.get<NextEvent[]>(this.nextInterviewURL);
  }
}
