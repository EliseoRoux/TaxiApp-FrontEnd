
import { useQuery } from '@tanstack/react-query';
import { fetchReservasPorConductor } from '../api/reservaAPI'; 

const useReservasPorConductor = (conductorId: number | null) => {
  const { 
    data: reservas, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['reservas', conductorId], 
    queryFn: () => fetchReservasPorConductor(conductorId!),
    enabled: !!conductorId,
  });

  return {
    reservas: reservas || [],
    isLoading,
    isError,
  };
};

export default useReservasPorConductor; 