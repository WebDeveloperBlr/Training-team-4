import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CANDIDATES_DETAIL } from '../../mock-candidates-detail';

import { CandidateService } from '../../candidate.service';
import { Candidate } from '../../candidate';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {

  data: object;

  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCandidate();
  }

  getCandidate(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    //this.data = CANDIDATES_DETAIL;
    this.candidateService.getCandidate(id)
      .subscribe(data => this.data = data);
  }

}
