import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {tap,delay} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}

  signUpURL="http://localhost:8080/registration";
  signInURL="http://localhost:8080/authentication";
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = false)
    );
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  signUp(user):Observable<any>{
    return this.http.post<any>(this.signUpURL,{password:user.password,login:user.login});
  }

  signIn(user):Observable<any>{
    return this.http.post<any>(this.signInURL,{userLogin:user.login,userPassword:user.password});
  }
}
