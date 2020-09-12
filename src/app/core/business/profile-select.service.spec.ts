import { TestBed } from '@angular/core/testing';

import { ProfileSelectService } from './profile-select.service';

describe('ProfileSelectService', () => {
  let service: ProfileSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
