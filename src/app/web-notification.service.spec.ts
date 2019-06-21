import { TestBed, inject } from '@angular/core/testing';

import { WebNotificationService } from './web-notification.service';

describe('WebNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebNotificationService]
    });
  });

  it('should be created', inject([WebNotificationService], (service: WebNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
