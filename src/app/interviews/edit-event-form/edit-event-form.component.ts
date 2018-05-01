import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { NgForm } from '@angular/forms';
import { InterviewsComponent } from '../interviews.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from 'ng-fullcalendar';
import { Event } from '../../event';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-event-form-content',
  templateUrl: './edit-event-form.content.html',
  styleUrls: ['./edit-event-form.component.scss']
})
export class EditEventFormContent implements OnInit {
  eventForm: FormGroup;
  event = new Event(1, '', (new Date()).toISOString().slice(0, 10));
  ngOnInit() {
    this.eventForm = new FormGroup({
      'title': new FormControl(this.event.title,
        [
          Validators.required,
          Validators.minLength(6)
        ]),
      'date': new FormControl(this.event.start,
        Validators.required),
      'place': new FormControl(this.event.place),
      'interviewer': new FormControl('0'),
      'color': new FormControl('0'),
      'info': new FormControl('')
    });
  }
  constructor(public activeModal: NgbActiveModal) {}
  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  onSubmit() {

  }
}

@Component({
  selector: 'app-edit-event-form',
  template: ''
})
export class  EditEventFormComponent {
  constructor(private modalService: NgbModal) {}
  open(modal: any) {
    const modalRef = this.modalService.open(EditEventFormContent);
  }
}
