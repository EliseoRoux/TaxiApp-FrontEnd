
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchReservas, createReserva, updateReserva, deleteReserva } from '../api/reservaAPI';
import { fetchClientes } from '../../clientes/api/clienteAPI';
import { fetchConductores } from '../../conductores/api/conductorAPI';
import type { ReservaFormData } from '../types/reserva';

export const useReservas = () => {
  const queryClient = useQueryClient();

  const { data: reservas, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reservas'],
    queryFn: fetchReservas,
  });

  const { data: clientes, isLoading: isLoadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });

  const { data: conductores, isLoading: isLoadingConductores } = useQuery({
    queryKey: ['conductores'],
    queryFn: fetchConductores,
  });

  const { mutate: addReserva, isPending: isCreating } = useMutation({
    mutationFn: (formData: ReservaFormData) => createReserva(formData),
    onSuccess: () => {
      toast.success('Reserva creada con éxito');
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (error: Error) => toast.error(`Error al crear: ${error.message}`),
  });

  const { mutate: editReserva, isPending: isUpdating } = useMutation({
    mutationFn: (variables: { id: number; data: Partial<ReservaFormData> }) => updateReserva(variables.id, variables.data),
    onSuccess: () => {
      toast.success('Reserva actualizada con éxito');
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (error: Error) => toast.error(`Error al actualizar: ${error.message}`),
  });

  const { mutate: removeReserva, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteReserva(id),
    onSuccess: () => {
      toast.success('Reserva eliminada con éxito');
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (error: Error) => toast.error(`Error al eliminar: ${error.message}`),
  });


  return {
    reservas: reservas || [],
    clientes: clientes || [],
    conductores: conductores || [],
    isLoading: isLoadingReservas || isLoadingClientes || isLoadingConductores,
    addReserva,
    isCreating,
    editReserva,
    isUpdating,
    removeReserva,
    isDeleting,
  };
};