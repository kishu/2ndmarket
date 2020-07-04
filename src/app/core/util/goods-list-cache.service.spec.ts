import { TestBed } from '@angular/core/testing';

import { GoodsListCacheService } from './goods-list-cache.service';

describe('GoodsListCacheService', () => {
  let service: GoodsListCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsListCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
