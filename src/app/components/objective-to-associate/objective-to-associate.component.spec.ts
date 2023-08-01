import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveToAssociateComponent } from './objective-to-associate.component';

describe('ObjectiveToAssociateComponent', () => {
  let component: ObjectiveToAssociateComponent;
  let fixture: ComponentFixture<ObjectiveToAssociateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectiveToAssociateComponent]
    });
    fixture = TestBed.createComponent(ObjectiveToAssociateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
