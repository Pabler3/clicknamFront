import { Reserva } from "./reserva";

export interface Usuario {
    id?: number;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    contraseña: string;
    rol: string;
    reserva?: Reserva[];

}