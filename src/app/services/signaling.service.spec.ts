import { TestBed, inject } from '@angular/core/testing';

import { SignalingService } from './signaling.service';

describe('SignalingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalingService]
    });
  });

  it('should be created', inject([SignalingService], (service: SignalingService) => {
    expect(service).toBeTruthy();
  }));
});
