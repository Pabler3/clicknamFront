import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../models/usuario';
import { AuthLoginService } from '../services/auth-login.service';
import { Restaurante } from '../models/restaurante';
import { RestauranteService } from '../services/restaurante.service';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditRestauranteComponent } from '../modals/modal-edit-restaurante/modal-edit-restaurante.component';
import { MesaComponent } from '../mesa/mesa.component';
import { CardMesaComponent } from "../card-mesa/card-mesa.component";
import { Mesa } from '../models/mesa';
import { MesasService } from '../services/mesas.service';


@Component({
    selector: 'app-dashboard-restaurante',
    standalone: true,
    templateUrl: './dashboard-restaurante.component.html',
    styleUrl: './dashboard-restaurante.component.css',
    imports: [CommonModule, RouterModule, CardMesaComponent]
})
export class DashboardRestauranteComponent implements OnInit {


  usuario?: Usuario | null;
  restaurante?: Restaurante;
  mesas: Mesa[] = [];
  
  constructor(
    private authSrv: AuthLoginService,
    private restauranteService : RestauranteService,
    private router: Router,
    private modalService: NgbModal,
    private mesaService: MesasService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authSrv.currentUserValue;
    if(this.usuario) {
      this.getRestauranteByUserId(this.usuario.id)
    } else {
      this.router.navigate(['/log-in']);
    } 
  }

    // Llamamos al servicio para obtener el restaurante de un usuario por su ID
    getRestauranteByUserId(id: any): void {
      this.restauranteService.getRestauranteByUserId(id).subscribe({
        next: (response) => {
          if(response.length > 0){
            this.restaurante = response[0];
            this.getMesasByRestauranteId(this.restaurante?.id)
          }  
        },
        error: (error) => {
          console.error('Error al cargar el restaurante:', error);
        }
      });
    }

    // Llamada al servicio para obtener las mesas que tiene un restaurante
    getMesasByRestauranteId(id: any): void {
      this.mesaService.getMesasByRestauranteId(id).subscribe({
        next: (response) => {
          if(response){
            this.mesas = response;
          }  
        },
        error: (error) => {
          console.error('Error al cargar las mesas:', error);
        }
      });
       
    }
  
      //Metodo que comprueba si es jpeg o png para renderizarla como base64 
      getMediaType(base64String: string): string {
        if (base64String.startsWith('/9j/')) {
          return 'data:image/jpeg;base64,';
        } else if (base64String.startsWith('iVBORw0KGgo')) {
          return 'data:image/png;base64,';
        }
        return ''; 
      }


    //metodo para abrir el modal, le metemos los datos mediante input. Se podrian meter más.
  openModal(): void {
    const modalRef = this.modalService.open(ModalEditRestauranteComponent, {size: 'xl' });
    modalRef.componentInstance.restaurante = this.restaurante;
  
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => { 
      if(result){
        this.restaurante = result;
      } 
    })
  }


    //metodo para abrir el modal de añadir mesa, le metemos los datos mediante input. Se podrian meter más.
    openModalMesa(): void {
      const modalRef = this.modalService.open(MesaComponent);
      modalRef.componentInstance.restaurante = this.restaurante;
    
      //result es una promesa que contiene los resultados al cerrar el modal
      modalRef.result.then((result) => { 
        if(result){
          this.restaurante = result;
          this.getMesasByRestauranteId(this.restaurante?.id)
        } 
      })
    }


}
