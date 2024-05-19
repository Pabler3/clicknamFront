import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RestauranteService } from '../../services/restaurante.service';
import { Usuario } from '../../models/usuario';
import { AuthLoginService } from '../../services/auth-login.service';

@Component({
  selector: 'app-registro-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
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
    private authLoginService: AuthLoginService
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
            console.log('Restaurante registrado con éxito');
            this.router.navigate(['/dashboard-restaurante']); //verificar 
            this.altaRestForm.reset();
          },
          error: error => {
            console.error('Error durante el registro del restaurante', error);
            console.log(formData, this.usuario?.id)
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
      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.altaRestForm.patchValue({
            foto_portada: reader.result
          });
          // necesitamos activar el flag para que la validación se ejecute
          this.altaRestForm.get('foto_portada')!.updateValueAndValidity();
        };
      }
    }

    goBack() {
      window.history.back();  // Usa el historial del navegador para ir a la página anterior
    }


}
