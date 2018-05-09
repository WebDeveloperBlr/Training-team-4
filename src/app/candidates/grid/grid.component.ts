import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { CandidateService } from '../../candidate.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { DropdownComponent } from '../../common/dropdown/dropdown.component';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Output() changePage = new EventEmitter<any>();

  @Input()
  data: object;
  offset: number;
  limit: number;

  @ViewChild(PaginationComponent)
  private pg: PaginationComponent;

  @ViewChild(DropdownComponent)
  private dropDown: DropdownComponent;


  onChange(): void {
    console.log('fired');
    this.limit = this.dropDown.activeValue;
    this.offset = this.pg.page;
    this.changePage.emit();
  }

  constructor(private cs: CandidateService) { }

  ngOnInit() {
    this.offset = this.cs.currentOffset;
    this.limit = this.cs.currentLimit;
      this.getCandidates();
  }

  getCandidates(limit: number = 10, offset: number  = 1): void {
    //this.data = this.cs.getCandidates().subscribe((candidates) => this.data = candidates);
    /*this.cs.getMockCandidates(limit, offset).subscribe((data) => {
      this.data = data;
        console.log(data);
    });*/
  }

}
