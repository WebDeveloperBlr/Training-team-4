import { Injectable } from '@angular/core';

@Injectable()
export class NotificationsServiceService {

  constructor() { }

  barOpened:boolean=true;

  change(){
    if(this.barOpened)
      this.barOpened=false;
    else
      this.barOpened=true;
  }

}
