import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../interfaces/UserLogin';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  userToRegister:UserLogin={
    login:"",
    password:""
  };
  repeatedPas:string="";

  equalPasswords:boolean=false;
  hasForbiddenSigns:boolean=false;
  constructor() { }
  loginInp: string;
  passwordInp: string;
  paswordRepInp: string;
  arrow;
  registerForm;
  regInfo = {};
  regCount = 0;

  isError: boolean;

  ngOnInit() {
  }
  signUp() {
      alert("signed");
  }
  loginInput() {}

  showError() {
    this.isError = true;
  }

  checkIfEqual(){
    if(this.userToRegister.password==this.repeatedPas){
      this.equalPasswords=true;
    }else{
      this.equalPasswords=false;
    }
    console.log(this.equalPasswords);
  }

  checkOnForbiddenSigns(){
    if(this.userToRegister.login.search(/\W/) != (-1)){
      this.hasForbiddenSigns=true;}
    else
    {this.hasForbiddenSigns=false;}
  }
}
// <div #popups class="login-form__text">Please, repeat your password</div><span class="decor opacity-0"></span>
