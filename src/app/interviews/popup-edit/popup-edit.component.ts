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

  mes:string="lol";
  @Output() refetchEvents =new EventEmitter();
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
    if(this.clickedEvent.candidate[0]!=0) {
      this.selectIntervieweeModel = this.clickedEvent.candidate;
    }
    else{
      this.selectIntervieweeModel=[];}
    this.selectInterviewerModel=this.clickedEvent.interviewer;
  }
  eventForm: FormGroup;
  selectInterviewerModel: number[]=[];
  // selectInterviewerOptions: IMultiSelectOption[];
  selectInterviewerSettings: IMultiSelectSettings;
  selectInterviewerTexts: IMultiSelectTexts;
  selectIntervieweeModel: number[]=[];
  selectIntervieweeSettings: IMultiSelectSettings;
  selectIntervieweeTexts: IMultiSelectTexts;

  chosenCandidate:any;
  chosenInterviewer:any;

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
      enableSearch:true,
      selectionLimit:1
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

  get title():any { return this.eventForm.get('title'); }
  get date():any { return this.eventForm.get('date'); }
  get time():any { return this.eventForm.get('time');}
  get color():any { return this.eventForm.get('color');}
  get info():any { return this.eventForm.get('info');}
  get interviewee():any { return this.eventForm.get('interviewee');}
  get interviewer():any { return this.eventForm.get('interviewer');}
  get place():any { return this.eventForm.get('place');}
  onSubmit() {
    let updatedEvent={
      id_event:this.clickedEvent.id_event,
      title:this.title.value,
      dateStart:this.date.value.year+"-"+this.date.value.month+"-"+this.date.value.day,
      timeStart:this.time.value.hour+":"+this.time.value.minute+":00",
      id_importance:+this.color.value,
      info:this.info.value,
      place:this.place.value,
      id_candidate:this.selectIntervieweeModel[0],
      id_interviewer:this.selectInterviewerModel[0]
    };
    if(this.selectIntervieweeModel.length==0)
      updatedEvent.id_candidate=0;
    this.eventService.updateEvent(updatedEvent);
    this.eventService.closeEdit();
    setTimeout(()=>{this.emitEvent();},100);
  }
  onChange() {
    return;
    // console.log(this.selectInterviewerModel);
  }

  onChangeInterviewee(){
    return;
    // console.log(this.selectIntervieweeModel);
  }

  deleteEvent(){
    this.eventService.deleteEvent(this.clickedEvent.id_event);
    setTimeout(()=>{this.emitEvent();});
    this.eventService.closeEdit();
  }

  emitEvent(){
    this.refetchEvents.emit(this.mes);
  }

}
