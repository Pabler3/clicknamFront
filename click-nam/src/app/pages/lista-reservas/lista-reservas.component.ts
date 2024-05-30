import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Reserva } from '../../shared/models/reserva';
import { Usuario } from '../../shared/models/usuario';
import { ReservaService } from '../../shared/services/reserva.service';
import { AuthLoginService } from '../../shared/services/auth-login.service';
import { CommonModule} from '@angular/common';
import { ModalConfirmacionComponent } from '../../shared/modals/modal-confirmacion/modal-confirmacion.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/modals/modal/modal.component';
import { RouterModule } from '@angular/router';
import { ModalViewReservaComponent } from '../../shared/modals/modal-view-reserva/modal-view-reserva.component';

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
  openModalConfirmacion(reserva:Reserva): void {
    const modalRef = this.modalService.open(ModalConfirmacionComponent);
    modalRef.componentInstance.mensaje ='¿ Esta seguro de que desea cancelar tú reserva en ' + reserva.mesa.restaurante.nombre + '?';
    modalRef.componentInstance.title = reserva.usuario.nombre + ' ' + reserva.usuario.apellido;
  
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => { 
      if(result && result == 'SI'){
        this.borrarReserva(reserva.id);
      } 
    })
  }


  //metodo para borrar una reserva
  borrarReserva(id:number){
    this.reservaService.deleteReservaUsuario(id).subscribe({
      next:()=>{
        this.openModal(this.usuario!,'Su reserva a sido cancelada con éxito');
        if(this.usuario && this.usuario.id){
          this.getReservas(this.usuario.id);
        }
      },
      error:(error)=>{
        this.openModal(this.usuario!,'En estos momentos no se ha podido cancelar la reserva, intentelo mas tarde');
      }
    });
  }
  
  //Abrir el modal pasandole un titulo y contenido a mostrar
  openModal(usuario?:Usuario, contenido?:string): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = usuario?.nombre + ' ' + usuario?.apellido;
    modalRef.componentInstance.content = contenido;
    modalRef.componentInstance.msg = true;
  }

  openModalReserva(reserva:Reserva){
    const modalRef = this.modalService.open(ModalViewReservaComponent, {size: 'lg' });
    modalRef.componentInstance.hayReservas = true;
    modalRef.componentInstance.datosReserva = reserva;
  }


  
}
