import { Mesa } from "./mesa";
import { Usuario } from "./usuario";

export interface Reserva {
    id: number;
    horaFin: string;
    dia: string;
    horaInicio: string;
    usuario: Usuario;
    mesa: Mesa;
}