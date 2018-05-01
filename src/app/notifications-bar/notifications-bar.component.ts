import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../candidate.service";

@Component({
  selector: 'app-notifications-bar',
  templateUrl: './notifications-bar.component.html',
  styleUrls: ['./notifications-bar.component.scss',
              '../../assets/css/libs.css',
              '../../assets/css/main.css']
})



export class NotificationsBarComponent implements OnInit {

  constructor(private candidateService:CandidateService) { }

  ngOnInit() {
  }

  toggleSideBar(){
    this.candidateService.toggleSideBar();
  }
}
