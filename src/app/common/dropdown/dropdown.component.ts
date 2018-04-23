import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  values: Array<number> = [10, 20, 50];
  activeValue = 10;
  @Output() onChanged = new EventEmitter<number>();

  onChange(evt): void {
    this.activeValue = +evt;
    this.onChanged.emit(this.activeValue);
  }

  constructor() { }

  ngOnInit() {
  }

}
