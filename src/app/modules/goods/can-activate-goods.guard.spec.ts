import { TestBed } from '@angular/core/testing';

import { CanActivateGoodsGuard } from './can-actuvate-goods-guard.service';

describe('CacActivateGoodsGuard', () => {
  let guard: CanActivateGoodsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateGoodsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
