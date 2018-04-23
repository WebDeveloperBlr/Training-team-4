import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgSelectComponentComponent} from '../ng-select-component/ng-select-component.component';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  width: number;
  height: number = 25;
  selectedIndex: number = 0;
  filterObj: any = {};
  @ViewChild(NgSelectComponentComponent)
  private childSelect: NgSelectComponentComponent;


  @Output() onChange = new EventEmitter<any>();

  change(evt): void {
    this.filterObj.id_status = this.childSelect.selectedItemId;
    console.log(this.filterObj);
    this.onChange.emit(this.filterObj);
  }

  constructor() { }

  ngOnInit() {
  }

}
