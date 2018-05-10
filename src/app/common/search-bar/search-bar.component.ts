import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../../candidate.service";
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  constructor(private candidateService:CandidateService,
              private authService:AuthService,
              private router:Router) { }

  ngOnInit() {
  }

  logOut(){
    this.authService.isLoggedIn="false";
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  toggleSideBar(){
    this.candidateService.toggleSideBar();
  }
}
