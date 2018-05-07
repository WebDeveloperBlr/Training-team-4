import {
  Component, Input, Output, EventEmitter, OnInit, ViewChild, ViewEncapsulation,
  SimpleChange, OnChanges
} from '@angular/core';
import { Event } from '../../event';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import {EventService} from "../../event.service";

@Component({
  selector: 'app-popup-edit',
  templateUrl: './popup-edit.component.html',
  styleUrls: ['./popup-edit.component.scss']
})
export class PopupEditComponent implements OnChanges,OnInit {

  constructor(private eventService:EventService) {}
  eventForm: FormGroup;
  selectInterviewerModel: number[]=[1,2];
  selectInterviewerOptions: IMultiSelectOption[];
  selectInterviewerSettings: IMultiSelectSettings;
  selectInterviewerTexts: IMultiSelectTexts;
  selectIntervieweeModel: number[]=[3,1];
  selectIntervieweeOptions: IMultiSelectOption[];
  selectIntervieweeSettings: IMultiSelectSettings;
  selectIntervieweeTexts: IMultiSelectTexts;
  event:any={title:"MATITLE",start:{year:2018,month:5,day:8},timeStart:"0920",place:"some PLACE",startTime:{hour:12,minute:30}};
  // event = new Event(1, '', (new Date()).toISOString().slice(0, 10), "2018-05-06");
  @Input() clickedEvent:any;
  @Input() message:any;

  ngOnChanges(change:any){
    // <number>this.message=<number>change.currentValue;
  }
  ngOnInit() {
    this.eventForm = new FormGroup({
      'title': new FormControl(this.event.title,
        [
          Validators.required,
          Validators.minLength(3)
        ]),
      'date': new FormControl(this.event.start,
        Validators.required),
      'time': new FormControl(this.event.startTime),
      'place': new FormControl(this.event.place),
      'interviewer': new FormControl(2),
      'interviewee':new FormControl(3),
      'color': new FormControl(0),
      'info': new FormControl('real info')
    });
    this.selectInterviewerTexts = {
      checkedPlural: 'interviewers',
      allSelected: 'All interviewers',
      defaultTitle: 'Interviewer'
    };
    this.selectInterviewerSettings = {
      buttonClasses: 'btn btn-primary btn-block',
      dynamicTitleMaxItems: 2,
      enableSearch:true
    };
    this.selectInterviewerOptions = [
      { id: 1, name: 'Interviewer 1' },
      { id: 2, name: 'Interviewer 2' },
      { id: 3, name: 'Interviewer 3' },
      { id: 4, name: 'Interviewer 4' }
    ];

    this.selectIntervieweeTexts = {
      allSelected: 'All interviewees',
      defaultTitle: 'Interviewee'
    };
    this.selectIntervieweeSettings = {
      buttonClasses: 'btn btn-primary btn-block',
      dynamicTitleMaxItems: 1,
      selectionLimit:1,
      enableSearch:true
    };
    this.selectIntervieweeOptions = [
      { id: 1, name: 'Interviewee 1' },
      { id: 2, name: 'Interviewee 2' },
      { id: 3, name: 'Interviewee 3' },
      { id: 4, name: 'Interviewee 4' }
    ];
  }

  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  onSubmit() {
  }
  onChange() {
    console.log(this.selectInterviewerModel);
  }

  onChangeInterviewee(){
    console.log(this.selectIntervieweeModel);
  }

}
