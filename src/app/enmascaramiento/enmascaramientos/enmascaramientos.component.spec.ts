import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnmascaramientoComponent } from './enmascaramientos.component';

describe('EnmascaramientoComponent', () => {
  let component: EnmascaramientoComponent;
  let fixture: ComponentFixture<EnmascaramientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnmascaramientoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnmascaramientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
