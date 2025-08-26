import { useState } from "react";
import { useHistorialConductor } from "../hooks/useHistorialConductor";
import { useConductores } from "../../servicios/hooks/useConductores";
import type { HistorialItem } from "../types/historial";

export function FiltroHistorialPorConductor() {
  const { conductores, loading: loadingConductores } = useConductores();
  const [conductorId, setConductorId] = useState<number | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtros] = useState<{conductorId?: number; fechaInicio?: string; fechaFin?: string} | null>(null);

  const { historial, loading, error, loadHistorial } = useHistorialConductor();

const handleFiltrar = () => {
  if (!conductorId) return alert("Selecciona un conductor");
  loadHistorial(conductorId, fechaInicio, fechaFin);
};


  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Historial Servicios y Reservas </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block mb-1">Conductor</label>
          {loadingConductores ? (
            <p>Cargando...</p>
          ) : (
            <select
              value={conductorId ?? ""}
              onChange={(e) => setConductorId(Number(e.target.value))}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="">Todos</option>
              {conductores.map((c) => (
                <option key={c.idConductor} value={c.idConductor}>
                  {c.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleFiltrar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Filtrar
          </button>
        </div>
      </div>

      {loading && <p>Cargando historial...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && filtros && historial.length === 0 && (
        <p>No se encontraron reservas ni servicios para los filtros seleccionados.</p>
      )}

      {!loading && historial.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {historial.map((item: HistorialItem) => (
            <li key={item.id} className="py-2">
              <span className="font-semibold">{item.tipo === "reserva" ? "Reserva" : "Servicio"}</span>{" "}
              - Fecha: {item.fecha}{" "}
              {item.tipo === "reserva" && item.cliente && `- Cliente: ${item.cliente.nombre}`}
              {item.tipo === "servicio" && item.origen && `- Origen: ${item.origen}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
