import { Timestamp } from "firebase/firestore";

export interface Tickets {
    id: string,
    asunto: string,
    descripcion: string,
    estado: string,
    fecha_creacion: Timestamp,
    asignado_a: string
}