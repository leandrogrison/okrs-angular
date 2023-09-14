import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOkrsObjectivesComponent } from './my-okrs-objectives.component';

describe('MyOkrsObjectivesComponent', () => {
  let component: MyOkrsObjectivesComponent;
  let fixture: ComponentFixture<MyOkrsObjectivesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOkrsObjectivesComponent]
    });
    fixture = TestBed.createComponent(MyOkrsObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
