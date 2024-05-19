import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Restaurante } from '../models/restaurante';
import { MesasService } from '../services/mesas.service';


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


  altaMesasForm!: FormGroup;
  formSubmitted: boolean = false; 

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private mesasService: MesasService,
    private router: Router,
  ){}
  

  ngOnInit(): void {

    this.altaMesasForm = this.fb.group({
    infoMesa: this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
    nombreMesa: this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z0-9][a-z0-9]*)*)$')]),
    capacidad : this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    horaMaxima : this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),

  })

  }

  //metodo para cerrar el modal
  closeModal(): void {
    this.activeModal.dismiss('Cross Click');
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
          console.log('Mesa dada de alta con éxito');
          this.activeModal.close(this.restaurante);
          this.altaMesasForm.reset();
        },
        error: error => {
          console.error('Error durante el registro de una nueva mesa', error);
          console.log(formData)
        }
      });
    } else {
      console.log('Form has errors', this.altaMesasForm.errors);
      this.formSubmitted = true; //marcar el formulario como enviado
      this.altaMesasForm.markAllAsTouched();
    }
  }

}
