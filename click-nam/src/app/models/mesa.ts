
import { Reserva } from "./reserva";
import { Restaurante } from "./restaurante";


export interface Mesa{
    id: number;
    capacidad: number;
    nombreMesa: string;
    infoMesa: string;
    horaMaxima: number;
    restaurante: Restaurante;
    reserva?: Reserva[];

}