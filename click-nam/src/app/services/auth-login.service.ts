import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response';
import { ENVIRONMENT } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {

  //Observable que utilizaremos para el inicio de sesion
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any // Esto inyecta un token que angular usa para tener informacion sobre la plataforma actual (navegador, servidor..)
  ) {
    // Verifica si el codigo se esta ejecutando en un navegador, si no es asi, evita usar sessionStorage
    const storedUser = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  //servicio para loguearte 
  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${ENVIRONMENT.databaseUrl}/usuarios/login`, { email, password }).pipe(
      map(response => {
        if (response) {
          const user: Usuario = response;
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
        return response;
      })
    );
  }

  //servicio para cerrar sesion
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  //metodo para acceder al valor actual del usuario
  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject?.value;
  }

}

