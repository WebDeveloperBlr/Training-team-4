import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidatesComponent } from './candidates/candidates.component';
import { CandidateDetailComponent } from './candidates/candidate-detail/candidate-detail.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { InterviewsComponent } from './interviews/interviews.component';

const routes: Routes = [
  { path: '', redirectTo: '/candidates', pathMatch: 'full' },
  { path: 'candidates', component: CandidatesComponent },
  { path: 'candidates/:id', component: CandidateDetailComponent },
  { path: 'vacancies', component: VacanciesComponent},
  { path: 'interviews', component:  InterviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }