import { TestBed } from '@angular/core/testing';

import { AppGuard } from './app.guard';

describe('AppGuard', () => {
  let guard: AppGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
