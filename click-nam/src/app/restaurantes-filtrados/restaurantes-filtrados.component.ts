import { Component } from '@angular/core';
import { Restaurante } from '../models/restaurante';
import { RestauranteService } from '../services/restaurante.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReservaComponent } from '../modals/modal-reserva/modal-reserva.component';
import { Busqueda } from '../models/busqueda';
import { Usuario } from '../models/usuario';
import { AuthLoginService } from '../services/auth-login.service';
import { Router, RouterModule } from '@angular/router';
import { ReservaService } from '../services/reserva.service';
import { ModalComponent } from '../modals/modal/modal.component';

@Component({
  selector: 'app-restaurantes-filtrados',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './restaurantes-filtrados.component.html',
  styleUrl: './restaurantes-filtrados.component.css'
})
export class RestaurantesFiltradosComponent {

  restaurante?: Restaurante[];
  busqueda!: Busqueda | null ;
  usuario? : Usuario | null;

  constructor(
    private restauranteService : RestauranteService,
    private modalService: NgbModal,
    private authSrv: AuthLoginService,
    private router: Router,
    private reservaService: ReservaService
  ) { }

  ngOnInit(): void {
    this.restauranteService.restaurantesF$.subscribe(response =>this.restaurante = response);
    this.restauranteService.busquedaF$.subscribe(detalles => this.busqueda = detalles);
    this.usuario = this.authSrv.currentUserValue;
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

  openModalReserva(restaurante: Restaurante){
    if(this.usuario){
      const modalRef = this.modalService.open(ModalReservaComponent, {size: 'lg' });
      modalRef.componentInstance.restaurante = restaurante;
      modalRef.componentInstance.busqueda = this.busqueda;

      //result es una promesa que contiene los resultados al cerrar el modal
      modalRef.result.then((reserva) => {
      if(reserva){
        reserva.usuario = this.usuario;
        this.reservaService.realizarReserva(reserva).subscribe({
          next: (reserva) => {
            this.openModal('Reserva realizada','La reserva se ha realizado correctamente, gracias por usar nuestros servicios');
          },
          error: () => {
            this.openModal('Error','Error al realizar la reserva, por favor, vuelva a intentarlo');
          }
        });
      }
    })
    }else{
      this.router.navigateByUrl('/log-in');
    }
    
  }

  //Abrir el modal pasandole un titulo y contenido a mostrar
  openModal(title:string, contenido:string): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = contenido;
    modalRef.componentInstance.msg = true;
  }

}

