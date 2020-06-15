import { TestBed } from '@angular/core/testing';

import { SignInEmailService } from './signin-email.service';

describe('SigninEmailService', () => {
  let service: SignInEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignInEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
