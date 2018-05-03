import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { NgForm } from '@angular/forms';
import { InterviewsComponent } from '../interviews.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from 'ng-fullcalendar';
import { Event } from '../../event';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-edit-event-form-content',
  templateUrl: './edit-event-form.content.html',
  styleUrls: ['./edit-event-form.component.scss']
})
export class EditEventFormContent implements OnInit {
  eventForm: FormGroup;
  selectInterviewerModel: number[];
  selectInterviewerOptions: IMultiSelectOption[];
  selectInterviewerSettings: IMultiSelectSettings;
  event = new Event(1, '', (new Date()).toISOString().slice(0, 10));
  constructor(public activeModal: NgbActiveModal) {}

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
      'interviewer': new FormControl(2),
      'color': new FormControl('0'),
      'info': new FormControl('')
    });
    this.selectInterviewerSettings = {
      buttonClasses: 'btn btn-primary btn-block',
      dynamicTitleMaxItems: 2
    };
    this.selectInterviewerOptions = [
      { id: 1, name: 'Interviewer 1' },
      { id: 2, name: 'Interviewer 2' },
      { id: 3, name: 'Interviewer 3' },
      { id: 4, name: 'Interviewer 4' }
    ];
  }

  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  onSubmit() {

  }
  onChange() {
    console.log(this.selectInterviewerModel);
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
