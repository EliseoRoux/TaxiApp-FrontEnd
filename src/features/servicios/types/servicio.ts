export interface Conductor {
  idConductor: number;
  nombre: string;
  telefono: string;
  deuda?: number | null;           // null si no hay valor
  dineroGenerado?: number | null;  // null si no hay valor
}

export interface Cliente {
  idCliente?: number;
  nombre: string;
  telefono: string;
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
  id_conductor: number | null;
  id_cliente: number | null;
  conductor: {
    id_conductor: number;
    nombre: string;
    telefono: string;
    deuda: number | null;
    dinero_generado: number | null;
  }[] | null;  // Array de un único conductor o null
  cliente: {
    id_cliente: number;
    nombre: string;
    telefono: string;
  }[] | null;  // Array de un único cliente o null
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
  conductor: Conductor | null; // Puede ser null
  cliente: Cliente | null;     // Puede ser null
}

export type ServicioFormData = Omit<Servicio, 'id_servicio'>;
