import { TestBed } from '@angular/core/testing';

import { LeadServiceTs } from './lead.service.ts';

describe('LeadServiceTs', () => {
  let service: LeadServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
