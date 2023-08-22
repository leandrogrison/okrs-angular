import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveMapItemComponent } from './objective-map-item.component';

describe('ObjectiveMapItemComponent', () => {
  let component: ObjectiveMapItemComponent;
  let fixture: ComponentFixture<ObjectiveMapItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectiveMapItemComponent]
    });
    fixture = TestBed.createComponent(ObjectiveMapItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
