
import { useQuery } from '@tanstack/react-query';
import { fetchConductores } from '../api/conductorAPI';

export const useConductoresSinDeuda = () => {
  // Obtenemos TODOS los conductores. React Query nos dará la versión en caché.
  const { data: todosLosConductores, isLoading, isError } = useQuery({
    queryKey: ['conductores'], // Usamos la misma clave para acceder a la caché
    queryFn: fetchConductores,
  });

  // Filtramos la lista en el frontend para quedarnos solo con los que no tienen deuda.
  const conductoresSinDeuda = todosLosConductores?.filter(c => c.deuda === 0) || [];

  return {
    conductores: conductoresSinDeuda,
    isLoading,
    isError,
  };
};