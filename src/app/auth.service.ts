import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {tap,delay} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  signUpURL="http://localhost:8080/registration";
  signInURL="http://localhost:8080/authentication";
  checkPermissionURL="http://localhost:8080/checkPermission";
  isLoggedIn:string="false";

  // store the URL so we can redirect after logging in
  redirectUrl: string;


  checkPermission(){

    return this.http.get<any>(this.checkPermissionURL,{withCredentials:true});
  }

// .subscribe((answer)=>{this.isLoggedIn=answer})

  signUp(user):Observable<any>{
    return this.http.post<any>(this.signUpURL,{password:user.password,login:user.login},{withCredentials:true});
  }

  signIn(user):Observable<any>{
    return this.http.post<any>(this.signInURL,{userLogin:user.login,userPassword:user.password},{withCredentials:true});
  }
}
