// Tipos para los objetos anidados, para mantener la consistencia
export interface ConductorEnServicio {
  idConductor: number;
  nombre: string;
  telefono: string;
}

export interface ClienteEnServicio {
  idCliente: number;
  nombre: string;
  telefono: string;
}

// Este es el tipo de dato que usamos en toda la aplicación.
// Lo actualizamos para incluir los nuevos campos booleanos.
export interface Servicio {
  idServicio: number;
  origen: string;
  destino: string;
  precio: number;
  fecha: string;
  hora: string;
  nPersona: number;
  precio10: number;
  requisitos: string;
  eurotaxi: boolean;
  mascota: boolean; // Campo nuevo
  silla: boolean; // Campo nuevo
  viajeLargo: boolean; // Campo nuevo
  cliente: ClienteEnServicio | null;
  conductor: ConductorEnServicio | null;
}

// Este es el alias que usaremos para las respuestas de la API.
export type ServicioResponse = Servicio;

// El formulario trabajará con este tipo de datos.
// Lo ajustamos para que envíe exactamente lo que el backend espera.
export type ServicioFormData = Omit<
  Servicio,
  "idServicio" | "cliente" | "conductor"
> & {
  // En lugar de un idCliente, enviamos el nombre y el teléfono.
  clienteNombre: string;
  clienteTelefono: string;
  // Para el conductor, seguimos usando el ID.
  idConductor: number | null;
};
