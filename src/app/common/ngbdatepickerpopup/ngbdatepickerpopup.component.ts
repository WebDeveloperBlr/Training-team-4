import { Component, OnInit, Input, Injectable, EventEmitter, Output } from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '../../ngb-date-fr-parser-formatter';


@Component({
  selector: 'app-ngbdatepickerpopup',
  templateUrl: './ngbdatepickerpopup.component.html',
  styleUrls: ['./ngbdatepickerpopup.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateFRParserFormatter}]
})
export class NgbdatepickerpopupComponent implements OnInit {
  @Input()
    date: Date;

  @Output()
  change: EventEmitter<Date> = new EventEmitter<Date>();

  showDate(): void{
    console.log(typeof this.date);
  }

  onChange(): void{
    console.log('fired');
    this.change.emit(this.date);
  }

  constructor() { }

  ngOnInit() {
  }

}
