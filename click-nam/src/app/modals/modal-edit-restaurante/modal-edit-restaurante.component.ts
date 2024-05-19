import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Restaurante } from '../../models/restaurante';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-modal-edit-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './modal-edit-restaurante.component.html',
  styleUrl: './modal-edit-restaurante.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ModalEditRestauranteComponent implements OnInit {


  @Input() restaurante! : Restaurante

  editRestForm!: FormGroup;
  formSubmitted: boolean = false; 

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private restauranteService: RestauranteService,
    private router: Router
  ){}
  

  ngOnInit(): void {
    
    this.editRestForm = this.fb.group({
    descripcion_corta: this.fb.control(this.restaurante?.descripcion_corta, Validators.required),
    tipo_comida: this.fb.control(this.restaurante?.tipo_comida, Validators.required),
    nombre: this.fb.control(this.restaurante?.nombre, [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z][a-z]*)+|(\\s&\\s[A-Z][a-z]*))*$')]),
    precio_medio : this.fb.control(this.restaurante?.precio_medio, [Validators.required, Validators.pattern('^[0-9]+$')]),
    direccion : this.fb.control(this.restaurante?.direccion, Validators.required),
    poblacion : this.fb.control(this.restaurante?.poblacion, Validators.required),
    telefono : this.fb.control(this.restaurante?.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
    foto_portada: [this.restaurante?.foto_portada, Validators.required]
  })

  }

  //metodo para convertir la imagen a base64 y cargar el archivo
  onFileChange(event: any): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.editRestForm.patchValue({
          foto_portada: reader.result
        });
        // necesitamos activar el flag para que la validación se ejecute
        this.editRestForm.get('foto_portada')!.updateValueAndValidity();
      };
    }
  }

  //metodo para cerrar el modal
  closeModal(): void {
    this.activeModal.dismiss('Cross Click');
  }

  editRest():void{

    if (this.editRestForm.valid) {
      const formData = {
        ...this.editRestForm.value,
        foto_portada: this.editRestForm.get('foto_portada')?.value
      };
      this.restaurante = {
        ...this.restaurante,
        descripcion_corta: this.editRestForm.get('descripcion_corta')?.value,
        tipo_comida: this.editRestForm.get('tipo_comida')?.value,
        nombre: this.editRestForm.get('nombre')?.value,
        precio_medio : this.editRestForm.get('precio_medio')?.value,
        direccion : this.editRestForm.get('direccion')?.value,
        poblacion : this.editRestForm.get('poblacion')?.value,
        telefono : this.editRestForm.get('telefono')?.value,
        foto_portada: this.editRestForm.get('foto_portada')?.value
      }

      this.restauranteService.updateRestaurante(this.restaurante).subscribe({
        next: (restaurante) => {
          console.log('Restaurante actualizado con éxito'); 
          this.editRestForm.reset();
          this.activeModal.close(restaurante);
        },
        error: error => {
          console.error('Error durante la actualizacion del restaurante', error);
          console.log(formData)
        }
      });
    } else {
      console.log('Form has errors', this.editRestForm.errors);
      this.formSubmitted = true; //marcar el formulario como enviado
      this.editRestForm.markAllAsTouched();
    }

  }
  
}
