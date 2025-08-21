import { useState, useEffect } from 'react';
import { fetchReservas, createReserva, updateReserva, deleteReserva } from '../api/reservaAPI';
import type { Reserva, ReservaFormData } from '../types/reserva';

export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReservas = async () => {
      try {
        setLoading(true);
        const data = await fetchReservas();
        setReservas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    loadReservas();
  }, []);

  const addReserva = async (reserva: ReservaFormData) => {
    const newReserva = await createReserva(reserva);
    setReservas(prev => [newReserva, ...prev]);
  };

  const editReserva = async (id: number, reserva: Partial<ReservaFormData>) => {
    const updated = await updateReserva(id, reserva);
    setReservas(prev => prev.map(r => r.idReserva === id ? updated : r));
  };

  const removeReserva = async (id: number) => {
    await deleteReserva(id);
    setReservas(prev => prev.filter(r => r.idReserva !== id));
  };

  const refreshReservas = async () => {
    setLoading(true);
    try {
      const data = await fetchReservas();
      setReservas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al refrescar');
    } finally {
      setLoading(false);
    }
  };

  return {
    reservas,
    loading,
    error,
    addReserva,
    editReserva,
    removeReserva,
    refresh: refreshReservas
  };
};