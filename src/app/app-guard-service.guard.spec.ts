import { TestBed } from '@angular/core/testing';

import { AppGuardServiceGuard } from './app-guard-service.guard';

describe('AppGuardServiceGuard', () => {
  let guard: AppGuardServiceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppGuardServiceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
