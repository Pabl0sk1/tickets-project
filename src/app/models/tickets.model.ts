import { Timestamp } from "firebase/firestore";

export interface Tickets {
    id: string,
    asunto: string,
    descripcion: string,
    estado: string,
    fechahora: Timestamp,
    asignado_a: string
}