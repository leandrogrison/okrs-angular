import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObjectiveComponent } from './edit-objective.component';

describe('EditObjectiveComponent', () => {
  let component: EditObjectiveComponent;
  let fixture: ComponentFixture<EditObjectiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditObjectiveComponent]
    });
    fixture = TestBed.createComponent(EditObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
