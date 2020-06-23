import { TestBed } from '@angular/core/testing';

import { GoodsFavoritesService } from './goods-favorites.service';

describe('GoodsFavoritesService', () => {
  let service: GoodsFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
