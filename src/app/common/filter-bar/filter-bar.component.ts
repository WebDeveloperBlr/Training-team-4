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
  filterObj: any = {
    name: ''
  };

  statusData = [
    {id_status: 1, name: 'Any'},
    {id_status: 2, name: 'CV-rejected'},
    {id_status: 3, name: 'Accepted for interview'},
    {id_status: 4, name: 'CV-accepted'},
    {id_status: 5, name: 'New'},
    {id_status: 6, name: 'Accepted for work'}
  ];
  public selectedItemName: string = null;

  @Output() onChanged = new EventEmitter<any>();


  onChange(): void {
    this.filterObj.statusName = this.selectedItemName;
    console.log(this.filterObj);
    this.onChanged.emit(this.selectedItemName);
  }

  changeName(event): void{
    this.filterObj.name = event.target.value;
    this.onChange();
  }
  constructor() { }

  ngOnInit() {
    this.selectedItemName = this.statusData[0].name;
  }

}
