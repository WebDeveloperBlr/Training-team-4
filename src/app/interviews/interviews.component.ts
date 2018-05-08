import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventService } from '../event.service';
import {StartDate} from '../interfaces/StartDate';
import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})


export class InterviewsComponent implements OnInit {
  calendarOptions: Options;
  displayEvent: any;
  addedEvents:any=[];
  clickedEvent:any={
    title:"first",
  };
  selectInterviewerOptions:any[]=[];
  selectIntervieweeOptions:any[]=[];
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  constructor( protected eventService: EventService ) {}
  startDate:StartDate={
    year:1999,
    month:6,
    day:9
  };
  lola:any=1;
  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      this.getInterviewers();
      this.getCandidates();
      this.addedEvents=data;
      console.log(data);
      for(let i=0;i<this.addedEvents.length;i++){
        this.addedEvents[i].start=this.addedEvents[i].dateStart.split("T")[0]+"T"+this.addedEvents[i].timeStart;
      }
      this.calendarOptions ={
        firstDay: 1,
        selectable: true,
        selectHelper: true,
        eventLimit: true,
        hiddenDays: [0],
        buttonText: {
          prev: 'prev',
          next: 'next',
          prevYear: 'prev year',
          nextYear: 'next year',
          today: 'today',
          month: 'month',
          week: 'week',
          day: 'day',
          // listWeek: 'listWeek',
          // listDay: 'listDay'
      },
      height: 550,
        defaultView: 'month',
        header: {
        left: 'title ',
          center: 'addEventButton',
          right: 'today prev,next month,agendaWeek,agendaDay, listWeek,listDay'
      },
      displayEventTime: true,
        timezone: 'local',
        editable: true,
        droppable: true,
        navLinks: true,
        eventSources: [
        {
          /* events:addedEvents*/
          events: (start, end, timezone, callback) => {
            callback(this.addedEvents);
          }
        }
      ],
    };

    });
  }
  dayClick(model: any) {
    let temp=model.date.format("YYYY-MM-DD").split("-");
    this.startDate.year=+temp[0];
    this.startDate.month=+temp[1];
    this.startDate.day=+temp[2];
    setTimeout(()=>{this.eventService.openNew();},0);
  }
  clickButton(model: any) {
    this.displayEvent = model;
  }
  eventClick(model: any) {
    let rootEvent:any=this.findCorrespondentEvent(model.event);
    this.buildClickedEvent(rootEvent);
    this.eventService.openEdit();
  }

  buildClickedEvent(event){
    console.log('event');
    console.log(event);
    this.clickedEvent.title=event.title;
    this.clickedEvent.info=event.info;
    this.clickedEvent.startTime={
      hour:+event.timeStart.split(":")[0],
      minute:+event.timeStart.split(":")[1]};
    this.clickedEvent.start={
      year:+event.start.split("T")[0].split("-")[0],
      month:+event.start.split("T")[0].split("-")[1],
      day:+event.start.split("T")[0].split("-")[2]
    };
    this.clickedEvent.info=event.info;
    this.clickedEvent.place=event.place;
    this.clickedEvent.color=event.id_importance;
    this.clickedEvent.candidate=[event.id_candidate];
    this.clickedEvent.interviewer=[event.id_interviewer];
    // this.clickedEvent.candidate=event.candSurname+" "+event.candName;
    // this.clickedEvent.interviewer=event.lastName+' '+event.firstName;
  }

  findCorrespondentEvent(clickedEvent):any{
    let rootEvent:any;
    for(let i=0;i<this.addedEvents.length;i++){
      if(this.addedEvents[i].id_event==clickedEvent.id_event) {
        rootEvent = this.addedEvents[i];
        return rootEvent;
      }
    }
  }

  updateEvent(model: any) {
    model = {
      event: {
        start: model.event.start,
        title: model.event.title
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    };
    this.displayEvent = model;
  }


  refetchEvents(){
    this.eventService.getEvents().subscribe( data=>{
      this.addedEvents=data;
      for(let i=0;i<this.addedEvents.length;i++){
        this.addedEvents[i].start=this.addedEvents[i].dateStart;
      }
      this.ucCalendar.fullCalendar('refetchEvents');
    });
  }

  getInterviewers(){
    this.eventService.getInterviewers().subscribe(
      data=>{
        let arr:any[]=[];
        for(let i=0;i<data.length;i++){
          arr.push({id:data[i].id_interviewer, name:data[i].firstName+" "+data[i].lastName});
        }
        this.selectInterviewerOptions=arr;
        console.log(this.selectInterviewerOptions);
      });
  }

  getCandidates(){
    this.eventService.getCandidates().subscribe(data=>{
      let arr:any[]=[];
      for(let i=0;i<data.length;i++){
        arr.push({id:data[i].id_candidate,name:data[i].firstName+" "+data[i].secondName});
      }
      this.selectIntervieweeOptions=arr;
    });
  }

  lolIncr(){
    this.lola++;
  }
}
