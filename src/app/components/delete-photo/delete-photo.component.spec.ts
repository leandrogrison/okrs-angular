import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePhotoComponent } from './delete-photo.component';

describe('DeletePhotoComponent', () => {
  let component: DeletePhotoComponent;
  let fixture: ComponentFixture<DeletePhotoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletePhotoComponent]
    });
    fixture = TestBed.createComponent(DeletePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
