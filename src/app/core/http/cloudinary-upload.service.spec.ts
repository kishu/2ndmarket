import { TestBed } from '@angular/core/testing';

import { CloudinaryUploadService } from './cloudinary-upload.service';

describe('CloudinaryUploadService', () => {
  let service: CloudinaryUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloudinaryUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
