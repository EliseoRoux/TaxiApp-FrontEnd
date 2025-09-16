
import { useQuery } from '@tanstack/react-query';
import { fetchServiciosPorConductor } from '../../servicios/api/servicioAPI';
import { fetchReservasPorConductor } from '../../reservas/api/reservaAPI';
import type { HistorialEntry } from '../types/historial';

export const useHistorialConductor = (conductorId: number | null) => {
  // Obtenemos los servicios para el conductor seleccionado
  const { data: servicios, isLoading: isLoadingServicios } = useQuery({
    queryKey: ['servicios', conductorId],
    queryFn: () => fetchServiciosPorConductor(conductorId!),
    enabled: !!conductorId, // Solo se ejecuta si hay un ID de conductor
  });

  // Obtenemos las reservas para el conductor seleccionado
  const { data: reservas, isLoading: isLoadingReservas } = useQuery({
    queryKey: ['reservas', conductorId],
    queryFn: () => fetchReservasPorConductor(conductorId!),
    enabled: !!conductorId,
  });

  // Combinamos y transformamos los datos cuando estén disponibles
  const historial: HistorialEntry[] = !conductorId ? [] : [
    ...(servicios || []).map(s => ({
      id: `servicio-${s.idServicio}`,
      tipo: 'Servicio' as const,
      fecha: s.fecha,
      origen: s.origen,
      destino: s.destino,
      precio: s.precio,
      clienteNombre: s.cliente?.nombre || 'N/A',
    })),
    ...(reservas || []).map(r => ({
      id: `reserva-${r.idReserva}`,
      tipo: 'Reserva' as const,
      fecha: r.fechaReserva,
      origen: r.origen,
      destino: r.destino,
      precio: r.precio,
      clienteNombre: r.cliente?.nombre || 'N/A',
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // Ordenamos por fecha descendente

  return {
    historial,
    isLoading: isLoadingServicios || isLoadingReservas,
  };
};