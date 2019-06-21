import { TestBed, inject } from '@angular/core/testing';

import { RecentConversationService } from './recent-conversation.service';

describe('RecentConversationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecentConversationService]
    });
  });

  it('should be created', inject([RecentConversationService], (service: RecentConversationService) => {
    expect(service).toBeTruthy();
  }));
});
