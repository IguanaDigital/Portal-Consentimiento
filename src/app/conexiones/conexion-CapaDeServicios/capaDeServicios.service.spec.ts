import { TestBed } from '@angular/core/testing';

import { DataService } from './capaDeServicios.service';


describe('CapaDeServicioService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
