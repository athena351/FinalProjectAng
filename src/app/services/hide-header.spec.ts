import { TestBed } from '@angular/core/testing';

import { HideHeader } from './hide-header';

describe('HideHeader', () => {
  let service: HideHeader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HideHeader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
