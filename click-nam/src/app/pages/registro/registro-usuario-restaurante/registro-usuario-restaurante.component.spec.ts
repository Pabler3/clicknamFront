import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioRestauranteComponent } from './registro-usuario-restaurante.component';

describe('RegistroUsuarioRestauranteComponent', () => {
  let component: RegistroUsuarioRestauranteComponent;
  let fixture: ComponentFixture<RegistroUsuarioRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroUsuarioRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroUsuarioRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
