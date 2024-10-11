import { TestBed } from '@angular/core/testing';

import { ApifyService } from './apify.service';

describe('ApifyService', () => {
  let service: ApifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
