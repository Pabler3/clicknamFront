import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-registro-usuario-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro-usuario-restaurante.component.html',
  styleUrl: './registro-usuario-restaurante.component.css'
})
export class RegistroUsuarioRestauranteComponent implements OnInit {

  registerForm!: FormGroup;
  formSubmitted: boolean = false; //Variable para controlar si se ha intentado enviar el formulario
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService : UsuarioService
  ){}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')]),
      nombre : this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]+$')]),
      apellido : this.fb.control('', Validators.required),
      telefono : this.fb.control('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      rol: this.fb.control('restaurante')
    })
   
  }

  // Metodo para registro usuario con rol restaurante
  registroRest() {
    if (this.registerForm.valid) {
      this.usuarioService.registerUser(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.registerForm.reset();
          this.router.navigate(['/dashboard-restaurante']);
        },
        error: (error) => {
          if (error.status === 409) { // Conflicto porque el email ya esta en uso
            console.error('El email ya está registrado');
          } else {
            console.error('Error durante el registro');
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

}
