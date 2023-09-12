import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHistoryComponent } from './dashboard-history.component';

describe('DashboardHistoryComponent', () => {
  let component: DashboardHistoryComponent;
  let fixture: ComponentFixture<DashboardHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHistoryComponent]
    });
    fixture = TestBed.createComponent(DashboardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
