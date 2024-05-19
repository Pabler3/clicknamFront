import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Restaurante } from '../models/restaurante';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-restaurante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-restaurante.component.html',
  styleUrl: './card-restaurante.component.css'
})
export class CardRestauranteComponent {

  @Input() restaurante!: Restaurante;

  constructor(private router: Router){}

  // Metodo que comprueba si es jpeg o png para renderizarla como base64 
  getMediaType(base64String: string): string {
    if (base64String.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,';
    } else if (base64String.startsWith('iVBORw0KGgo')) {
      return 'data:image/png;base64,';
    }
    return ''; // o un valor por defecto
  }
  
  // Metodo que redirige a pagina detalle de cada restaurante
  goToDetalle(rest: Restaurante): void {
    this.router.navigate(['/home-restaurante', rest.id]);
  }


}
