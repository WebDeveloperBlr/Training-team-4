import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

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

}
