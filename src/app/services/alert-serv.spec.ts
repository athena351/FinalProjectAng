import { TestBed } from '@angular/core/testing';

import { AlertServ } from './alert-serv';

describe('AlertServ', () => {
  let service: AlertServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
