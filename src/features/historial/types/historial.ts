// Este tipo representa una entrada en el historial, sea un servicio o una reserva.
export interface HistorialEntry {
  id: string; // Usaremos un ID único como "servicio-1" o "reserva-5"
  tipo: "Servicio" | "Reserva";
  fecha: string;
  conductorId?: number; // Puede ser undefined si no hay conductor asignado
  origen: string;
  destino: string;
  precio: number;
  clienteNombre: string;
}
