import { TestBed } from '@angular/core/testing';

import { PermitGoodsGuard } from './permit-goods.guard';

describe('PermitGoodsGuard', () => {
  let guard: PermitGoodsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermitGoodsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
