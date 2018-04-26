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
  limit: number = 10;
  pageLimit: number = this.data ? Math.ceil(this.data.count / this.limit) : 10;


  constructor() { }

  ngOnInit() {
    this.getData() ;
  }

  @Output() onChanged = new EventEmitter<number>();
  pageChange(event) {
    this.onChanged.emit(event);
  }

  getData(): void {
    console.log(this.limit);
  }

}
