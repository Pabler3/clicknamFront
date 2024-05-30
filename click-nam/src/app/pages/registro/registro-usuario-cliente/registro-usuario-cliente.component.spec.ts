import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsuarioClienteComponent } from './registro-usuario-cliente.component';

describe('RegistroUsuarioClienteComponent', () => {
  let component: RegistroUsuarioClienteComponent;
  let fixture: ComponentFixture<RegistroUsuarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroUsuarioClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroUsuarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
