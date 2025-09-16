
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast'; // notificaciones

import {
  fetchClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from '../api/clienteAPI'; 
import type { ClienteFormData } from '../types/cliente';

export const useClientes = () => {
  const queryClient = useQueryClient();

  //  OBTENER DATOS con useQuery
  const { data: clientes, isLoading, isError } = useQuery({
    queryKey: ['clientes'], // Una clave única para esta consulta
    queryFn: fetchClientes,   // La función que obtiene los datos
  });

  //  CREAR un cliente con useMutation
  const { mutate: addCliente, isPending: isCreating } = useMutation({
    mutationFn: (clienteData: ClienteFormData) => createCliente(clienteData),
    onSuccess: () => {
      toast.success('Cliente creado con éxito');
      // Invalida la caché de 'clientes' para forzar una actualización automática
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error) => {
      toast.error(`Error al crear el cliente: ${error.message}`);
    },
  });

  // ACTUALIZAR un cliente con useMutation
  const { mutate: editCliente, isPending: isUpdating } = useMutation({
    mutationFn: (variables: { id: number; data: ClienteFormData }) =>
      updateCliente(variables.id, variables.data),
    onSuccess: () => {
      toast.success('Cliente actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error) => {
      toast.error(`Error al actualizar el cliente: ${error.message}`);
    },
  });

  //  ELIMINAR un cliente con useMutation
  const { mutate: removeCliente, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteCliente(id),
    onSuccess: () => {
      toast.success('Cliente eliminado con éxito');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (error) => {
      toast.error(`Error al eliminar el cliente: ${error.message}`);
    },
  });

  //  Exponemos las funciones y estados al resto de la app
  return {
    clientes: clientes || [], // Devolvemos un array vacío si aún no hay datos
    isLoading,
    isError,
    
    addCliente,
    isCreating,

    editCliente,
    isUpdating,

    removeCliente,
    isDeleting,
  };
};