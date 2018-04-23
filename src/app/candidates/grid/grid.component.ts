import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CandidateService } from '../../candidate.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Output() changePage = new EventEmitter<any>();
  data: object;
  offset: number;
  limit: number;


  reloadData(){
    this.changePage.emit([this.limit, this.offset]);
  }

  changeOffset(event: number):void {
    this.offset = event;
    this.reloadData();
  }

  changeLimit(event: number):void {
    this.limit = event;
    this.reloadData();
  }

  constructor(private cs: CandidateService, private pg: PaginationComponent) { }

  ngOnInit() {
    this.offset = this.cs.currentOffset;
    this.limit = this.cs.currentLimit;
      this.getCandidates();
  }

  getCandidates(limit: number = 10, offset: number  = this.pg.page): void {
    //this.data = this.cs.getCandidates().subscribe((candidates) => this.data = candidates);
    this.cs.getMockCandidates(limit, offset).subscribe((data) => {
      this.data = data;
        console.log(data);
    });
  }

}
