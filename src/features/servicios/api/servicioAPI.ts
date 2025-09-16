import { API_BASE_URL } from "../../../lib/apiClient";
import type { ServicioFormData, ServicioResponse } from "../types/servicio";

const SERVICIO_API_URL = `${API_BASE_URL}/servicios`;

// La función de obtener servicios no cambia.
export const fetchServicios = async (): Promise<ServicioResponse[]> => {
  const response = await fetch(SERVICIO_API_URL);
  if (!response.ok) throw new Error("Error al obtener los servicios");
  return response.json();
};

// La función de crear un servicio no cambia.
export const createServicio = async (
  formData: ServicioFormData
): Promise<ServicioResponse> => {
  const response = await fetch(SERVICIO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Error al crear el servicio");
  return response.json();
};

// --- FUNCIÓN ACTUALIZADA A PATCH ---
// Cambiamos el método a 'PATCH' para realizar actualizaciones parciales.
export const updateServicio = async (
  id: number,
  formData: Partial<ServicioFormData>
): Promise<ServicioResponse> => {
  const response = await fetch(`${SERVICIO_API_URL}/${id}`, {
    method: "PATCH", // Usamos PATCH para enviar solo los campos que cambian.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error del backend al actualizar:", errorData);
    throw new Error(`Error al actualizar el servicio: ${errorData}`);
  }
  return response.json();
};

// La función de eliminar no cambia.
export const deleteServicio = async (id: number): Promise<void> => {
  const response = await fetch(`${SERVICIO_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el servicio");
};

// La función de filtrar por conductor no cambia.
export const fetchServiciosPorConductor = async (
  conductorId: number
): Promise<ServicioResponse[]> => {
  if (!conductorId) return [];
  const response = await fetch(`${SERVICIO_API_URL}/conductor/${conductorId}`);
  if (!response.ok)
    throw new Error("Error al obtener los servicios del conductor");
  return response.json();
};
