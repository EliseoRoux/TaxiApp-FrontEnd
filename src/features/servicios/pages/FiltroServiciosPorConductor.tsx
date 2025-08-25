import { useState } from "react";
import { useConductores } from "../hooks/useConductores"; 
import { useServiciosPorConductor } from "../hooks/useServiciosPorConductor"; 
import type { Conductor, Servicio } from "../types/servicio"; 

export const FiltroServiciosPorConductor = () => {
  const { conductores, loading: loadingConductores } = useConductores();
  const { servicios, loading, error, load } = useServiciosPorConductor();
  
  const [conductorSeleccionado, setConductorSeleccionado] = useState<Conductor | null>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleFiltrar = () => {
    if (conductorSeleccionado) {
      load(conductorSeleccionado.idConductor, fechaInicio || undefined, fechaFin || undefined);
    }
  };

  // Corregir tipos en los reduce
  const totalPrecio = servicios.reduce((sum: number, servicio: Servicio) => sum + servicio.precio, 0);
  const totalPrecio10 = servicios.reduce((sum: number, servicio: Servicio) => sum + (servicio.precio10 || 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Servicios por Conductor</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Conductor</label>
            <select
              value={conductorSeleccionado?.idConductor || ""}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const conductor = conductores.find((c: Conductor) => c.idConductor === id) || null;
                setConductorSeleccionado(conductor);
              }}
              className="w-full p-2 border rounded"
              disabled={loadingConductores}
            >
              <option value="">Seleccionar conductor</option>
              {conductores.map((conductor: Conductor) => (
                <option key={conductor.idConductor} value={conductor.idConductor}>
                  {conductor.nombre} - {conductor.telefono}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
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
          disabled={!conductorSeleccionado || loading}
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

      {servicios.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Servicios de {conductorSeleccionado?.nombre}
            {fechaInicio && fechaFin && ` (${fechaInicio} al ${fechaFin})`}
          </h2>

          {/* Totales */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium">Total Precio</h3>
              <p className="text-2xl font-bold">{totalPrecio.toFixed(2)}€</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium">Total 10%</h3>
              <p className="text-2xl font-bold">{totalPrecio10.toFixed(2)}€</p>
            </div>
          </div>

          {/* Lista de servicios */}
          <div className="space-y-3">
            {servicios.map((servicio: Servicio) => (
              <div key={servicio.id_servicio} className="border p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {servicio.origen} → {servicio.destino}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {servicio.fecha} {servicio.hora}
                    </p>
                    <p className="text-sm">Cliente: {servicio.cliente?.nombre || "No asignado"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{servicio.precio.toFixed(2)}€</p>
                    <p className="text-sm">10%: {(servicio.precio10 || 0).toFixed(2)}€</p>
                    <p className="text-sm">{servicio.nPersona} personas</p>
                  </div>
                </div>
                {servicio.requisitos && (
                  <p className="text-sm mt-2 text-gray-600">
                    Requisitos: {servicio.requisitos}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {servicios.length === 0 && !loading && conductorSeleccionado && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron servicios para este conductor en el período seleccionado
        </div>
      )}
    </div>
  );
};