
import { useQuery } from '@tanstack/react-query';
import { fetchConductores } from '../../conductores/api/conductorAPI';

export const useConductores = () => {
  const { 
    data: conductores, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['conductores'],
    queryFn: fetchConductores,
  });

  return {
    conductores: conductores || [],
    isLoading,
    isError,
  };
};