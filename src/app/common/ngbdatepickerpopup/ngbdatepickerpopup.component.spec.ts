import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdatepickerpopupComponent } from './ngbdatepickerpopup.component';

describe('NgbdatepickerpopupComponent', () => {
  let component: NgbdatepickerpopupComponent;
  let fixture: ComponentFixture<NgbdatepickerpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdatepickerpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdatepickerpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
