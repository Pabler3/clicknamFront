import { Component } from '@angular/core';
import { Restaurante } from '../models/restaurante';
import { RestauranteService } from '../services/restaurante.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modals/modal/modal.component';
import { ModalReservaComponent } from '../modals/modal-reserva/modal-reserva.component';

@Component({
  selector: 'app-restaurantes-filtrados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurantes-filtrados.component.html',
  styleUrl: './restaurantes-filtrados.component.css'
})
export class RestaurantesFiltradosComponent {

  restaurante?: Restaurante[];

  constructor(
    private restauranteService : RestauranteService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.restauranteService.restaurantesF$.subscribe(
      response =>{
        this.restaurante = response;
      }
    )
  }


  // Metodo que comprueba si es jpeg o png para renderizarla como base64
  getMediaType(base64String: string): string {
    if (base64String.startsWith('/9j/')) {
      return 'data:image/jpeg;base64,';
    } else if (base64String.startsWith('iVBORw0KGgo')) {
      return 'data:image/png;base64,';
    }
    return ''; // o un valor por defecto
  }

  goBack() {
    window.history.back();  // Usa el historial del navegador para ir a la página anterior
  }

  openModalReserva(){
    const modalRef = this.modalService.open(ModalReservaComponent, {size: 'xl' });
    modalRef.componentInstance.restaurante = this.restaurante;

    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => {
      if(result){
        this.restaurante = result;
      }
    })
  }


}

