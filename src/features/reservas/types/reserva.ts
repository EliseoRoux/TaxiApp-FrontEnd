import type { ClienteResponse } from "../../clientes/types/cliente";
import type { ConductorResponse } from "../../conductores/types/conductor";

// Actualizamos la estructura de una Reserva para que coincida con el backend.
export interface Reserva {
  idReserva: number;
  origen: string;
  destino: string;
  nPersona: number;
  fechaReserva: string; // El backend envía la fecha como un string
  hora: string;
  eurotaxi: boolean;
  requisitos: string;
  precio: number;
  precio10: number;
  mascota: boolean; // Campo nuevo
  silla: boolean; // Campo nuevo
  viajeLargo: boolean; // Campo nuevo
  cliente: ClienteResponse | null;
  conductor: ConductorResponse | null;
}

export type ReservaResponse = Reserva;

// El tipo de datos que manejará nuestro formulario.
// Lo ajustamos para que envíe exactamente lo que el backend espera.
export type ReservaFormData = Omit<
  Reserva,
  "idReserva" | "cliente" | "conductor"
> & {
  // En lugar de un clienteId, enviamos el nombre y el teléfono.
  clienteNombre: string;
  clienteTelefono: string;
  // Para el conductor, mantenemos el ID.
  conductorId: number | null;
};
