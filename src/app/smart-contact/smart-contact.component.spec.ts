import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartContactComponent } from './smart-contact.component';

describe('SmartContactComponent', () => {
  let component: SmartContactComponent;
  let fixture: ComponentFixture<SmartContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
