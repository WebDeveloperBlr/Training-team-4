import { Component, OnInit } from '@angular/core';
import {CandidateService} from "../../candidate.service";

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  constructor(private candidateService:CandidateService) { }

  ngOnInit() {
  }


  toggleSideBar(){
    this.candidateService.toggleSideBar();
  }
}
