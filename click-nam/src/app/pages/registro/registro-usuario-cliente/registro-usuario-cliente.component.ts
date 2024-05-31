import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/modals/modal/modal.component';

@Component({
  selector: 'app-registro-usuario-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-usuario-cliente.component.html',
  styleUrl: './registro-usuario-cliente.component.css'
})
export class RegistroUsuarioClienteComponent implements OnInit{
  
  registerForm!: FormGroup;
  formSubmitted: boolean = false; //Variable para controlar si se ha intentado enviar el formulario
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService : UsuarioService,
    private modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')]),
      nombre : this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]+$')]),
      apellido : this.fb.control('', Validators.required),
      telefono : this.fb.control('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      rol: this.fb.control('cliente')
    })
   
  }

  // Metodo para registrar un usuario con rol cliente
  registroClient() {
    if (this.registerForm.valid) {
      this.usuarioService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          this.openModal('Registro exitoso', 'Ya formas parte de la familia Click & Ñam, disfruta la experiencia');
          this.registerForm.reset();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 409) { // Conflicto porque el email ya esta en uso
            this.openModal('Error durante el registro', 'El email ya está registrado con otro usuario, vuelva a intentarlo con otro');
          } else {
            console.error('Error durante el registro', error.error.message || error.message);
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      console.log('El formulario contiene errores', this.registerForm.errors);
    }
  }
  
  goBack() {
    window.history.back();  // Usa el historial del navegador para ir a la página anterior
  }

  // Modal para mostrar informacion sobre el registro
  openModal(title:string, content:string): void{
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.msg = true;
  }


}
