import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {


  constructor(private http: HttpClient) { }
  // Servicio para verificar email
  checkEmailVerify(email: string): Observable<boolean>{
    return this.http.get<boolean>(`${ENVIRONMENT.databaseUrl}/usuarios/check-email?email=${email}`);
  }

  // Servicio para registrar un usuario
  registerUser(usuario: Usuario): Observable<any>{
    return this.http.post<any>(`${ENVIRONMENT.databaseUrl}/usuarios/register`, usuario);
  }
  // Servicio para actualizar un usuario
  updateUser(usuario: Usuario): Observable<Usuario>{
    return this.http.put<any>(`${ENVIRONMENT.databaseUrl}/usuarios`, usuario);
  }
}
