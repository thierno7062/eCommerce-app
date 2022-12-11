import { TestBed } from '@angular/core/testing';

import { NabysyFactureService } from './nabysy-facture.service';

describe('NabysyFactureService', () => {
  let service: NabysyFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NabysyFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
