import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../models/usuario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-modal-update',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ModalUpdateComponent {

  updateForm!: FormGroup;
  formSubmitted: boolean = false;

  @Input() usuario! : Usuario;
  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UsuarioService  
  ){}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      email: this.fb.control(this.usuario?.email, [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]),
      nombre : this.fb.control(this.usuario?.nombre, [Validators.required, Validators.pattern('^[A-Z][a-z]+$')]),
      apellido : this.fb.control(this.usuario?.apellido, Validators.required),
      telefono : this.fb.control(this.usuario?.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      rol: this.fb.control(this.usuario.rol)
      
    })
    
    
  }  
  updateUser():void{
    if (this.updateForm.valid) {
      this.usuario={
        ...this.usuario,
        nombre:this.updateForm.get('nombre')?.value,
        apellido:this.updateForm.get('apellido')?.value,
        email:this.updateForm.get('email')?.value,
        telefono:this.updateForm.get('telefono')?.value,
        rol:this.updateForm.get('rol')?.value,
      } 
      this.userService.updateUser(this.usuario).subscribe({
        next: (user) => {
          console.log('Registro exitoso', user);
          this.updateForm.reset();
          this.activeModal.close(user);
        },
        error: (error) => {
          if (error.status === 409) { // Conflicto porque el email ya esta en uso
            this.updateForm.controls['email'].setErrors({ emailInUse: true });
            this.updateForm.markAllAsTouched();  
          } else {
            console.error('Error durante la actualizacion');
          }
        }
      });
    
    } else {
      this.updateForm.markAllAsTouched();
      console.log('El formulario contiene errores', this.updateForm.errors); 
    }    
  }
    
  closeModal(): void {
    this.activeModal.close();
  }
  
}
