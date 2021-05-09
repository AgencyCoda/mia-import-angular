import { TestBed } from '@angular/core/testing';

import { MiaImportService } from './mia-import.service';

describe('MiaImportService', () => {
  let service: MiaImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiaImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
