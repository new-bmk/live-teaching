import { TestBed } from '@angular/core/testing';

import { SessionCrudService } from './session-crud.service';

describe('SessionCrudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionCrudService = TestBed.get(SessionCrudService);
    expect(service).toBeTruthy();
  });
});
