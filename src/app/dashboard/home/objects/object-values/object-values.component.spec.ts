import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectValuesComponent } from './object-values.component';

describe('ObjectValuesComponent', () => {
  let component: ObjectValuesComponent;
  let fixture: ComponentFixture<ObjectValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
