import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {


  page = 1;
  @Input()
  data: any;
  @Input()
  limit: number;
  pageLimit: number;


  constructor() { }

  ngOnInit() {
    this.getData() ;
  }

  @Output() onChanged = new EventEmitter<number>();
  pageChange(event){
    this.onChanged.emit(event);
  }

  getData(): void {
    this.pageLimit = Math.ceil(this.data.count / this.limit) ;
    /*this.cs.getMockCandidates(10, this.page).subscribe((data) => {
      this.data = data;
      this.pageLimit = Math.round(this.data.count / 10) ;
      console.log(data);
    });*/
  }

}
