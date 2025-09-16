import { API_BASE_URL } from "../../../lib/apiClient";
import type {
  Reserva,
  ReservaFormData,
  ReservaResponse,
} from "../types/reserva";

const RESERVA_API_URL = `${API_BASE_URL}/reservas`;

export const fetchReservas = async (): Promise<ReservaResponse[]> => {
  const response = await fetch(RESERVA_API_URL);
  if (!response.ok) throw new Error("Error al obtener las reservas");
  return response.json();
};

export const createReserva = async (
  formData: ReservaFormData
): Promise<Reserva> => {
  const response = await fetch(RESERVA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Error al crear la reserva");
  return response.json();
};

// --- FUNCIÓN ACTUALIZADA A PATCH ---
// Cambiamos el método a 'PATCH' para las actualizaciones.
export const updateReserva = async (
  id: number,
  formData: Partial<ReservaFormData>
): Promise<Reserva> => {
  const response = await fetch(`${RESERVA_API_URL}/${id}`, {
    method: "PATCH", // Usamos PATCH para enviar solo los campos que cambian.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error del backend al actualizar la reserva:", errorData);
    throw new Error(`Error al actualizar la reserva: ${errorData}`);
  }
  return response.json();
};

export const deleteReserva = async (id: number): Promise<void> => {
  const response = await fetch(`${RESERVA_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la reserva");
};

export const fetchReservasPorConductor = async (
  conductorId: number
): Promise<ReservaResponse[]> => {
  if (!conductorId) return [];
  const response = await fetch(`${RESERVA_API_URL}/conductor/${conductorId}`);
  if (!response.ok)
    throw new Error("Error al obtener las reservas del conductor");
  return response.json();
};
