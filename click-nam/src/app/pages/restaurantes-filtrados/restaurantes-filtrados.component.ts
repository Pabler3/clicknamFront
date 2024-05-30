import { Component } from '@angular/core';
import { Restaurante } from '../../shared/models/restaurante';
import { RestauranteService } from '../../shared/services/restaurante.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReservaComponent } from '../../shared/modals/modal-reserva/modal-reserva.component';
import { Busqueda } from '../../shared/models/busqueda';
import { Usuario } from '../../shared/models/usuario';
import { AuthLoginService } from '../../shared/services/auth-login.service';
import { Router, RouterModule } from '@angular/router';
import { ReservaService } from '../../shared/services/reserva.service';
import { ModalComponent } from '../../shared/modals/modal/modal.component';
import { Reserva } from '../../shared/models/reserva';

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
            this.openModal(true, this.usuario?.nombre, reserva);
            this.router.navigate(['/home']);
          },
          error: () => {
            this.openModal(true, this.usuario?.nombre, reserva ,'error');
          }
        });
      }
    })
    }else{
      this.router.navigateByUrl('/log-in');
    }
    
  }

 // Método para abrir el modal, le metemos los datos mediante input. Se podrían meter más.
openModal(msg?: boolean, title?: string, reserva?:Reserva, error?: string, ): void {
  const modalRef = this.modalService.open(ModalComponent);
  
  if (msg) {
    modalRef.componentInstance.title = this.usuario?.nombre + ' ' + this.usuario?.apellido;
    
    // si es un error y si es un alta o actualización
    if (error === 'error') {
        modalRef.componentInstance.content = 'Error durante proceso de la reserva ' + reserva?.id;
      }else {
      // como no es error, es alta o actualización
        modalRef.componentInstance.content =' La reserva con número ' + reserva?.id + ' en ' + reserva?.mesa.restaurante.nombre + ' se ha realizado correctamente, gracias por usar nuestros servicios. En breves recibirá su confirmación por email';
      }
    
    modalRef.componentInstance.msg = msg; 
    
  } 
}

}

