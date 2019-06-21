import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgCenterComponent } from './msg-center.component';

describe('MsgCenterComponent', () => {
  let component: MsgCenterComponent;
  let fixture: ComponentFixture<MsgCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
