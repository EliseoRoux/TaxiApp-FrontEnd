import { useState, useEffect } from 'react';
import { 
  fetchClientes, 
  createCliente, 
  updateCliente, 
  deleteCliente,
  searchClientes 
} from '../api/clienteAPI';
import type { ClienteFormData, ClienteResponse } from '../types/cliente';

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await fetchClientes();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (cliente: ClienteFormData) => {
    const newCliente = await createCliente(cliente);
    await loadClientes(); // Recargar para obtener datos completos
    return newCliente;
  };

  const editCliente = async (id: number, cliente: ClienteFormData) => {
    const updated = await updateCliente(id, cliente);
    await loadClientes();
    return updated;
  };

  const removeCliente = async (id: number) => {
    await deleteCliente(id);
    await loadClientes();
  };

  const search = async (query: string) => {
    return await searchClientes(query);
  };

  return {
    clientes,
    loading,
    error,
    addCliente,
    editCliente,
    removeCliente,
    search,
    refresh: loadClientes
  };
};