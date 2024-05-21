import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../../environments/environment';

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
}
