import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteObjectiveComponent } from './delete-objective.component';

describe('DeleteObjectiveComponent', () => {
  let component: DeleteObjectiveComponent;
  let fixture: ComponentFixture<DeleteObjectiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteObjectiveComponent]
    });
    fixture = TestBed.createComponent(DeleteObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
