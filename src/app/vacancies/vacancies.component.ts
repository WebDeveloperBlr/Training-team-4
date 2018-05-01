import {Component, OnInit, ViewChild} from '@angular/core';
import { VacanciesService } from '../vacancies.service';
import { Observable } from 'rxjs/Observable';
import {VacanciesGridComponent} from './vacancies-grid/vacancies-grid.component';
import { VacanciesFilterBarComponent } from './vacancies-filter-bar/vacancies-filter-bar.component';


@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {
  data = {};
  filterObj = {};

  @ViewChild(VacanciesGridComponent)
  private grid: VacanciesGridComponent;
  @ViewChild(VacanciesFilterBarComponent)
  private filterBar: VacanciesFilterBarComponent;

  constructor(private vs: VacanciesService) { }

  ngOnInit() {
    this.getVacancies();
  }
  filterData(): void {
    this.filterObj = this.filterBar.filterObj;
    this.getVacancies();
  }
  getVacancies(): void {
    this.vs.getAll(this.grid.limit, this.grid.offset, this.filterObj).subscribe(data => this.data = data);
    //this.vs.getMockAll(this.grid.limit, this.grid.offset).subscribe(data => this.data = data);
  }

}
