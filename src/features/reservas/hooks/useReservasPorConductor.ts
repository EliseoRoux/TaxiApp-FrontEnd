import { useState } from "react";
import type { Reserva } from "../types/reserva";
import { fetchReservasFiltradas } from "../api/reservaAPI";

export const useReservasFiltradas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (idConductor?: number, fechaInicio?: string, fechaFin?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReservasFiltradas(idConductor, fechaInicio, fechaFin);
      setReservas(data);
      return data; 
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { reservas, loading, error, load };
};
