import { useState } from "react";
import type { Servicio } from "../types/servicio";
import { fetchServiciosPorConductor } from "../api/servicioAPI";

export const useServiciosPorConductor = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (idConductor: number, fechaInicio?: string, fechaFin?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchServiciosPorConductor(idConductor, fechaInicio, fechaFin);
      setServicios(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return { servicios, loading, error, load };
};
