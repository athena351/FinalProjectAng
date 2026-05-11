import { TestBed } from '@angular/core/testing';

import { ThemeServ } from './theme-serv';

describe('ThemeServ', () => {
  let service: ThemeServ;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeServ);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
