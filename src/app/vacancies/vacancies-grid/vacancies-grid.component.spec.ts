import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesGridComponent } from './vacancies-grid.component';

describe('VacanciesGridComponent', () => {
  let component: VacanciesGridComponent;
  let fixture: ComponentFixture<VacanciesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacanciesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacanciesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
