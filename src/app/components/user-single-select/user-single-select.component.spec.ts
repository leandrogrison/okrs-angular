import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSingleSelectComponent } from './user-single-select.component';

describe('UserSingleSelectComponent', () => {
  let component: UserSingleSelectComponent;
  let fixture: ComponentFixture<UserSingleSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSingleSelectComponent]
    });
    fixture = TestBed.createComponent(UserSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
