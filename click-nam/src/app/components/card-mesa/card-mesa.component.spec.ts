import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMesaComponent } from './card-mesa.component';

describe('CardMesaComponent', () => {
  let component: CardMesaComponent;
  let fixture: ComponentFixture<CardMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
