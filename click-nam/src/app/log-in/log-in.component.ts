import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modals/modal/modal.component';
import { AuthLoginService } from '../services/auth-login.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {

  loginForm!: FormGroup;
  formSubmitted: boolean = false; //Variable para controlar si se ha intentado enviar el formulario
 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private authLoginService: AuthLoginService
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]+$')]),
    })
  }

  // Metodo para loguearte en la aplicacion
  login() {
    this.formSubmitted = true;
    if(this.loginForm.valid){
      const {email, password} = this.loginForm.value;
      this.authLoginService.login(email, password).subscribe({
        next: response => {
          if(response.rol === 'cliente'){
             this.router.navigate(['/home']); //navegamos a la ruta requerida cliente.
          }else {
            this.router.navigate(['/dashboard-restaurante']); //navegamos a la ruta requerida restaurante.

          }
         
        }, 
        error: error => {
          console.error('Error de autenticación', error);
          alert('Error de autenticación');
        }
      })
    }
  }

  //metodo para abrir el modal, le metemos los datos mediante input. Se podrian meter más.
  openModal(): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Registro Usuario';
    modalRef.componentInstance.content = 'Debes elegir tu forma de registrarte. Si eres dueño de un restaurante y quieres ofertar tu restaurante o si quieres ser un cliente que para poder reservar en ellos.';

    //result es una promesa que contiene los resultados al cerrar el modal
    modalRef.result.then((result) => {
      //lógica para cliente. 
      if(result === 'cliente'){
        this.router.navigateByUrl('/registro-cliente');
        //lógica para restaurante.
      } else if (result === 'restaurante') {
        this.router.navigateByUrl('registro-restaurante');
      }
    })
  }

  
}  
