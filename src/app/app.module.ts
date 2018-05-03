import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from 'ng-fullcalendar';

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
import { VacanciesService } from './vacancies.service';
import {EventsService} from './events.service';
import { EventService } from './event.service';
import { VacanciesGridComponent } from './vacancies/vacancies-grid/vacancies-grid.component';
import { VacanciesFilterBarComponent } from './vacancies/vacancies-filter-bar/vacancies-filter-bar.component';
import {formControlBinding} from '@angular/forms/src/directives/ng_model';
import { NotificationsBarComponent } from './notifications-bar/notifications-bar.component';
import { InterviewsComponent } from './interviews/interviews.component';
import { NewEventFormComponent, NewEventFormContent } from './interviews/new-event-form/new-event-form.component';
import { EditEventFormComponent, EditEventFormContent } from './interviews/edit-event-form/edit-event-form.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

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
    NotificationsBarComponent,
    InterviewsComponent,
    NewEventFormComponent,
    NewEventFormContent,
    EditEventFormComponent,
    EditEventFormContent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    NgSelectModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    MultiselectDropdownModule
  ],
  providers: [
    CandidateService,
    MessageService,
    PaginationComponent,
    VacanciesService,
    EventsService,
    EventService
  ],
  entryComponents: [
    NewEventFormContent,
    EditEventFormContent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
