import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ng-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-select-component.component.html',
  styleUrls: ['./ng-select-component.component.scss']
})

export class NgSelectComponentComponent implements OnInit{

  statuses = [
    {id_status: 1, name: 'Any'},
    {id_status: 2, name: 'CV-rejected'},
    {id_status: 3, name: 'Interview accepted'},
    {id_status: 4, name: 'CV-accepted'},
    {id_status: 5, name: 'New'}
  ];
  public selectedItemId: string = null;
  @Output() onChanged = new EventEmitter<any>();

  onChange(): void {
    this.onChanged.emit(this.selectedItemId);
  }


  ngOnInit() {
    this.selectedItemId = this.statuses[0].name;
  }
}

