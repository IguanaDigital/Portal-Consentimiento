import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteServidorComponent } from './ajusteservidor.component';

describe('AjusteServidorComponent', () => {
  let component: AjusteServidorComponent;
  let fixture: ComponentFixture<AjusteServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjusteServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjusteServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
