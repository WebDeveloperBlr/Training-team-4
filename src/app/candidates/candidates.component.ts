import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CANDIDATES } from '../mock-candidates';
import { CandidateService } from '../candidate.service';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss']
})

export class CandidatesComponent implements OnInit {

  data: Observable<any>;

  constructor(private cs: CandidateService, private pg: PaginationComponent) { }

  ngOnInit() {
    this.getCandidates();
  }

  getCandidates(info: Array<number> = [10, 1]): void {
    /*this.candidateService.getCandidates()
      .subscribe(candidates => this.candidates = candidates);*/
    this.cs.getMockCandidates(info[0], info[1]).subscribe((data) => {
       this.data = data;
    });
    //this.data = this.cs.getMockCandidates(10, offset);

  }


}
