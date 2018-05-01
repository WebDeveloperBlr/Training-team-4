import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../candidate.service";
import {NotifCandidate} from "../interfaces/notifCandidate";
import {EventsService} from "../events.service";
import{NextEvent} from "../interfaces/NextEvent";

@Component({
  selector: 'app-notifications-bar',
  templateUrl: './notifications-bar.component.html',
  styleUrls: ['./notifications-bar.component.scss',
              '../../assets/css/libs.css',
              '../../assets/css/main.css']
})



export class NotificationsBarComponent implements OnInit {

  constructor(private candidateService:CandidateService,
              private eventsService:EventsService) { }

  newCandidates:NotifCandidate[];
  nextEvents:NextEvent[]=[];
  that:NotificationsBarComponent=this;
  ngOnInit() {
    this.eventsService.getNextInterviews()
      .subscribe((data:NextEvent[])=>{
        for(let i:number=0;data.length;i++){
          data[i].dateStart=data[i].dateStart.split('T')[0]+"T"+data[i].timeStart;
          data[i].timeEnd="2018-05-04T"+data[i].timeEnd;
          this.nextEvents.push(data[i]);
        }
      });
    this.candidateService.getNewCandidates()
      .subscribe(data => this.newCandidates=data);
  }

  toggleSideBar(){
    this.candidateService.toggleSideBar();
  }
}
