/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ObjectivesService } from './objectives.service';

describe('Service: Objectives', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectivesService]
    });
  });

  it('should ...', inject([ObjectivesService], (service: ObjectivesService) => {
    expect(service).toBeTruthy();
  }));
});
