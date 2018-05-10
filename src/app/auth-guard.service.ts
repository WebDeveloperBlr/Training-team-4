import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //
  //   // let url: string = state.url;
  //   // this.authService.checkPermission().subscribe((answer)=>{
  //   //   if(answer=="true")
  //   //     this.router.navigate([route]);
  //   //   if(answer=="false") {
  //   //     this.router.navigate(['/login']);
  //   //     return false;
  //   //   }
  //   // });
  //
  //   // return this.checkLogin(url);
  // }
  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean> {
    return this.authService.checkPermission().map((auth) => {
      if (auth) {
        console.log('authenticated');
        return true;
      }
      console.log('not authenticated');
      this.router.navigate(['/login']);
      return false;
    }); // this might not be necessary - ensure `first` is imported if you use it
  }

  checkLogin(url: string): boolean {
    if(this.authService.isLoggedIn=="true")
      return true;
    else {
      this.router.navigate(['/login']);
      return false;
    }
    }

    signIn(){

    }

  }


