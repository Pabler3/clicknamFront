import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthLoginService } from '../services/auth-login.service';
import { Usuario } from '../models/usuario';
import { ModalUpdateComponent } from '../modals/modal-update/modal-update.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{

  //guardamos los datos en la variable usuario.
  usuario: Usuario | null = null;

  constructor(private authLoginService: AuthLoginService, 
    private router: Router,
    private modalService: NgbModal,){}
  
  //nos suscribimos al metodo para obtener cambios en el usuario y sus datos.
  ngOnInit(): void {
    this.authLoginService.currentUser.subscribe(user => {
      this.usuario = user;
    })
  }

  //metodo para cerrar sesion el usuario.
  logout(): void {
    this.authLoginService.logout();
    this.router.navigate(['/home']);
  }

  openModal(): void {
    const modalRef = this.modalService.open(ModalUpdateComponent);
    modalRef.componentInstance.usuario = this.usuario;
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => {
      if(result){
        this.usuario = result;
      } 
    })
  }


}
