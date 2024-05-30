import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';
import { Restaurante } from '../models/restaurante';
import { Busqueda } from '../models/busqueda';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  constructor(private http : HttpClient) { }

  //BehaviorSubject observable que utilizaremos para pasar datos de un componente a otro
  private restaurantesFiltro = new BehaviorSubject<Restaurante[]>([]);
  public restaurantesF$ = this.restaurantesFiltro.asObservable();

  //BehaviorSubject observable que utilizaremos con los datos del filtro de busqueda
  private busquedaFiltro = new BehaviorSubject<Busqueda | null >(null);
  public busquedaF$ = this.busquedaFiltro.asObservable();



  // Servicio del filtro de busqueda que hay en el home para reservar
  getRestaurantesByBusqueda(ciudad: string, capacidad: number, dia: number, mes: number, ano: number, hora: string): Observable<Restaurante[]> {
    const params = new HttpParams()
      .set('ciudad', ciudad)
      .set('capacidad', capacidad.toString())
      .set('dia', dia.toString())
      .set('mes', mes.toString())
      .set('ano', ano.toString())
      .set('hora', hora);

    return this.http.get<Restaurante[]>(`${ENVIRONMENT.databaseUrl}/restaurantes/busqueda`, { params: params })
      .pipe(tap(restaurantes => {
        this.restaurantesFiltro.next(restaurantes);
        this.busquedaFiltro.next({ ciudad: ciudad, capacidad: capacidad, dia: dia, mes: mes, ano: ano, horaInicio: hora });
      }));
  }


  // Servicio para obtener todos los restaurantes
  getRestaurantes(): Observable<Restaurante[]>{
    return this.http.get<Restaurante[]>(`${ENVIRONMENT.databaseUrl}/restaurantes/all`).pipe(
      map((response:Restaurante[])=>{
        return response;
      })
    )
  }

  // Servicio para obtener un restaurante por ID
  getRestauranteById(id: any): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${ENVIRONMENT.databaseUrl}/restaurantes/${id}`).pipe(
      map((response: Restaurante) => {
        return response;
      })
    )
  }

    // Servicio para obtener restaurantes por ID de usuario
    getRestauranteByUserId(id: any): Observable<Restaurante[]> {
      return this.http.get<Restaurante[]>(`${ENVIRONMENT.databaseUrl}/restaurantes/user/${id}`).pipe(
        map((response: Restaurante[]) => {
          return response;
        })
      )
    }

  // Servicio para dar de alta un restaurante
  registerRestaurante(restaurante: Restaurante, userId: number): Observable<Restaurante> {
    const params = new HttpParams().append('userId', userId);
    return this.http.post<Restaurante>(`${ENVIRONMENT.databaseUrl}/restaurantes/create`,restaurante,{params: params});
  }

  // Servicio para actualizar un restaurante
  updateRestaurante(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.put<Restaurante>(`${ENVIRONMENT.databaseUrl}/restaurantes/update`,restaurante);
  }


}
