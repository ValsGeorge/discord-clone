import { TestBed } from '@angular/core/testing';

import { LightdarkService } from './lightdark.service';

describe('LightdarkService', () => {
  let service: LightdarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightdarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
