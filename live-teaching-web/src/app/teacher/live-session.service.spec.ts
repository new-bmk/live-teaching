import { TestBed } from '@angular/core/testing';

import { LiveSessionService } from './live-session.service';

describe('LiveSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveSessionService = TestBed.get(LiveSessionService);
    expect(service).toBeTruthy();
  });
});
