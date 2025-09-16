
import { useQuery } from '@tanstack/react-query';
// Importamos la función que SÍ existe para obtener todos los conductores.
import { fetchConductores } from '../api/conductorAPI';

export const useDeudas = () => {
  // Usamos la query principal de 'conductores' para aprovechar la caché.
  const { data: todosLosConductores, isLoading, isError } = useQuery({
    queryKey: ['conductores'],
    queryFn: fetchConductores,
  });

  // Filtramos la lista aquí mismo para obtener solo los que tienen deuda.
  const conductoresConDeuda = todosLosConductores?.filter(conductor => conductor.deuda > 0) || [];

  return {
    conductores: conductoresConDeuda,
    isLoading,
    isError,
  };
};