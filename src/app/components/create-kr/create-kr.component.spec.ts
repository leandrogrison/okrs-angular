import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKrComponent } from './create-kr.component';

describe('CreateKrComponent', () => {
  let component: CreateKrComponent;
  let fixture: ComponentFixture<CreateKrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateKrComponent]
    });
    fixture = TestBed.createComponent(CreateKrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
