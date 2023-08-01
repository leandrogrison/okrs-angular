import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMultipleSelectComponent } from './user-multiple-select.component';

describe('UserMultipleSelectComponent', () => {
  let component: UserMultipleSelectComponent;
  let fixture: ComponentFixture<UserMultipleSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserMultipleSelectComponent]
    });
    fixture = TestBed.createComponent(UserMultipleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
