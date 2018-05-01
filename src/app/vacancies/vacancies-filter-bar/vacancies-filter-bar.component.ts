import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vacancies-filter-bar',
  templateUrl: './vacancies-filter-bar.component.html',
  styleUrls: ['./vacancies-filter-bar.component.scss']
})
export class VacanciesFilterBarComponent implements OnInit {

  @Output()
    onChange = new EventEmitter();
  filterObj: any = {};
  width: number;
  height: number = 25;
  selectedIndex: number = 0;
  data: Array<object>;
  expData = {
    from: null,
    to: null
  };
  testTo: string;
  /*expData = [
    {name: 'Any'},
    {name: 'Junior'},
    {name: 'Middle'},
    {name: 'Senior'}
  ];*/
  positionData = [
    {name: 'Any'},
    {name: 'JavaScript Developer'},
    {name: 'PHP Developer'},
    {name: 'Ruby Developer'},
    {name: 'Java Developer'}
  ];
  positionSelectedItemName: string = null;
  expSelectedItemName: string = null;

  constructor() { }

  ngOnInit() {
    this.testTo = 'blabla';
    this.positionSelectedItemName = this.positionData[0].name;
  }
  change(): void{
    this.filterObj.positionName = this.positionSelectedItemName;
    this.filterObj.exp = this.expData;
    this.onChange.emit();
    console.log(this.filterObj);
  }

}
