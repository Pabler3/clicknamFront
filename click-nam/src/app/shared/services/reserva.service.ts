import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private http : HttpClient) { }


  //servicio que te devuelve una reserva previa segun los filtros de la busqueda home
  getReservaPrevia(ciudad: string, capacidad: number, dia: number, mes: number, ano: number, hora: string, id:number):Observable<Reserva>{
    const params = new HttpParams()
      .set('ciudad', ciudad)
      .set('capacidad', capacidad.toString())
      .set('dia', dia.toString())
      .set('mes', mes.toString())
      .set('ano', ano.toString())
      .set('hora', hora)
      .set('id',id);

      return this.http.get<Reserva>(`${ENVIRONMENT.databaseUrl}/reservas/reservaPrevia`, { params: params })
      .pipe(map((reserva:Reserva) =>{
          return reserva;
        })
      );
  }
  
  //servicio para realizar una reserva
  realizarReserva(reserva:Reserva):Observable<Reserva>{
    return this.http.post<Reserva>(`${ENVIRONMENT.databaseUrl}/reservas`,reserva);
  }

  // Servicio para obtener reservas por ID de restaurante
  getReservasByRestauranteId(id: any): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${ENVIRONMENT.databaseUrl}/reservas/restaurante/${id}`);
  }

  //servicio para devolver una lista de reservas por id de cliente
  getReservasUsuario(id:number):Observable<Reserva[]>{
    return this.http.get<Reserva[]>(`${ENVIRONMENT.databaseUrl}/reservas/usuario/${id}`);
  }

  //servicio para borrar una reserva de un usuario por id
  deleteReservaUsuario(id:number):Observable<Reserva>{
    return this.http.delete<Reserva>(`${ENVIRONMENT.databaseUrl}/reservas/${id}`);
  }
}
