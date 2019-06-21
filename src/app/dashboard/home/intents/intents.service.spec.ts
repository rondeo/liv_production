import { TestBed, inject } from '@angular/core/testing';

import { IntentsService } from './intents.service';

describe('IntentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntentsService]
    });
  });

  it('should be created', inject([IntentsService], (service: IntentsService) => {
    expect(service).toBeTruthy();
  }));
});
