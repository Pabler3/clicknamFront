import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditRestauranteComponent } from './modal-edit-restaurante.component';

describe('ModalEditRestauranteComponent', () => {
  let component: ModalEditRestauranteComponent;
  let fixture: ComponentFixture<ModalEditRestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditRestauranteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalEditRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
