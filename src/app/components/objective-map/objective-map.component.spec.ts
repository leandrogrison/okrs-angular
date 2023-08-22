import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveMapComponent } from './objective-map.component';

describe('ObjectiveMapComponent', () => {
  let component: ObjectiveMapComponent;
  let fixture: ComponentFixture<ObjectiveMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectiveMapComponent]
    });
    fixture = TestBed.createComponent(ObjectiveMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
