import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { SearchBarComponent } from './common/search-bar/search-bar.component';
import {CandidateService} from './candidate.service';
import { MessagesComponent } from './common/messages/messages.component';
import { MessageService } from './message.service';
import { CandidateDetailComponent } from './candidates/candidate-detail/candidate-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { GridComponent } from './candidates/grid/grid.component';
import { FilterBarComponent } from './common/filter-bar/filter-bar.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { DropdownComponent } from './common/dropdown/dropdown.component';
import { NgSelectComponentComponent } from './common/ng-select-component/ng-select-component.component';
import {VacanciesService} from './vacancies.service';
import { VacanciesGridComponent } from './vacancies/vacancies-grid/vacancies-grid.component';
import { VacanciesFilterBarComponent } from './vacancies/vacancies-filter-bar/vacancies-filter-bar.component';
import {formControlBinding} from '@angular/forms/src/directives/ng_model';
import { NotificationsBarComponent } from './notifications-bar/notifications-bar.component';
import {EventsService} from "./events.service";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CandidatesComponent,
    VacanciesComponent,
    SearchBarComponent,
    MessagesComponent,
    CandidateDetailComponent,
    GridComponent,
    FilterBarComponent,
    PaginationComponent,
    DropdownComponent,
    NgSelectComponentComponent,
    VacanciesGridComponent,
    VacanciesFilterBarComponent,
    NotificationsBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgSelectModule,
    FormsModule
  ],
  providers: [
    CandidateService,
    MessageService,
    PaginationComponent,
    VacanciesService,
    EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
