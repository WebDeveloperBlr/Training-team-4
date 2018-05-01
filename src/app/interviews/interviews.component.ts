import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { EventService } from '../event.service';
import { NewEventFormComponent } from './new-event-form/new-event-form.component';
import { EditEventFormComponent } from './edit-event-form/edit-event-form.component';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})

export class InterviewsComponent implements OnInit {
  calendarOptions: Options;
  displayEvent: any;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild(NewEventFormComponent) newEventForm: NewEventFormComponent;
  @ViewChild(EditEventFormComponent) editEventForm: EditEventFormComponent;
  constructor( protected eventService: EventService ) {}

  ngOnInit() {
    this.eventService.getEvents().subscribe(data => {
      this.calendarOptions = {
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
          // listWeek: 'week list',
          // listDay: 'day list'
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
        events: data
      };
    });
  }
  dayClick(model: any) {
    this.newEventForm.open();
  }
  clickButton(model: any) {
    this.displayEvent = model;
  }
  eventClick(model: any) {
    this.editEventForm.open(model);
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
}