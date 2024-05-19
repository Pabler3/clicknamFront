import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantesFiltradosComponent } from './restaurantes-filtrados.component';

describe('RestaurantesFiltradosComponent', () => {
  let component: RestaurantesFiltradosComponent;
  let fixture: ComponentFixture<RestaurantesFiltradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantesFiltradosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestaurantesFiltradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
