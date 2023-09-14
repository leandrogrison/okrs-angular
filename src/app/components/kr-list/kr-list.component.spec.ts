import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KrListComponent } from './kr-list.component';

describe('KrListComponent', () => {
  let component: KrListComponent;
  let fixture: ComponentFixture<KrListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KrListComponent]
    });
    fixture = TestBed.createComponent(KrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
