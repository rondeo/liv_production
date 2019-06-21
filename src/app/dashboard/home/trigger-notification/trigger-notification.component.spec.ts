import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerNotificationComponent } from './trigger-notification.component';

describe('TriggerNotificationComponent', () => {
  let component: TriggerNotificationComponent;
  let fixture: ComponentFixture<TriggerNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
