import { TestBed } from '@angular/core/testing';

import { PlantillasService } from './plantillas.service';

describe('CatalogoTipoRegistroService', () => {
  let service: PlantillasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantillasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
