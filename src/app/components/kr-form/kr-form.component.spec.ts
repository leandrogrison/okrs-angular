import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KrFormComponent } from './kr-form.component';

describe('KrFormComponent', () => {
  let component: KrFormComponent;
  let fixture: ComponentFixture<KrFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KrFormComponent]
    });
    fixture = TestBed.createComponent(KrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
