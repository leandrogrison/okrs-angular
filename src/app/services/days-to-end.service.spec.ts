import { TestBed } from '@angular/core/testing';

import { DaysToEndService } from './days-to-end.service';

describe('DaysToEndService', () => {
  let service: DaysToEndService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaysToEndService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
