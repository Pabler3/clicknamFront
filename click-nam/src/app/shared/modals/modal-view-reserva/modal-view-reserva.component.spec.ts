import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewReservaComponent } from './modal-view-reserva.component';

describe('ModalViewReservaComponent', () => {
  let component: ModalViewReservaComponent;
  let fixture: ComponentFixture<ModalViewReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewReservaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalViewReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
