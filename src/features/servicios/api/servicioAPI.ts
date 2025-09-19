import { API_BASE_URL } from "../../../lib/apiClient";
import type { ServicioFormData, ServicioResponse } from "../types/servicio";

const SERVICIO_API_URL = `${API_BASE_URL}/servicios`;

export const fetchServicios = async (): Promise<ServicioResponse[]> => {
  const response = await fetch(SERVICIO_API_URL);
  if (!response.ok) throw new Error("Error al obtener los servicios");
  return response.json();
};

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

export const updateServicio = async (
  id: number,
  formData: Partial<ServicioFormData>
): Promise<ServicioResponse> => {
  const response = await fetch(`${SERVICIO_API_URL}/${id}`, {
    method: "PATCH", 
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

export const deleteServicio = async (id: number): Promise<void> => {
  const response = await fetch(`${SERVICIO_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el servicio");
};

export const fetchServiciosPorConductor = async (
  conductorId: number
): Promise<ServicioResponse[]> => {
  if (!conductorId) return [];
  const response = await fetch(`${SERVICIO_API_URL}/conductor/${conductorId}`);
  if (!response.ok)
    throw new Error("Error al obtener los servicios del conductor");
  return response.json();
};
