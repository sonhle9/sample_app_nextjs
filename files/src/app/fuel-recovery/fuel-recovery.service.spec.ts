import {TestBed} from '@angular/core/testing';

import {FuelRecoveryService} from './fuel-recovery.service';

describe('FuelRecoveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FuelRecoveryService = TestBed.get(FuelRecoveryService);
    expect(service).toBeTruthy();
  });
});
