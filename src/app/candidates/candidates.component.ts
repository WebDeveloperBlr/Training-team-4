import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilterBarComponent } from '../common/filter-bar/filter-bar.component';
import { CANDIDATES } from '../mock-candidates';
import { CandidateService } from '../candidate.service';
import { GridComponent } from './grid/grid.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})

export class CandidatesComponent implements OnInit {

  data: Observable<any>;
  filterObj = {};

  @ViewChild(FilterBarComponent)
  private filterBar: FilterBarComponent;

  @ViewChild(GridComponent)
  private grid: GridComponent;

  constructor(private cs: CandidateService) { }

  ngOnInit() {
    this.getCandidates();
  }

  filterData(): void {
    this.filterObj = this.filterBar.filterObj;
    this.getCandidates();
  }

  getCandidates(): void {
    this.cs.getCandidates(this.grid.limit, this.grid.offset, this.filterObj)
      .subscribe(data => this.data = data);
    /*this.cs.getMockCandidates(this.grid.limit, this.grid.offset, this.filterObj).subscribe((data) => {
       this.data = data;
    });*/

  }


}
