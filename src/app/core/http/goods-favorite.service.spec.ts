import { TestBed } from '@angular/core/testing';

import { GoodsFavoriteService } from './goods-favorite.service';

describe('GoodsFavoriteService', () => {
  let service: GoodsFavoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsFavoriteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
