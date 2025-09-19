// src/features/reservas/types/reserva.ts

import type { ClienteResponse } from "../../clientes/types/cliente";
import type { ConductorResponse } from "../../conductores/types/conductor";

// La estructura de una Reserva que usamos en toda la aplicación
export interface Reserva {
  idReserva: number;
  origen: string;
  destino: string;
  nPersona: number;
  fechaReserva: string;
  hora: string;
  eurotaxi: boolean;
  requisitos: string;
  precio: number;
  precio10: number;
  mascota: boolean;
  silla: boolean;
  viajeLargo: boolean;
  cliente: ClienteResponse | null;
  conductor: ConductorResponse | null;
}

export type ReservaResponse = Reserva;

// CORRECCIÓN DEFINITIVA DEL TIPO PARA EL FORMULARIO
export type ReservaFormData = Omit<
  Reserva,
  "idReserva" | "cliente" | "conductor"
> & {
  // El formulario necesita los IDs para los menús desplegables
  clienteId: number;
  conductorId: number | null;
};
