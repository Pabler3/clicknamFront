import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { Usuario } from '../../models/usuario';
import { AuthLoginService } from '../../services/auth-login.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modals/modal/modal.component';

@Component({
  selector: 'app-registro-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './registro-restaurante.component.html',
  styleUrl: './registro-restaurante.component.css'
})
export class RegistroRestauranteComponent implements OnInit {

  altaRestForm!: FormGroup;
  formSubmitted: boolean = false; 
  usuario: Usuario | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private restauranteService: RestauranteService,
    private authLoginService: AuthLoginService,
    private modalService: NgbModal,
  ){}


    ngOnInit(): void {
      this.authLoginService.currentUser.subscribe(user => {
        this.usuario = user;
      })

      this.altaRestForm = this.fb.group({
        descripcion_corta: this.fb.control('', Validators.required),
        tipo_comida: this.fb.control('', Validators.required),
        nombre: this.fb.control('', [Validators.required, Validators.pattern('^[A-Z][a-z]*((\\s[A-Z][a-z]*)+|(\\s&\\s[A-Z][a-z]*))*$')]),
        precio_medio : this.fb.control('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        direccion : this.fb.control('', Validators.required),
        poblacion : this.fb.control('', Validators.required),
        telefono : this.fb.control('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
        foto_portada: [null, Validators.required]
      })

    }

    // Metodo para que un usuario con rol restaurante registre su restaurantes
    altaRest() {
      
      if (this.altaRestForm.valid && this.usuario && this.usuario.id) {
        const formData = {
          ...this.altaRestForm.value,
          foto_portada: this.altaRestForm.get('foto_portada')?.value
        };

        this.restauranteService.registerRestaurante(formData, this.usuario.id).subscribe({
          next: () => {
            this.openModal(true, this.usuario?.nombre, formData.nombre);
            this.router.navigate(['/dashboard-restaurante']); //verificar 
            this.altaRestForm.reset();
          },
          error: error => {
            console.error('Error durante el registro del restaurante', error);
            this.openModal(true, this.usuario?.nombre, formData.nombre, 'error');
          }
        });
      } else {
        console.log('Form has errors', this.altaRestForm.errors);
        this.formSubmitted = true; //marcar el formulario como enviado
        this.altaRestForm.markAllAsTouched();
      }
    }

    //metodo para convertir la imagen a base64 y cargar el archivo
    onFileChange(event: any): void {
      const file = event.target.files[0]; //extraemos el primer archivo seleccionado en el input
    
      if (!file) {
        return; // No se seleccionó ningún archivo, nada más que hacer aquí.
      }
    
      // verificamos el tipo de archivo introducido solo permitiendo que sean de tipo imagen
      if (file.type.match(/image\/*/) == null) {
        this.altaRestForm.get('foto_portada')!.setErrors({ 'invalid': true }); // establece el control como inválido
        this.altaRestForm.get('foto_portada')!.markAsTouched(); // marca el control como tocado para mostrar el mensaje de error
        return;
      }
    
      const reader = new FileReader(); //creamos una instancia de FileReader que nos permite leer el contenido de archivos en el navegador
      reader.readAsDataURL(file); // convertimos el archivo en una cadena de texto en base64
    
      // cuando hemos leido el archivo ejecutamos reader.onload, actualizamos el valor de foto_portada con la imagen en base64
      reader.onload = () => {
        this.altaRestForm.patchValue({
          foto_portada: reader.result
        });
        this.altaRestForm.get('foto_portada')!.updateValueAndValidity(); // actualizamos el estado de validez de foto_portada después de establecer el nuevo valor
      };
    }
    
    

    goBack() {
      window.history.back();  // Usa el historial del navegador para ir a la página anterior
    }

   // Método para abrir el modal, le metemos los datos mediante input. Se podrían meter más.
openModal(msg?: boolean, title?: string, content?:string, error?: string): void {
  const modalRef = this.modalService.open(ModalComponent);
  
  if (msg) {
    modalRef.componentInstance.title = this.usuario?.nombre;
    
    // si es un error y si es un alta o actualización
    if (error === 'error') {
        modalRef.componentInstance.content = 'Error durante el registro de ' + content;
      }else {
      // como no es error
        modalRef.componentInstance.content = content + ' registrado con éxito.';
      } 
    }
    
    modalRef.componentInstance.msg = msg; 
  } 

}
