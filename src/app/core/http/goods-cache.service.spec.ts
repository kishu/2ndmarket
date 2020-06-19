import { TestBed } from '@angular/core/testing';

import { GoodsCacheService } from './goods-cache.service';

describe('GoodsCacheService', () => {
  let service: GoodsCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
