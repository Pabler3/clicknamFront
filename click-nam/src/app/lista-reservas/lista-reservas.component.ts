import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Usuario } from '../models/usuario';
import { ReservaService } from '../services/reserva.service';
import { AuthLoginService } from '../services/auth-login.service';
import { CommonModule} from '@angular/common';
import { ModalConfirmacionComponent } from '../modals/modal-confirmacion/modal-confirmacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modals/modal/modal.component';
import { RouterModule } from '@angular/router';
import { ModalViewReservaComponent } from '../modals/modal-view-reserva/modal-view-reserva.component';

@Component({
  selector: 'app-lista-reservas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-reservas.component.html',
  styleUrl: './lista-reservas.component.css'
})
export class ListaReservasComponent implements OnInit{
  usuario : Usuario | null = null;
  reservas! :Reserva[];
  hayReservas:boolean = false;

  constructor(
    private reservaService:ReservaService,
    private modalService: NgbModal,
    private authLoginService: AuthLoginService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.authLoginService.currentUser.subscribe(user => {
      this.usuario = user;
      if(user && user.id){
        this.getReservas(user.id);
      }
      
    })
  }

  //metodo para ver las reservas que tiene un usuario
  getReservas(id:number){
    this.reservaService.getReservasUsuario(id).subscribe({
      next:(reservas)=>{
        this.reservas = reservas;
        this.hayReservas = true;
        this.cdr.detectChanges();
      },
      error:(error)=>{
        this.hayReservas = false;
        this.cdr.detectChanges();
      }
    });    
  }
  //Modal de confirmacion borrado reserva
  openModalConfirmacion(id:number): void {
    const modalRef = this.modalService.open(ModalConfirmacionComponent);
    modalRef.componentInstance.mensaje = '¿ Esta seguro de que desea cancelar la reserva ?';
    modalRef.componentInstance.title = 'Cancelar reserva';
  
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => { 
      if(result && result == 'SI'){
        this.borrarReserva(id);
      } 
    })
  }


  //metodo para borrar una reserva
  borrarReserva(id:number){
    this.reservaService.deleteReservaUsuario(id).subscribe({
      next:()=>{
        this.openModal('Reserva cancelada','Se ha cancelado la reserva');
        if(this.usuario && this.usuario.id){
          this.getReservas(this.usuario.id);
        }
      },
      error:(error)=>{
        this.openModal('Error de cancelación','En estos momentos no se ha podido cancelar la reserva, intentelo mas tarde');
      }
    });
  }
  
  //Abrir el modal pasandole un titulo y contenido a mostrar
  openModal(title:string, contenido:string): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = contenido;
    modalRef.componentInstance.msg = true;
  }
  openModalReserva(reserva:Reserva){
    const modalRef = this.modalService.open(ModalViewReservaComponent, {size: 'lg' });
    modalRef.componentInstance.hayReservas = true;
    modalRef.componentInstance.datosReserva = reserva;
  }


  
}
