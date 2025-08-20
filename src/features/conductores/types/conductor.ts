export interface Conductor {
  idConductor?: number;
  nombre: string;
  telefono: string;
  deuda: number;
  dineroGenerado: number;
}

export type ConductorFormData = Omit<Conductor, 'idConductor'>;

export interface ConductorResponse {
  idConductor: number;
  nombre: string;
  telefono: string;
  deuda: number;
  dineroGenerado: number;
}