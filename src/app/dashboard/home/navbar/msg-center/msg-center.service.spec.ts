import { TestBed, inject } from '@angular/core/testing';

import { MsgCenterService } from './msg-center.service';

describe('MsgCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgCenterService]
    });
  });

  it('should be created', inject([MsgCenterService], (service: MsgCenterService) => {
    expect(service).toBeTruthy();
  }));
});
