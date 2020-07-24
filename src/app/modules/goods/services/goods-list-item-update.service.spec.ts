import { TestBed } from '@angular/core/testing';

import { GoodsListItemUpdateService } from './goods-list-item-update.service';

describe('GoodsListItemUpdateService', () => {
  let service: GoodsListItemUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsListItemUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
