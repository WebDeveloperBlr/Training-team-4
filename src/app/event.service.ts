import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {NextEvent} from './interfaces/NextEvent';
import 'rxjs/add/observable/of';
import {Post} from './interfaces/Post';

@Injectable()
export class EventService {
  constructor(private http: HttpClient) {}

  private nextInterviewURL = 'http://localhost:8080/getNextInterviews';
  private calendarEventsURL = 'http://localhost:8080/getEvents';
  private insertCalendarEventURL="http://localhost:8080/eventCreate";
  private getInterviewersURL="http://localhost:8080/getInterviewers";
  private getCandidatesURL="http://localhost:8080/getCandidates";

  showedNew:boolean=false;
  showedEdit:boolean=false;

  getNextInterviews(): Observable<NextEvent[]> {
    return this.http.get<NextEvent[]>(this.nextInterviewURL);
  }

  getEvents(): Observable<any> {
    return this.http.get<any>(this.calendarEventsURL);
  }

  insertEvent(title:string, start:string){
    const data:Post={
      title:title,
      start:start
    };
    this.http.post(this.insertCalendarEventURL, data).subscribe( ()=>{});
  }
  closeNew(){
    this.showedNew=false;
  }

  openNew(){
    this.showedNew=true;
  }

  closeEdit(){
    this.showedEdit=false;
  }

  openEdit(){
    this.showedEdit=true;
  }

  getInterviewers():Observable<any>{
    return this.http.get<any>(this.getInterviewersURL);
  }

  getCandidates():Observable<any>{
    return this.http.get<any>(this.getCandidatesURL);
  }

}
