import { TestBed } from '@angular/core/testing';

import { AjusteServidorService } from './ajusteservidor.service';

describe('AjusteServidorService', () => {
  let service: AjusteServidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AjusteServidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
