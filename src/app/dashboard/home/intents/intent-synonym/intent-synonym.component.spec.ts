import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntentSynonymComponent } from './intent-synonym.component';

describe('IntentSynonymComponent', () => {
  let component: IntentSynonymComponent;
  let fixture: ComponentFixture<IntentSynonymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntentSynonymComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntentSynonymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
