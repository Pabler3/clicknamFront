import { Mesa } from "./mesa";
import { Usuario } from "./usuario";

export interface Restaurante {
    id: number;
    descripcion_corta: string;
    direccion: string;
    foto_portada: any;
    nombre: string;
    poblacion: string;
    telefono: string;
    tipo_comida: string;
    precio_medio: number;
    usuario: Usuario;
    mesa: Mesa[];

}