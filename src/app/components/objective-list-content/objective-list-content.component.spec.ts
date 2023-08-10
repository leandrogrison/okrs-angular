import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveListContentComponent } from './objective-list-content.component';

describe('ObjectiveListContentComponent', () => {
  let component: ObjectiveListContentComponent;
  let fixture: ComponentFixture<ObjectiveListContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectiveListContentComponent]
    });
    fixture = TestBed.createComponent(ObjectiveListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
