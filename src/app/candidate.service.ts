import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {hasOwnProperty} from 'tslint/lib/utils';


@Injectable()
export class CandidateService {
  private URL = 'http://localhost:8080/candidates';
  public cache;
  public currentOffset: number;
  public currentLimit: number;
  private MockData;

  private data = new BehaviorSubject(undefined);

  constructor(
    private messageService: MessageService,
    private http: HttpClient) {
  }

  barOpened:boolean=false;

  toggleSideBar(){
    if(this.barOpened)
      this.barOpened=false;
    else
      this.barOpened=true;
  }

  getCandidates(limit: number = 10, offset: number = 1, filterObj?: any): Observable<any> {

    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit || filterObj) {
      let params = new HttpParams();
      params = params.append('currentPage', offset.toString());
      params = params.append('limit', limit.toString());
      if( filterObj ) {
        console.log(filterObj);
        params = params.append('filter', JSON.stringify(filterObj));
      }

      this.http.get(this.URL,{ params: params }).subscribe(
        (data: any) => {
          const newData = [];
          this.data.next(data);
        }
      );
      this.currentOffset = offset;
      this.currentLimit = limit;
    }
    return this.data.asObservable();
  }

  getMockCandidates(limit: number = 10, offset: number = 1, filterObj?: any): Observable<any> {
    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit || filterObj) {
      this.http.get('assets/json/candidates.json').subscribe(
        (data: any) => {
          const newData = [];
          if(filterObj && filterObj.statusName && filterObj.statusName!=='Any'){
            let filteredData = [];
            filteredData = data.docs.filter(val => val.status === filterObj.statusName);
            data.docs = filteredData;
          }
          for (let i = (offset - 1) * limit; i < (offset - 1) * limit + limit; i++) {
            if(data.docs[i]){
              newData.push(data.docs[i]);
            }
          }
          data.docs = newData;
          this.data.next(data);
        }
      );
      this.currentOffset = offset;
      this.currentLimit = limit;
    }
    return this.data.asObservable();
  }

  getLimitFromJson(data: object[], limit: number, offset: number): object[]{
    const newData = [];
    for (let i = (offset - 1) * limit; i < (offset - 1) * limit + 10; i++) {
      if(data[i] !== undefined){
        newData.push(data[i]);
      }
    }
    return newData;
  }

  getCandidate(id: number){
    return this.http.get(this.URL + '/' + id);
  }


  /** Log a CandidateService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CandidateService: ' + message);
  }

}
