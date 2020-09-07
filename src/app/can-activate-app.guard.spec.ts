import { TestBed } from '@angular/core/testing';

import { CanActivateAppGuard } from './can-activate-app.guard';

describe('CanActivateAppGuard', () => {
  let guard: CanActivateAppGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateAppGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
