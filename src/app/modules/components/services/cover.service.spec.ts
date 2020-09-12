import { TestBed } from '@angular/core/testing';

import { CoverService } from './cover.service';

describe('CoverService', () => {
  let service: CoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
