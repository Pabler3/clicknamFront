import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurante } from '../models/restaurante';
import { MesasService } from '../services/mesas.service';
import { Mesa } from '../models/mesa';
import { ModalComponent } from '../modals/modal/modal.component';


@Component({
  selector: 'app-mesa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './mesa.component.html',
  styleUrl: './mesa.component.css',
  encapsulation: ViewEncapsulation.None
})
export class MesaComponent {

  @Input() restaurante! : Restaurante;
  @Input() mesa! : Mesa ;
  @Input() actualizar: boolean = false;


  altaMesasForm!: FormGroup;
  formSubmitted: boolean = false; 

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private mesasService: MesasService,
    private router: Router,
    private modalService: NgbModal,
  ){}
  

  ngOnInit(): void {
    if(!this.mesa){
      this.altaMesasForm = this.fb.group({
        infoMesa: this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
        nombreMesa: this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
        capacidad : this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        horaMaxima : this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      })
    }else{
      this.altaMesasForm = this.fb.group({
        infoMesa: this.fb.control(this.mesa.infoMesa, [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
        nombreMesa: this.fb.control(this.mesa.nombreMesa, [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
        capacidad : this.fb.control(this.mesa.capacidad, [Validators.required, Validators.pattern('^[0-9]+$')]),
        horaMaxima : this.fb.control(this.mesa.horaMaxima, [Validators.required, Validators.pattern('^[0-9]+$')]),
      })
    }
  }

  //metodo para cerrar el modal
  closeModal(): void {
    this.activeModal.close();
  }

  // Metodo para dar de alta una mesa
  altaMesa():void{
    
    if (this.altaMesasForm.valid) {

      const formData = {
        ...this.altaMesasForm.value,
        restaurante: this.restaurante
      };

      this.mesasService.registerMesa(formData).subscribe({
        next: () => {
          this.activeModal.close(this.restaurante);
          this.altaMesasForm.reset();
          this.openModal(false, true, formData.nombreMesa);
        },
        error: error => {
          console.error('Error durante el registro de una nueva mesa', error);
          this.openModal(false, true, formData.nombreMesa, 'error');
        }
      });
    } else {
      console.log('Form has errors', this.altaMesasForm.errors);
      this.formSubmitted = true; //marcar el formulario como enviado
      this.altaMesasForm.markAllAsTouched();
    }
  }

  actualizarMesa(){
    if (this.altaMesasForm.valid) {
      this.mesa.infoMesa = this.altaMesasForm.get('infoMesa')?.value;
      this.mesa.nombreMesa = this.altaMesasForm.get('nombreMesa')?.value;
      this.mesa.capacidad = this.altaMesasForm.get('capacidad')?.value;
      this.mesa.horaMaxima =  this.altaMesasForm.get('horaMaxima')?.value;

      this.mesasService.actualizarMesa(this.mesa).subscribe({
        next: () => {
          console.log('Mesa actualizada con éxito');
          this.activeModal.close(this.mesa);
          this.openModal(true, true, this.mesa.nombreMesa);
        },
        error: error => {
          console.error('Error durante la actualización de la mesa', error);
          this.openModal(true, true, this.mesa.nombreMesa, 'error');
        }
      });
    } else {
      console.log('Form has errors', this.altaMesasForm.errors);
      this.formSubmitted = true; //marcar el formulario como enviado
      this.altaMesasForm.markAllAsTouched();
    }
  }

 // Método para abrir el modal, le metemos los datos mediante input. Se podrían meter más.
openModal(update?: boolean, msg?: boolean, title?: string, error?: string): void {
  const modalRef = this.modalService.open(ModalComponent);
  
  if (msg) {
    modalRef.componentInstance.title = this.restaurante.nombre;
    
    // si es un error y si es un alta o actualización
    if (error === 'error') {
      if (update) {
        modalRef.componentInstance.content = 'Error durante la actualización de ' + title;
      } else {
        modalRef.componentInstance.content = 'Error durante el registro de ' + title;
      }
    } else {
      // como no es error, es alta o actualización
      if (update) {
        modalRef.componentInstance.content = title + ' actualizada con éxito.';
      } else {
        modalRef.componentInstance.content = title + ' dada de alta con éxito.';
      }
    }
    
    modalRef.componentInstance.msg = msg; 
  } 
}



}
