import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectSynonymComponent } from './object-synonym.component';

describe('ObjectSynonymComponent', () => {
  let component: ObjectSynonymComponent;
  let fixture: ComponentFixture<ObjectSynonymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectSynonymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectSynonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
