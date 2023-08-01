import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateObjectiveComponent } from './create-objective.component';

describe('CreateObjectiveComponent', () => {
  let component: CreateObjectiveComponent;
  let fixture: ComponentFixture<CreateObjectiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateObjectiveComponent]
    });
    fixture = TestBed.createComponent(CreateObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
