
// Este tipo representa una entrada en el historial, sea un servicio o una reserva.
export interface HistorialEntry {
  id: string; // Usaremos un ID único como "servicio-1" o "reserva-5"
  tipo: 'Servicio' | 'Reserva';
  fecha: string;
  origen: string;
  destino: string;
  precio: number;
  clienteNombre: string;
}