export interface Conductor {
  idConductor: number;
  nombre: string;
  telefono: string;
  deuda?: number | null;
  dineroGenerado?: number | null;
}

export interface Cliente {
  idCliente?: number;
  nombre: string;
  telefono: string;
}

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
  conductor: Conductor | null;
  cliente: Cliente | null;
  mascota: boolean;
  silla: boolean;
  viajeLargo: boolean;
}

export type ReservaFormData = Omit<Reserva, 'idReserva'>;