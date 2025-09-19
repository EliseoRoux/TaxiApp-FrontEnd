
import type { ClienteResponse } from "../../clientes/types/cliente";
import type { ConductorResponse } from "../../conductores/types/conductor";

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

export type ReservaFormData = Omit<
  Reserva,
  "idReserva" | "cliente" | "conductor"
> & {
  clienteNombre: string;
  clienteTelefono: string;
  idConductor: number | null;
};
