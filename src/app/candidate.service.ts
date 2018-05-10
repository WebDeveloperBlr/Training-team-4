import {Injectable} from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Candidate } from './candidate';
import {hasOwnProperty} from 'tslint/lib/utils';
import {NotifCandidate} from './interfaces/notifCandidate';
import {catchError} from 'rxjs/operators';

@Injectable()
export class CandidateService {
  private URLforNewCandidates = 'http://localhost:8080/getNewCandidates';
  private URL = 'http://localhost:8080/candidatesAsync';
  public cache;
  public currentOffset: number;
  public currentLimit: number;
  private MockData;
  private data = new BehaviorSubject(undefined);
  private candidateData = new BehaviorSubject(undefined);

  constructor(private http: HttpClient) {
  }

  barOpened: boolean = false;

  toggleSideBar() {
    if (this.barOpened)
      this.barOpened = false;
    else
      this.barOpened = true;
  }

  getCandidates(limit: number = 10, offset: number = 1, filterObj?: any): Observable<any> {

    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit || filterObj) {
      let params = new HttpParams();
      params = params.append('currentPage', offset.toString());
      params = params.append('limit', limit.toString());
      if( filterObj ) {
        params = params.append('filter', JSON.stringify(filterObj));
      }
      this.http.get(this.URL,{ params: params }).subscribe(
        (data: any) => {
          this.data.next(data);
        }
      );
      this.currentOffset = offset;
      this.currentLimit = limit;
    }
    return this.data.asObservable();
  }

  update(id: number, candidate: Candidate): void {
    console.log(this.URL + '/' + id);
    const candidateString = JSON.stringify(candidate);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    console.log(candidate);
    this.http.put(this.URL + '/' + id, candidate).subscribe();
  };

  getNewCandidates(): Observable<NotifCandidate[]> {
    return this.http.get<NotifCandidate[]>(this.URLforNewCandidates);
  }


  getCandidate(id: number, position?: any): Observable<any>{
    let params = new HttpParams();
    if( position ){
      params = params.append('position', position);
    }
    const getCand = new Promise(res => {
      this.http.get(this.URL + '/' + id, {params: params})
        .subscribe((data) => {
          this.candidateData.next(data);
          res();
        });
    });
    getCand.then(() => {
      return this.candidateData.asObservable();
    });
    return this.candidateData.asObservable();
  }


}
