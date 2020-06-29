import { TestBed } from '@angular/core/testing';

import { FcmTokensService } from './fcm-tokens.service';

describe('FcmTokensService', () => {
  let service: FcmTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FcmTokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
