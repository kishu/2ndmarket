import { TestBed } from '@angular/core/testing';

import { UserGroupsService } from './user-groups.service';

describe('UserGroupsService', () => {
  let service: UserGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
