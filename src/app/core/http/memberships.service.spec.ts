import { TestBed } from '@angular/core/testing';

import { MembershipsService } from './memberships.service';

describe('MembershipsService', () => {
  let service: MembershipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
