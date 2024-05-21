import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Restaurante } from '../../models/restaurante';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestauranteService } from '../../services/restaurante.service';
import { AuthLoginService } from '../../services/auth-login.service';
import { Usuario } from '../../models/usuario';
import { Busqueda } from '../../models/busqueda';
import { Reserva } from '../../models/reserva';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-modal-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './modal-reserva.component.html',
  styleUrl: './modal-reserva.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ModalReservaComponent implements OnInit {

  @Input() restaurante! : Restaurante
  @Input() busqueda!: Busqueda;

  reserva!: Reserva;

  usuario: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authLoginService: AuthLoginService,
    private reservaService: ReservaService
  ){}


  ngOnInit(): void {
    this.authLoginService.currentUser.subscribe(user => {
      this.usuario = user;
    })
    this.getReservaPrevia();
}
  //metodo para cerrar el modal
  closeModal(): void {
    this.activeModal.dismiss();
  }

  getReservaPrevia(){
    this.reservaService.getReservaPrevia(this.busqueda.ciudad,this.busqueda.capacidad,this.busqueda.dia,this.busqueda.mes,this.busqueda.ano,this.busqueda.horaInicio,this.restaurante.id).subscribe({
        next:(reserva:Reserva)=>{
          console.log(reserva);
          this.reserva = reserva;
        },error: (error) => {
          // No hay mesas disponibles 
          console.log(error);
        }
      }
      )
    }
}
