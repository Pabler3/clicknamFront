import { Mesa } from "./mesa";
import { Usuario } from "./usuario";

export interface Reserva {
    id: number;
    horaFin: string;
    dia: number;
    mes: number;
    ano: number;
    horaInicio: string;
    usuario: Usuario;
    mesa: Mesa;
}