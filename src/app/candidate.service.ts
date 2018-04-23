import {Injectable} from '@angular/core';
import {Candidate} from './candidate';
import {CANDIDATES} from './mock-candidates';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class CandidateService {
  private URL = '/candidates';
  public cache;
  public currentOffset: number;
  public currentLimit: number;
  private MockData;

  private data = new BehaviorSubject(undefined);


  getCandidates() {
    /*return CANDIDATES;*/
    if(!this.cache) {
      this.cache = this.http.get(this.URL);
    }
    return this.cache;
    //return this.http.get(this.URL);
  }

  getMockCandidates(limit: number = 10, offset: number = 1): Observable<any> {
    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit) {
      this.cache = this.http.get('assets/json/candidates.json').subscribe(
        (data: any) => {

          const newData = [];


          for (let i = (offset - 1) * limit; i < (offset - 1) * limit + limit; i++) {
            console.log(`for i = ${(offset - 1) * limit} ; i < ${limit + limit}`);
            console.log('fired');
            if(data.docs[i]){
              newData.push(data.docs[i]);
            }
          }
          data.docs = newData;
          console.log('limit = ' + limit);
          console.log('offset = ' + offset);
          console.log(newData);
          this.data.next(data);
        }
      );
      this.currentOffset = offset;
      this.currentLimit = limit;
      console.log(this.cache);
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

  constructor(
    private messageService: MessageService,
    private http: HttpClient) {
  }

  /** Log a CandidateService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CandidateService: ' + message);
  }

}
