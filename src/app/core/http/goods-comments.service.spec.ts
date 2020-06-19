import { TestBed } from '@angular/core/testing';

import { GoodsCommentsService } from './goods-comments.service';

describe('GoodsCommentsService', () => {
  let service: GoodsCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodsCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
