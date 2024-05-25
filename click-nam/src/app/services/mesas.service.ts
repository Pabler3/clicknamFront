import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ENVIRONMENT } from '../../environments/environment'; 
import { Mesa } from '../models/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  constructor(private http : HttpClient) { }


  // Servicio para dar de alta una mesa en un restaurante
  registerMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(`${ENVIRONMENT.databaseUrl}/mesas`,mesa);
  }
  actualizarMesa(mesa:Mesa):Observable<Mesa>{
    return this.http.put<Mesa>(`${ENVIRONMENT.databaseUrl}/mesas`,mesa);
  }
  borrarMesa(mesa:Mesa){
    return this.http.put<Mesa>(`${ENVIRONMENT.databaseUrl}/mesas/mesa`,mesa);
  }
  // Servicio para obtener mesas de un restaurante por ID
  getMesasByRestauranteId(id: any): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${ENVIRONMENT.databaseUrl}/mesas/restaurante/${id}`).pipe(
      map((response: Mesa[]) => {
        return response;
      })
    )
  }

}
