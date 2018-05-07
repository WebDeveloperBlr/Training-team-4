import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventService } from '../event.service';
import {StartDate} from '../interfaces/StartDate';


@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})

export class InterviewsComponent implements OnInit {
  calendarOptions: Options;
  displayEvent: any;
  addedEvents:any=[];

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
      this.addedEvents=data;
      for(let i=0;i<this.addedEvents.length;i++){
        this.addedEvents[i].start=this.addedEvents[i].dateStart;
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
    this.lola++;
    console.log("lol is"+this.lola);
    setTimeout(()=>{this.eventService.openNew();},0);
  }
  clickButton(model: any) {
    this.displayEvent = model;
  }
  eventClick(model: any) {

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
}
