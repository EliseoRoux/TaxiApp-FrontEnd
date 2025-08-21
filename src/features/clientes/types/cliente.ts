export interface Cliente {
  idCliente?: number;
  nombre: string;
  telefono: string;
}

export type ClienteFormData = Omit<Cliente, 'idCliente' | 'fechaCreacion' | 'totalServicios'>;

// cliente.ts - Actualizar la interfaz ClienteResponse
// cliente.ts - Update the ClienteResponse interface
export interface ClienteResponse {
  idCliente: number;
  nombre: string;
  telefono: string;
  fechaCreacion: string;
  fechaActualizacion: string | null;  // Change from string to string | null
  totalServicios: number;
  serviciosCount: number;
  reservasCount: number;
}