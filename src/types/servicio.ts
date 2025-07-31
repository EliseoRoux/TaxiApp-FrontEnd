// Define la interfaz para el conductor
export interface Conductor {
  id_conductor: number;  // ID único del conductor
  nombre: string;       // Nombre del conductor
  telefono: string;     // Teléfono del conductor
}

// Define la interfaz principal para el servicio
export interface Servicio {
  id_servicio: number;  // ID único del servicio
  origen: string;       // Dirección de origen
  destino: string;      // Dirección de destino
  precio: number;       // Precio del servicio
  conductor: Conductor; // Objeto con los datos del conductor
}

export interface Cliente {
  id_cliente: number;
  nombre: string;
  telefono: string;
}