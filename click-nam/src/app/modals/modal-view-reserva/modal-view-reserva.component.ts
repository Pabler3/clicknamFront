import { Component, Input, OnInit } from '@angular/core';
import { Reserva } from '../../models/reserva';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthLoginService } from '../../services/auth-login.service';
import { Usuario } from '../../models/usuario';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal-view-reserva',
  standalone: true,
  imports: [NgIf],
  templateUrl: './modal-view-reserva.component.html',
  styleUrl: './modal-view-reserva.component.css'
})
export class ModalViewReservaComponent implements OnInit{
  @Input() datosReserva!:Reserva;
  usuario: Usuario | null = null;
  constructor( 
    public activeModal: NgbActiveModal,
    private authLoginService: AuthLoginService){
  }

  ngOnInit(): void {
    this.authLoginService.currentUser.subscribe(user => {
      this.usuario = user;
    })
  }
}
