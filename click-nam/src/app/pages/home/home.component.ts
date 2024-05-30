import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CardRestauranteComponent } from '../../components/card-restaurante/card-restaurante.component';
import { RestauranteService } from '../../shared/services/restaurante.service';
import { Restaurante } from '../../shared/models/restaurante';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../shared/modals/modal/modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, NgbTimepickerModule, HttpClientModule, CommonModule, CardRestauranteComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'

})

export class HomeComponent implements OnInit {
  
  //Variables del formulario
  date!:Date;
  dia: number = 0;
  mes:number = 0;
  ano: number = 0;
  hora: string = '';
  capacidad: number = 0;
  ciudad: string = '';

  restaurante: Restaurante[] = [];

  //Envio de formulario
  submitForm() {
    if(this.date && this.hora && this.capacidad && this.ciudad){
      this.dia = (this.date as any).day;
      this.mes = (this.date as any).month;
      this.ano = (this.date as any).year;
      this.getRestauranteBusqueda(this.ciudad,this.capacidad,this.dia,this.mes,this.ano,this.hora);
    }
  }


  constructor(
    private restauranteService : RestauranteService,
    private modalService: NgbModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getRestaurante();
  }

  // Método que llama al servicio para obtener los restaurantes
  getRestaurante(): void {
    this.restauranteService.getRestaurantes().subscribe(
      (response)=>{
        if(response){
          this.restaurante = response;
        }
      }
    )
  }

  //Lista de restaurantes resultado de la busqueda
  getRestauranteBusqueda(ciudad: string, capacidad: number, dia: number, mes: number, ano: number, hora: string){
    this.restauranteService.getRestaurantesByBusqueda(ciudad,capacidad,dia,mes,ano,hora).subscribe({
      next:(restaurantes)=>{
        //Mandar lista de restaurantes al componente de las reservas
        this.router.navigate(['restaurantes-filtrados']);
      },error: () => {
        //modal para avisos de que no hay coincidencias
        this.openModal('No hay coincidencias','No se han encontrado restaurantes con los filtros indicados.');
      }
    }
    )
  }
  //Abrir el modal pasandole un titulo y contenido a mostrar
  openModal(title:string, contenido:string): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = contenido;
    modalRef.componentInstance.msg = true;
  }
}
