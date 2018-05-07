import {Component, Input, OnInit, Output,EventEmitter} from '@angular/core';
import {NgModel} from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../event';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {EventService} from "../../event.service";
import {StartDate} from '../../interfaces/StartDate';
import {OnChanges,SimpleChange} from '@angular/core';

@Component({
  selector: 'app-popup-new',
  templateUrl: './popup-new.component.html',
  styleUrls: ['./popup-new.component.scss']
})
export class PopupNewComponent implements OnInit,OnChanges {

  eventForm: FormGroup;
  @Input() lol;
  @Input() startDate:StartDate;
  @Output() refetchEvents= new EventEmitter();

  ngOnInit() {
    this.eventForm = new FormGroup({
      title: new FormControl("",
        [
          Validators.required,
          Validators.minLength(3)
        ]),
      date: new FormControl(this.startDate)
    });
  }

  ngOnChanges(change:any){
   if(this.startDate.year==1999){}
   else {
     this.eventForm.patchValue({date: this.startDate});
   }
    // console.log(this.startDate);
    // if(this.startDate.year==1999) {
    //   alert(this.startDate.month);
    //   alert('first');
    // }
    // else {
    //   alert("next");
    //   // console.log(this.startDate);
    //   // console.log(5);
    //   // this.eventForm.patchValue({
    //   //   date:   {year:2018,month:5,day:7}
    //   //   //this.startDate
    //   // });
    // }
  }


  constructor(private eventService:EventService) {}
  get title() { return this.eventForm.get('title'); }
  get date() { return this.eventForm.get('date'); }
  onSubmit() {
    this.eventService.insertEvent(this.title.value,
      this.date.value.year+"-"+this.date.value.month+"-"+this.date.value.day);
    this.eventService.closeNew();
    this.eventForm.reset();
    setTimeout(()=>{this.emitEvent();},100);
  }

  emitEvent(){
    this.refetchEvents.emit();
  }

}

