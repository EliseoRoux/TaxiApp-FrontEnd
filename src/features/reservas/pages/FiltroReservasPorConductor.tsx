import { useState } from "react";
import { useConductores } from "../hooks/useConductores";
import { useReservasFiltradas } from "../hooks/useReservasPorConductor";
import type { Conductor } from "../types/reserva";
import type { Reserva } from "../types/reserva";

export const FiltroReservasPorConductor = () => {
  const { conductores, loading: loadingConductores } = useConductores();
  const { reservas, loading, error, load } = useReservasFiltradas();

  const [conductorSeleccionado, setConductorSeleccionado] =
    useState<Conductor | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleFiltrar = () => {
    load(
      conductorSeleccionado?.idConductor,
      fechaInicio || undefined,
      fechaFin || undefined
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Conductor</label>
            <select
              value={conductorSeleccionado?.idConductor || ""}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const conductor =
                  conductores.find((c: Conductor) => c.idConductor === id) ||
                  null;
                setConductorSeleccionado(conductor);
              }}
              className="w-full p-2 border rounded"
              disabled={loadingConductores}
            >
              <option value="">Todos</option>
              {conductores.map((c) => (
                <option key={c.idConductor} value={c.idConductor}>
                  {c.nombre} - {c.telefono}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleFiltrar}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? "Cargando..." : "Filtrar"}
        </button>
      </div>

      {/* Resultados */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {reservas.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
          {reservas.map((r: Reserva) => (
            <div key={r.idReserva} className="border p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {r.origen} → {r.destino}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {r.fechaReserva} {r.hora}
                  </p>
                  <p className="text-sm">Cliente: {r.cliente?.nombre}</p>
                  <p className="text-sm">Conductor: {r.conductor?.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{r.precio.toFixed(2)}€</p>
                </div>

                {/* Eurotaxi */}
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Eurotaxi </span>
                  <input
                    type="checkbox"
                    checked={r.eurotaxi}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                </div>

                {/* Mascota */}
                <div className="flex items-center">
                  <span className="mr-1 text-sm text-gray-500">Mascota</span>
                  <input
                    type="checkbox"
                    checked={r.mascota || false}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                {/* Silla */}
                <div className="flex items-center">
                  <span className="mr-1 text-sm text-gray-500">
                    Silla de bebé
                  </span>
                  <input
                    type="checkbox"
                    checked={r.silla || false}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>

                {/* Viaje Largo */}
                <div className="flex items-center">
                  <span className="mr-1 text-sm text-gray-500">
                    Viaje fuera de Madrid
                  </span>
                  <input
                    type="checkbox"
                    checked={r.viajeLargo || false}
                    readOnly
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
              </div>
              {r.requisitos && (
                <p className="text-sm mt-2 text-gray-600">
                  Requisitos: {r.requisitos}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {reservas.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron reservas para los filtros seleccionados
        </div>
      )}
    </div>
  );
};
