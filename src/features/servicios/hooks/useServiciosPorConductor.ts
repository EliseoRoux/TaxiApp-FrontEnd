import { useState } from "react";
import type { Servicio } from "../types/servicio";
import {
  fetchServiciosPorConductor,
  fetchServiciosPorFechas,
} from "../api/servicioAPI";

export const useServiciosPorConductor = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (
    idConductor: number | "todos",
    fechaInicio?: string,
    fechaFin?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      let data: Servicio[];

      if (idConductor === "todos") {
        // Obtener todos los servicios en el rango de fechas
        data = await fetchServiciosPorFechas(fechaInicio, fechaFin);
      } else {
        // Obtener servicios por conductor específico
        data = await fetchServiciosPorConductor(
          idConductor,
          fechaInicio,
          fechaFin
        );
      }

      setServicios(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { servicios, loading, error, load };
};
