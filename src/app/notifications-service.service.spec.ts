import { TestBed, inject } from '@angular/core/testing';

import { NotificationsServiceService } from './notifications-service.service';

describe('NotificationsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsServiceService]
    });
  });

  it('should be created', inject([NotificationsServiceService], (service: NotificationsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
