import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentConversationComponent } from './recent-conversation.component';

describe('RecentConversationComponent', () => {
  let component: RecentConversationComponent;
  let fixture: ComponentFixture<RecentConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
