import type { HistorialItem } from "../types/historial";
import type { Reserva } from "../../reservas/types/reserva";
import type { Servicio } from "../../servicios/types/servicio";
import { useReservasFiltradas } from "../../reservas/hooks/useReservasPorConductor";
import { useServiciosPorConductor } from "../../servicios/hooks/useServiciosPorConductor";
import { useState } from "react";

export function useHistorialConductor() {
  const { load: loadReservas } = useReservasFiltradas();
  const { load: loadServicios } = useServiciosPorConductor();

  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistorial = async (conductorId: number, fechaInicio?: string, fechaFin?: string) => {
    setLoading(true);
    setError(null);
    try {
      const reservasData: Reserva[] = await loadReservas(conductorId, fechaInicio, fechaFin);
      const serviciosData: Servicio[] = await loadServicios(conductorId, fechaInicio, fechaFin);

      const reservasConTipo: HistorialItem[] = reservasData.map(r => ({
        ...r,
        tipo: "reserva",
        id: r.idReserva,
        fecha: r.fechaReserva,
      }));

      const serviciosConTipo: HistorialItem[] = serviciosData.map(s => ({
        ...s,
        tipo: "servicio",
        id: s.id_servicio,
        fecha: s.fecha,
      }));

      setHistorial([...reservasConTipo, ...serviciosConTipo].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      ));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  return { historial, loading, error, loadHistorial };
}
