import { Component, OnInit, EventEmitter,Output, Input } from '@angular/core';
import { CandidateService } from '../../candidate.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {


  page = 1;
  data : any;
  pageLimit: number;


  constructor(private cs: CandidateService) { }

  ngOnInit() {
    this.getData() ;
  }

  @Output() onChanged = new EventEmitter<number>();
  pageChange(event){
    this.onChanged.emit(event);
  }

  getData(): void{
    this.cs.getMockCandidates(10, this.page).subscribe((data) => {
      this.data = data;
      this.pageLimit = Math.round(this.data.count / 10) ;
      console.log(data);
    });
  }

}
