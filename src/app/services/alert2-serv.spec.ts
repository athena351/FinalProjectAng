import { TestBed } from '@angular/core/testing';

import { Alert2Serv } from './alert2-serv';

describe('Alert2Serv', () => {
  let service: Alert2Serv;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alert2Serv);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
