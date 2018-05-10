import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidatesComponent } from './candidates/candidates.component';
import { CandidateDetailComponent } from './candidates/candidate-detail/candidate-detail.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { InterviewsComponent } from './interviews/interviews.component';
import {AuthGuardService} from './auth-guard.service';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: "register", component:RegisterComponent},
  { path: "login", component:LoginComponent},

  { path: '', redirectTo: '/candidates', pathMatch: 'full',
    canActivate:[AuthGuardService], },
  { path: 'candidates/:id', component: HomeComponent,
    canActivate:[AuthGuardService],
    children:[{path:"", component: CandidateDetailComponent }]},
  { path: 'candidates', component: HomeComponent,
    canActivate:[AuthGuardService],
    children:[{path:"",component:CandidatesComponent}]},
  { path: 'vacancies', component: HomeComponent,
    canActivate:[AuthGuardService],
    children:[{path:"",component:VacanciesComponent}]},
  { path: 'interview', component: HomeComponent,
    canActivate:[AuthGuardService],
    children:[{path:"",component:InterviewsComponent}]},
  { path: '**',redirectTo: '/candidates', pathMatch: 'full'}

  // { path: '', redirectTo: '/candidates', pathMatch: 'full' },
  // { path: 'candidates', component: CandidatesComponent },
  // { path: 'candidates/:id', component: CandidateDetailComponent },
  // { path: 'vacancies', component: VacanciesComponent},
  // { path: 'interviews', component:  InterviewsComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
