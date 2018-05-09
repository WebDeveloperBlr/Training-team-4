import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MessageService } from './message.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class VacanciesService {

  private URL = 'http://localhost:8080/vacancies';
  cache = {};
  data = new BehaviorSubject(undefined);
  currentOffset: number;
  currentLimit: number;

  constructor(private http: HttpClient) { }

  getAll(limit: number = 10, offset: number = 1, filterObj?: any): Observable<any> {
    console.log(filterObj);
    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit || filterObj) {
      let params = new HttpParams();
      params = params.append('currentPage', offset.toString());
      params = params.append('limit', limit.toString());
      if(filterObj) {
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
  getMockAll(limit: number = 10, offset: number = 1, filterObj?: any): Observable<any>{

    if ( !this.data || this.currentOffset !== offset || this.currentLimit !== limit || filterObj) {

      this.http.get('assets/json/vacancies.json').subscribe(
        (data: any) => {
          const newData = [];
          if(filterObj && filterObj.id_status && filterObj.id_status!=='Any'){

            let filteredData = [];
            filteredData = data.docs.filter(val => val.status === filterObj.id_status);
            data.docs = filteredData;

          }
          for (let i = (offset - 1) * limit; i < (offset - 1) * limit + limit; i++) {
            if (data.docs[i]) {
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

}
