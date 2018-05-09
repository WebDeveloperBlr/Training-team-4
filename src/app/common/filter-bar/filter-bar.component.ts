import { Component, OnInit, Output, EventEmitter, ViewChild, Input, AfterContentInit } from '@angular/core';
import { NgSelectComponentComponent} from '../ng-select-component/ng-select-component.component';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  @Input()
  data: any;
  width: number;
  height: number = 25;
  selectedIndex: number = 0;
  filterObj: any = {
    name: ''
  };

  statusData = [
    {name: 'Any'}
  ];
  public selectedItemName: string = null;

  @Output() onChanged = new EventEmitter<any>();


  onChange(): void {
    this.filterObj.statusName = this.selectedItemName;
    console.log(this.filterObj);
    this.onChanged.emit();
  }

  changeName(event): void{
    this.filterObj.name = event.target.value;
    this.onChange();
  }

  changePosition(event): void {
    this.filterObj.position = event.target.value;
    this.onChange();
  }
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedItemName = this.statusData[0].name;
      this.data.allStatuses.forEach((item) => {
        this.statusData.push(item);
      });
  }

}
