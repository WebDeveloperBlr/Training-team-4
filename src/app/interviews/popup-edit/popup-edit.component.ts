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

  @Input() lol:any;
  @Input() clickedEvent:any;
  @Input() selectInterviewerOptions:IMultiSelectOption[];
  @Input() selectIntervieweeOptions:IMultiSelectOption[];
  // this.selectIntervieweeOptions = [
  //   { id: 1, name: 'Interviewee 1' },
  //   { id: 2, name: 'Interviewee 2' },
  //   { id: 3, name: 'Interviewee 3' },
  //   { id: 4, name: 'Interviewee 4' }
  // ];
  constructor(private eventService:EventService) {}

  ngOnChanges(change:any){
    if(this.clickedEvent.title=="first")
      return;
    this.eventForm.patchValue({
      title:this.clickedEvent.title,
      date:this.clickedEvent.start,
      time:this.clickedEvent.startTime,
      place:this.clickedEvent.place,
      color:this.clickedEvent.color,
      info:this.clickedEvent.info
    });
    this.selectIntervieweeModel=this.clickedEvent.candidate;
    this.selectInterviewerModel=this.clickedEvent.interviewer;
  }
  eventForm: FormGroup;
  selectInterviewerModel: number[]=[1];
  // selectInterviewerOptions: IMultiSelectOption[];
  selectInterviewerSettings: IMultiSelectSettings;
  selectInterviewerTexts: IMultiSelectTexts;
  selectIntervieweeModel: number[]=[1];
  selectIntervieweeSettings: IMultiSelectSettings;
  selectIntervieweeTexts: IMultiSelectTexts;
  // event = new Event(1, '', (new Date()).toISOString().slice(0, 10), "2018-05-06");


  ngOnInit() {
    this.eventForm = new FormGroup({
      'title': new FormControl(this.clickedEvent.title,
        [
          Validators.required,
          Validators.minLength(3)
        ]),
      'date': new FormControl(this.clickedEvent.start,
        Validators.required),
      'time': new FormControl(this.clickedEvent.startTime),
      'place': new FormControl(this.clickedEvent.place),
      'interviewer': new FormControl(),
      'interviewee':new FormControl(),
      'color': new FormControl(this.clickedEvent.color),
      'info': new FormControl(this.clickedEvent.info)
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
