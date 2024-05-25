import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mesa } from '../models/mesa';
import { CommonModule } from '@angular/common';
import { MesaComponent } from '../mesa/mesa.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacionComponent } from '../modals/modal-confirmacion/modal-confirmacion.component';
import { MesasService } from '../services/mesas.service';

@Component({
  selector: 'app-card-mesa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-mesa.component.html',
  styleUrl: './card-mesa.component.css'
})
export class CardMesaComponent implements OnInit{
  

  @Input() mesa!: Mesa;
  @Output() mesaBorrada: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private mesaService: MesasService
  ){}

  ngOnInit(): void {
    console.log(this.mesa);
  }


  actualizarMesa(){
    this.openModalMesa();
  }
  borrarMesa(){
    this.mesaService.borrarMesa(this.mesa).subscribe({
      next:() =>{
        this.mesaBorrada.emit();
        console.log('Mesa borrada');
      },
      error: error =>{
        console.log('Error al borrar');
      }
    });
  }

  openModalMesa(): void {
    const modalRef = this.modalService.open(MesaComponent);
    modalRef.componentInstance.restaurante = this.mesa?.restaurante;
    modalRef.componentInstance.mesa = this.mesa;
    modalRef.componentInstance.actualizar = true;
  
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => { 
      if(result){
       this.mesa = result;
      } 
    })
  }
  openModalConfirmacion(): void {
    const modalRef = this.modalService.open(ModalConfirmacionComponent);
    modalRef.componentInstance.mensaje = '¿ Esta seguro de que desea borrar '+this.mesa?.nombreMesa+' ?';
    modalRef.componentInstance.title = this.mesa.restaurante.nombre;
  
    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => { 
      if(result && result == 'SI'){
        this.borrarMesa();
      } 
    })
  }
}
