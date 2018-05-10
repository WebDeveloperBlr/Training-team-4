import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../interfaces/UserLogin';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService,
              private router:Router) { }
  user:UserLogin={
    login:"",
    password:""
  };

  mistake:boolean=false;

  ngOnInit() {
  }


  onSubmit(){
      this.authService.signIn(this.user).subscribe((data) => {
        if(data==true){
          this.router.navigate(["/interviews"]);
        }else {
          this.mistake=true;
          this.router.navigate(["/login"]);
        }
      });
  }

  loginInput() {

  }
}
