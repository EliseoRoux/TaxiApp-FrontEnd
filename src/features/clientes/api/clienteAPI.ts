
import { API_BASE_URL } from "../../../lib/apiClient";
import type { Cliente, ClienteFormData, ClienteResponse } from "../types/cliente";

const CLIENTE_API_URL = `${API_BASE_URL}/clientes`; 

export const fetchClientes = async (): Promise<ClienteResponse[]> => {
    const response = await fetch(CLIENTE_API_URL);
    if (!response.ok) throw new Error('Error al obtener los clientes');
    return response.json();
};

export const createCliente = async (clienteData: ClienteFormData): Promise<Cliente> => {
    const response = await fetch(CLIENTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!response.ok) throw new Error('Error al crear el cliente');
    return response.json();
};

export const updateCliente = async (id: number, clienteData: Partial<ClienteFormData>): Promise<Cliente> => {
    const response = await fetch(`${CLIENTE_API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData)
    });
    if (!response.ok) throw new Error('Error al actualizar el cliente');
    return response.json();
};

export const deleteCliente = async (id: number): Promise<void> => {
    const response = await fetch(`${CLIENTE_API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el cliente');
};