import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../interfaces/UserLogin';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService:AuthService) { }
  user:UserLogin={
    login:"",
    password:""
  };


  ngOnInit() {
  }


  onSubmit(){
      this.authService.signIn(this.user).subscribe((data) => {});
  }

  loginInput() {

  }
}
