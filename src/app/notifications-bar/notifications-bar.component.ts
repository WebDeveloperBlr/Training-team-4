import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../candidate.service";
import {NotifCandidate} from "../interfaces/notifCandidate";
import {EventsService} from "../events.service";
import{NextEvent} from "../interfaces/NextEvent";
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-notifications-bar',
  templateUrl: './notifications-bar.component.html',
  styleUrls: ['./notifications-bar.component.scss',
              '../../assets/css/libs.css',
              '../../assets/css/main.css'],
  animations:[
    trigger('fade',[
      transition('void => *',[
        style({
          opacity:0
        }),
        animate(2000, style({backgroundColor:"white", opacity:1}))
      ]),
      transition('* => void',[
        animate(400, style({transform:"translateX(150%)"}))
      ])
    ])
  ]
})



export class NotificationsBarComponent implements OnInit {

  constructor(private candidateService:CandidateService,
              private eventsService:EventsService) { }

  cacheCandidates:NotifCandidate[]=[];
  newCandidates:NotifCandidate[]=[];
  cacheEvents:NextEvent[]=[];
  nextEvents:NextEvent[]=[];
  that:NotificationsBarComponent=this;
  ngOnInit() {
    this.eventsService.getNextInterviews()
      .subscribe((data:NextEvent[])=>{
        data=data.sort(function(a:NextEvent,b:NextEvent){
          return <any>(new Date(a.dateStart))- <any>(new Date(b.dateStart))
        });
        let count:number=0;
        for(let i:number=0;i<data.length;i++){
            data[i].dateStart = data[i].dateStart.split('T')[0] + "T" + data[i].timeStart;
            if( (<any>(new Date () ) - <any>(new Date (data[i].dateStart) ) )<0 ) {
              data[i].timeEnd = "2018-05-04T" + data[i].timeEnd;
              if(count<3){
                this.nextEvents.push(data[i]);
                count++
              }
              else
                this.cacheEvents.push(data[i]);
            }
        }
      });
    this.candidateService.getNewCandidates()
      .subscribe((data:NotifCandidate[])=>{
        for(let i=0;i<data.length;i++){
          if(i<3)
            this.newCandidates.push(data[i]);
          else
            this.cacheCandidates.push(data[i]);
        }
      });
  }

  seeAllCands(){
    this.newCandidates=this.newCandidates.concat(this.cacheCandidates);
  }

  seeAllEvents(){
    this.nextEvents=this.nextEvents.concat(this.cacheEvents);
  }

  toggleSideBar(){
    this.candidateService.toggleSideBar();
  }
  removeCand(num: number){
    this.newCandidates.splice(num,1);
  }

  removeEvent(num:number){
    this.nextEvents.splice(num,1);
  }
}
