import { TestBed } from '@angular/core/testing';

import { ExpandAllService } from './expand-all.service';

describe('ExpandAllService', () => {
  let service: ExpandAllService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpandAllService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
