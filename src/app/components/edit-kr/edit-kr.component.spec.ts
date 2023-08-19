import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditKrComponent } from './edit-kr.component';

describe('EditKrComponent', () => {
  let component: EditKrComponent;
  let fixture: ComponentFixture<EditKrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditKrComponent]
    });
    fixture = TestBed.createComponent(EditKrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
