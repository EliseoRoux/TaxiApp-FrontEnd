
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { 
    fetchServicios, 
    createServicio, 
    updateServicio, 
    deleteServicio 
} from '../api/servicioAPI';
import { fetchClientes } from '../../clientes/api/clienteAPI';
import { fetchConductores } from '../../conductores/api/conductorAPI';
import type { ServicioFormData } from '../types/servicio';

export const useServicios = () => {
  const queryClient = useQueryClient();

  const { 
    data: servicios, 
    isLoading: isLoadingServicios, 
    isError: isErrorServicios 
  } = useQuery({
    queryKey: ['servicios'],
    queryFn: fetchServicios,
  });

  const { 
    data: clientes, 
    isLoading: isLoadingClientes 
  } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });

  const { 
    data: conductores, 
    isLoading: isLoadingConductores 
  } = useQuery({
    queryKey: ['conductores'],
    queryFn: fetchConductores,
  });

  const { mutate: addServicio, isPending: isCreating } = useMutation({
    mutationFn: (servicioData: ServicioFormData) => createServicio(servicioData),
    onSuccess: () => {
      toast.success('Servicio creado con éxito');
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al crear el servicio: ${error.message}`);
    },
  });

  const { mutate: editServicio, isPending: isUpdating } = useMutation({
    mutationFn: (variables: { id: number; data: ServicioFormData }) =>
      updateServicio(variables.id, variables.data),
    onSuccess: () => {
      toast.success('Servicio actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar el servicio: ${error.message}`);
    },
  });

  const { mutate: removeServicio, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteServicio(id),
    onSuccess: () => {
      toast.success('Servicio eliminado con éxito');
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar el servicio: ${error.message}`);
    },
  });

  return {
    servicios: servicios || [],
    clientes: clientes || [],
    conductores: conductores || [],
    isLoading: isLoadingServicios || isLoadingClientes || isLoadingConductores,
    isError: isErrorServicios,
    
    addServicio,
    isCreating,

    editServicio,
    isUpdating,

    removeServicio,
    isDeleting,
  };
};