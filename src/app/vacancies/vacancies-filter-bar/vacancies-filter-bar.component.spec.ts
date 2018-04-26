import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesFilterBarComponent } from './vacancies-filter-bar.component';

describe('VacanciesFilterBarComponent', () => {
  let component: VacanciesFilterBarComponent;
  let fixture: ComponentFixture<VacanciesFilterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacanciesFilterBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacanciesFilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
