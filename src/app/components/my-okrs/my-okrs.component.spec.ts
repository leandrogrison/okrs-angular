import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOkrsComponent } from './my-okrs.component';

describe('MyOkrsComponent', () => {
  let component: MyOkrsComponent;
  let fixture: ComponentFixture<MyOkrsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOkrsComponent]
    });
    fixture = TestBed.createComponent(MyOkrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
