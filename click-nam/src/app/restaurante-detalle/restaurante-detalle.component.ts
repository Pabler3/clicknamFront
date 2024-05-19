import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../services/restaurante.service';
import { Restaurante } from '../models/restaurante';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurante-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-detalle.component.html',
  styleUrl: './restaurante-detalle.component.css'
})
export class RestauranteDetalleComponent implements OnInit {

  restaurante!: Restaurante;

  constructor(
    private restauranteService : RestauranteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID del restaurante de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getRestauranteById(id);
    }
  }

  // Llamamos al servicio para obtener el restaurante por su ID
  getRestauranteById(id: any): void {
    this.restauranteService.getRestauranteById(id).subscribe({
      next: (response) => {
        this.restaurante = response
      },
      error: (error) => {
        console.error('Error al cargar el restaurante:', error);
      }
    });
  }

    //Funcion que comprueba si es jpeg o png para renderizarla como base64 
    getMediaType(base64String: string): string {
      if (base64String.startsWith('/9j/')) {
        return 'data:image/jpeg;base64,';
      } else if (base64String.startsWith('iVBORw0KGgo')) {
        return 'data:image/png;base64,';
      }
      return ''; 
    }

}
