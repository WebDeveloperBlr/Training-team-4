import {Component, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import { VacanciesService } from '../../vacancies.service';
import { Observable } from 'rxjs/Observable';
import {PaginationComponent} from '../../common/pagination/pagination.component';
import {DropdownComponent} from '../../common/dropdown/dropdown.component';

@Component({
  selector: 'app-vacancies-grid',
  templateUrl: './vacancies-grid.component.html',
  styleUrls: ['./vacancies-grid.component.scss']
})
export class VacanciesGridComponent implements OnInit {

  @Input()
  data: any;
  @Output() changePage = new EventEmitter<any>();

  offset: number = 1;
  limit: number = 10;

  @ViewChild(PaginationComponent)
  private pg: PaginationComponent;

  @ViewChild(DropdownComponent)
  private dropDown: DropdownComponent;


  onChange(): void {
    this.limit = this.dropDown.activeValue;
    this.offset = this.pg.page;
    this.changePage.emit();
  }

  constructor(private vs: VacanciesService) { }

  ngOnInit() {
    //this.vs.getAll().subscribe(data => this.data = data);
    /*this.vs.getMockAll().subscribe(data => {
      this.data = data;
    });*/
  }

}
