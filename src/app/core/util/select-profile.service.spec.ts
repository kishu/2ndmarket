import { TestBed } from '@angular/core/testing';

import { SelectProfileService } from './select-profile.service';

describe('SelectProfileService', () => {
  let service: SelectProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
