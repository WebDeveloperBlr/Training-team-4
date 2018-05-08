import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { NgForm } from '@angular/forms';
import { InterviewsComponent } from '../interviews.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from 'ng-fullcalendar';
import { Event } from '../../event';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-new-event-form-content',
  templateUrl: './new-event-form-content.html',
  styleUrls: ['./new-event-form.component.scss']
})
export class NewEventFormContent implements OnInit {
  eventForm: FormGroup;
  time = {hour: 9, minute: 0};
  event = new Event(1, '', (new Date()).toISOString().slice(0, 10), this.time);
  ngOnInit() {
    this.eventForm = new FormGroup({
      'title': new FormControl(this.event.title,
        [
          Validators.required,
          Validators.minLength(3)
        ]),
      'date': new FormControl(this.event.start,
          Validators.required)
    });
  }
  constructor(public activeModal: NgbActiveModal) {}
  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  onSubmit() {

  }
}

@Component({
  selector: 'app-new-event-form',
  template: ''
})
export class  NewEventFormComponent {
  constructor(private modalService: NgbModal) {}
  open() {
    const modalRef = this.modalService.open(NewEventFormContent);
  }
}
