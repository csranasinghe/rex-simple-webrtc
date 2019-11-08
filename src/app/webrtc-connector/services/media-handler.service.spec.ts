import { TestBed, inject } from '@angular/core/testing';

import { MediaHandlerService } from './media-handler.service';

describe('MediaHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaHandlerService]
    });
  });

  it('should be created', inject([MediaHandlerService], (service: MediaHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
