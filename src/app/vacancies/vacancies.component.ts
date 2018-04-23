import {Component, OnInit, ViewChild} from '@angular/core';
import { VacanciesService } from '../vacancies.service';
import { Observable } from 'rxjs/Observable';
import {VacanciesGridComponent} from './vacancies-grid/vacancies-grid.component';

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

  constructor(private vs: VacanciesService) { }

  ngOnInit() {
    this.getVacancies();
  }
  getVacancies(): void {
    //this.vs.getAll().subscribe(data => this.data = data);
    this.vs.getMockAll(this.grid.limit, this.grid.offset).subscribe(data => this.data = data);
  }

}
