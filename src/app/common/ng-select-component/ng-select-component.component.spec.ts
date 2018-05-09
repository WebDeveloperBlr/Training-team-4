import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectComponentComponent } from './ng-select-component.component';

describe('NgSelectComponentComponent', () => {
  let component: NgSelectComponentComponent;
  let fixture: ComponentFixture<NgSelectComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgSelectComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgSelectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
