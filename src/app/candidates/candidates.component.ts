import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilterBarComponent } from '../common/filter-bar/filter-bar.component';
import { HttpParams } from '@angular/common/http';
import { CANDIDATES } from '../mock-candidates';
import { CandidateService } from '../candidate.service';
import { GridComponent } from './grid/grid.component';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})

export class CandidatesComponent implements OnInit {

  data: any;
  filterObj: any = {
    name: ''
  };

  @ViewChild(FilterBarComponent)
  private filterBar: FilterBarComponent;

  @ViewChild(GridComponent)
  private grid: GridComponent;

  constructor(private cs: CandidateService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if(params['position']){
        this.filterObj.position = params['position'];
      }
      else{
        this.filterObj.position = "";
        this.getCandidates();
      }
    });

    this.getCandidates();
  }

  filterData(): void {
    if(this.filterBar){
      this.filterObj = this.filterBar.filterObj;
      this.getCandidates();
    }
  }

  getCandidates(): void {
    console.log(this.filterObj);
    this.cs.getCandidates(this.grid.limit, this.grid.offset, this.filterObj)
      .subscribe(data => this.data = data);
  }


}
