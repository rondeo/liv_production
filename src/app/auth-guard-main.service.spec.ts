import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardMainService } from './auth-guard-main.service';

describe('AuthGuardMainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuardMainService]
    });
  });

  it('should be created', inject([AuthGuardMainService], (service: AuthGuardMainService) => {
    expect(service).toBeTruthy();
  }));
});
