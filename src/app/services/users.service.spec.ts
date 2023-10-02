/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('Service: Users', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    http = TestBed.inject(HttpClient);
  });

  it('should ...', inject([UsersService], (service: UsersService) => {
    expect(service).toBeTruthy();
  }));

  it('GET com endpoint correto', inject([UsersService], (service: UsersService) => {
    const spy = spyOn(http, 'get').and.callThrough();
    service.getUsers();
    expect(spy).toHaveBeenCalled();
  }))
});
