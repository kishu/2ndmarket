import { TestBed } from '@angular/core/testing';

import { Persistence2Service } from './persistence2.service';

describe('Persistence2Service', () => {
  let service: Persistence2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Persistence2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
