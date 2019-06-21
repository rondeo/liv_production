import { TestBed, inject } from '@angular/core/testing';

import { TriggerNotificationService } from './trigger-notification.service';

describe('TriggerNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TriggerNotificationService]
    });
  });

  it('should be created', inject([TriggerNotificationService], (service: TriggerNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
