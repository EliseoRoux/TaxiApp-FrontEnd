export interface Cliente {
  idCliente?: number;
  nombre: string;
  telefono: string;
}

export type ClienteFormData = Omit<Cliente, 'idCliente' | 'fechaCreacion' | 'totalServicios'>;

export interface ClienteResponse {
  idCliente: number;
  nombre: string;
  telefono: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  totalServicios: number;
}

