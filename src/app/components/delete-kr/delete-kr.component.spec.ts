import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteKrComponent } from './delete-kr.component';

describe('DeleteKrComponent', () => {
  let component: DeleteKrComponent;
  let fixture: ComponentFixture<DeleteKrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteKrComponent]
    });
    fixture = TestBed.createComponent(DeleteKrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
