import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOkrsIndicatorsComponent } from './my-okrs-indicators.component';

describe('MyOkrsIndicatorsComponent', () => {
  let component: MyOkrsIndicatorsComponent;
  let fixture: ComponentFixture<MyOkrsIndicatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOkrsIndicatorsComponent]
    });
    fixture = TestBed.createComponent(MyOkrsIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
