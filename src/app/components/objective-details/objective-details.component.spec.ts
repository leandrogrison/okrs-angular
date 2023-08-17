import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveDetailsComponent } from './objective-details.component';

describe('ObjectiveDetailsComponent', () => {
  let component: ObjectiveDetailsComponent;
  let fixture: ComponentFixture<ObjectiveDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectiveDetailsComponent]
    });
    fixture = TestBed.createComponent(ObjectiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
