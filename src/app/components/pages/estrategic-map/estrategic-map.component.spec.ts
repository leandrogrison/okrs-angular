import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstrategicMapComponent } from './estrategic-map.component';

describe('EstrategicMapComponent', () => {
  let component: EstrategicMapComponent;
  let fixture: ComponentFixture<EstrategicMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstrategicMapComponent]
    });
    fixture = TestBed.createComponent(EstrategicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
