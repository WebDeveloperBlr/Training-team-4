import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../interfaces/UserLogin';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService:AuthService) { }
  userToRegister:UserLogin={
    login:"",
    password:""
  };
  repeatedPas:string="";
  registered:number=2;

  equalPasswords:boolean=false;
  hasForbiddenSigns:boolean=false;
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
  signUp(registerForm:any) {
      this.authService.signUp(this.userToRegister).subscribe((data)=>{
        if(data==true)
          this.registered=1;
        else
          this.registered=0;
      });
      alert("reset");
      registerForm.resetForm();
      this.equalPasswords=false;
      this.hasForbiddenSigns=false;
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

