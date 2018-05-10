import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import {NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class NgbDateFRParserFormatter extends NgbDateAdapter<string> {
  fromModel(dt: string): NgbDateStruct {
    let date = new Date(dt);
    return (date && date.getFullYear) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  toModel(date: NgbDateStruct): string {
    return date ? new Date(date.year, date.month - 1, date.day).toISOString() : null;
  }
}
