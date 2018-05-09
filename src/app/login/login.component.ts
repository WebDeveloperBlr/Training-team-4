import { Component, OnInit } from '@angular/core';
import {UserLogin} from '../interfaces/UserLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user:UserLogin={
    login:"",
    password:""
  };

  constructor( ) {
  }

  ngOnInit() {
  }


  onSubmit(){
    alert('lol');
  }

  loginInput() {

  }
}
