import { TestBed } from '@angular/core/testing';

import { FavoriteGoodsService } from './favorite-goods.service';

describe('FavoriteGoodsService', () => {
  let service: FavoriteGoodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteGoodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
