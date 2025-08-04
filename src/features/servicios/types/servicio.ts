export interface Conductor {
  id_conductor: number;
  nombre: string;
  telefono: string;
}

export interface Cliente {
  id_cliente: number;
  nombre: string;
}

// Versión para lo que retorna Supabase (con arrays)
export interface ServicioDB {
  id_servicio: number;
  origen: string;
  destino: string;
  precio: number;
  fecha: string;
  eurotaxi: boolean;
  hora: string;
  n_persona: number;
  precio_10: number;
  requisitos: string;
  conductor: Conductor[];
  cliente: Cliente[];
}

// Versión para tu aplicación (con objetos)
export interface Servicio {
  id_servicio: number;
  origen: string;
  destino: string;
  precio: number;
  fecha: string;
  eurotaxi: boolean;
  hora: string;
  nPersona: number;
  precio10: number;
  requisitos: string;
  conductor?: Conductor;
  cliente?: Cliente;
}

export type ServicioFormData = Omit<Servicio, 'id_servicio'>;