
import { useQuery } from '@tanstack/react-query';
import { fetchServiciosPorConductor } from '../api/servicioAPI';

export const useServiciosPorConductor = (conductorId: number | null) => {
  const { 
    data: servicios, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['servicios', conductorId], 
    
    queryFn: () => fetchServiciosPorConductor(conductorId!),
    enabled: !!conductorId, 
  });

  return {
    servicios: servicios || [],
    isLoading,
    isError,
  };
};