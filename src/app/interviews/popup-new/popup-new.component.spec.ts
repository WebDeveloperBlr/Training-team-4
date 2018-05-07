import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNewComponent } from './popup-new.component';

describe('PopupNewComponent', () => {
  let component: PopupNewComponent;
  let fixture: ComponentFixture<PopupNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
