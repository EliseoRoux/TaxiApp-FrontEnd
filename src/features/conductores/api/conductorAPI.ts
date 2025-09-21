import { API_BASE_URL } from "../../../lib/apiClient";
import type {
  Conductor,
  ConductorFormData,
  ConductorResponse,
} from "../types/conductor";

const CONDUCTOR_API_URL = `${API_BASE_URL}/conductor`;

// --- FUNCIÓN AUXILIAR PARA AÑADIR EL TOKEN ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Token de autenticación no encontrado.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchConductores = async (): Promise<ConductorResponse[]> => {
  const response = await fetch(CONDUCTOR_API_URL, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al obtener los conductores");
  return response.json();
};

export const createConductor = async (
  conductorData: ConductorFormData
): Promise<Conductor> => {
  const response = await fetch(CONDUCTOR_API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(conductorData),
  });
  if (!response.ok) throw new Error("Error al crear el conductor");
  return response.json();
};

export const updateConductor = async (
  id: number,
  conductorData: Partial<ConductorFormData>
): Promise<Conductor> => {
  const response = await fetch(`${CONDUCTOR_API_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(conductorData),
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error del backend:", errorData);
    throw new Error("Error al actualizar el conductor");
  }
  return response.json();
};

export const deleteConductor = async (id: number): Promise<void> => {
  const response = await fetch(`${CONDUCTOR_API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al eliminar el conductor");
};

export const payConductorDebt = async (
  id: number
): Promise<ConductorResponse> => {
  const response = await fetch(`${CONDUCTOR_API_URL}/${id}/pagar-deuda`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error del backend al pagar la deuda:", errorData);
    throw new Error("Error al saldar la deuda");
  }
  return response.json();
};
