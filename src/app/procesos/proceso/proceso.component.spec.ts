import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosComponent } from './proceso.component';

describe('ProcesosComponent', () => {
  let component: ProcesosComponent;
  let fixture: ComponentFixture<ProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
