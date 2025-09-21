import { API_BASE_URL } from "../../../lib/apiClient";
import type {
  Cliente,
  ClienteFormData,
  ClienteResponse,
} from "../types/cliente";

const CLIENTE_API_URL = `${API_BASE_URL}/clientes`;

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

export const fetchClientes = async (): Promise<ClienteResponse[]> => {
  const response = await fetch(CLIENTE_API_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error al obtener los clientes");
  return response.json();
};

export const createCliente = async (
  clienteData: ClienteFormData
): Promise<Cliente> => {
  const response = await fetch(CLIENTE_API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(clienteData),
  });
  if (!response.ok) throw new Error("Error al crear el cliente");
  return response.json();
};

export const updateCliente = async (
  id: number,
  clienteData: Partial<ClienteFormData>
): Promise<Cliente> => {
  const response = await fetch(`${CLIENTE_API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(clienteData),
  });
  if (!response.ok) throw new Error("Error al actualizar el cliente");
  return response.json();
};

export const deleteCliente = async (id: number): Promise<void> => {
  const response = await fetch(`${CLIENTE_API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Error al eliminar el cliente");
};
