import { Component } from '@angular/core';
import {EventService} from './event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hr-app';
  constructor( protected eventService: EventService ) {}
  checkOutsidePopup($event:any){
    let target=$event.target;
    try{
      while(true){
        if(target.tagName=="APP-POPUP-NEW")
          return;
        if(target.tagName=="APP-POPUP-EDIT")
          return;
        if(target.classList.contains("fc-body"))
          return;
        target=target.parentNode;
        if(target.classList.contains("outside")) {
          this.eventService.closeNew();
          this.eventService.closeEdit();
        }
      }}catch(e){
    }
    return;
  }
}
