import { TestBed } from '@angular/core/testing';

import { GoodsPersistenceService } from './goods-persistence.service';

describe('GoodsPersistenceService', () => {
  let service: GoodsPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
