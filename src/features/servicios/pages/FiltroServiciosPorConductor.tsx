import { useState } from "react";
import { useConductores } from "../hooks/useConductores";
import { useServiciosPorConductor } from "../hooks/useServiciosPorConductor";
import type { Conductor, Servicio } from "../types/servicio";

export const FiltroServiciosPorConductor = () => {
  const { conductores, loading: loadingConductores } = useConductores();
  const { servicios, loading, error, load } = useServiciosPorConductor();

  const [conductorSeleccionado, setConductorSeleccionado] = useState<
    Conductor | "todos" | null
  >(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleFiltrar = () => {
    if (conductorSeleccionado || fechaInicio || fechaFin) {
      const conductorId =
        conductorSeleccionado === "todos"
          ? "todos"
          : conductorSeleccionado?.idConductor;

      load(
        conductorId || "todos",
        fechaInicio || undefined,
        fechaFin || undefined
      );
    }
  };

  // Calcular totales
  const totalPrecio = servicios.reduce(
    (sum: number, servicio: Servicio) => sum + servicio.precio,
    0
  );
  const totalPrecio10 = servicios.reduce(
    (sum: number, servicio: Servicio) => sum + (servicio.precio10 || 0),
    0
  );

  // Agrupar servicios por conductor para mostrar subtotales
  const serviciosPorConductor = servicios.reduce((acc, servicio) => {
    const conductorNombre = servicio.conductor?.nombre || "Sin conductor";
    if (!acc[conductorNombre]) {
      acc[conductorNombre] = [];
    }
    acc[conductorNombre].push(servicio);
    return acc;
  }, {} as Record<string, Servicio[]>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Servicios por Conductor</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Conductor</label>
            <select
              value={
                conductorSeleccionado === "todos"
                  ? "todos"
                  : conductorSeleccionado?.idConductor || ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === "todos") {
                  setConductorSeleccionado("todos");
                } else if (value === "") {
                  setConductorSeleccionado(null);
                } else {
                  const id = parseInt(value);
                  const conductor =
                    conductores.find((c: Conductor) => c.idConductor === id) ||
                    null;
                  setConductorSeleccionado(conductor);
                }
              }}
              className="w-full p-2 border rounded"
              disabled={loadingConductores}
            >
              <option value="">Seleccionar conductor</option>
              <option value="todos">Todos los conductores</option>
              {conductores.map((conductor: Conductor) => (
                <option
                  key={conductor.idConductor}
                  value={conductor.idConductor}
                >
                  {conductor.nombre} - {conductor.telefono}
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

      {servicios.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {conductorSeleccionado === "todos"
              ? "Servicios de todos los conductores"
              : `Servicios de ${conductorSeleccionado?.nombre}`}
            {fechaInicio && fechaFin && ` (${fechaInicio} al ${fechaFin})`}
          </h2>

          {/* Totales generales */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium">Total Dinero Generado</h3>
              <p className="text-2xl font-bold">{totalPrecio.toFixed(2)}€</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium">Total 10%</h3>
              <p className="text-2xl font-bold">{totalPrecio10.toFixed(2)}€</p>
            </div>
          </div>

          {/* Lista de servicios agrupados por conductor (solo cuando se selecciona "Todos") */}
          {conductorSeleccionado === "todos" && (
            <div className="space-y-6">
              {Object.entries(serviciosPorConductor).map(
                ([conductorNombre, serviciosConductor]) => {
                  const subtotalPrecio = serviciosConductor.reduce(
                    (sum, s) => sum + s.precio,
                    0
                  );
                  const subtotalPrecio10 = serviciosConductor.reduce(
                    (sum, s) => sum + (s.precio10 || 0),
                    0
                  );

                  return (
                    <div
                      key={conductorNombre}
                      className="border rounded-lg p-4"
                    >
                      <h3 className="text-lg font-semibold mb-3">
                        {conductorNombre} - {serviciosConductor.length}{" "}
                        servicios
                      </h3>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-2 rounded">
                          <span className="font-medium">Subtotal: </span>
                          {subtotalPrecio.toFixed(2)}€
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <span className="font-medium">10%: </span>
                          {subtotalPrecio10.toFixed(2)}€
                        </div>
                      </div>

                      <div className="space-y-3">
                        {serviciosConductor.map((servicio: Servicio) => (
                          <div
                            key={servicio.id_servicio}
                            className="border p-3 rounded"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {servicio.origen} → {servicio.destino}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {servicio.fecha} {servicio.hora}
                                </p>
                                <p className="text-sm">
                                  Cliente:{" "}
                                  {servicio.cliente?.nombre || "No asignado"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">
                                  {servicio.precio.toFixed(2)}€
                                </p>
                                <p className="text-sm">
                                  10%: {(servicio.precio10 || 0).toFixed(2)}€
                                </p>
                                <p className="text-sm">
                                  {servicio.nPersona} personas
                                </p>
                                {/* Eurotaxi (checkbox visual) */}
                                <div className="flex items-center">
                                  <span className="mr-2 text-sm text-gray-500">
                                    Eurotaxi{" "}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={servicio.eurotaxi || false}
                                    readOnly
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>

                                {/* Mascota */}
                                <div className="flex items-center">
                                  <span className="mr-1 text-sm text-gray-500">
                                    Mascota
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={servicio.mascota || false}
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
                                    checked={servicio.silla || false}
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
                                    checked={servicio.viajeLargo || false}
                                    readOnly
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Lista simple cuando se selecciona un conductor específico */}
          {conductorSeleccionado !== "todos" && (
            <div className="space-y-3">
              {servicios.map((servicio: Servicio) => (
                <div key={servicio.id_servicio} className="border p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {servicio.origen} → {servicio.destino}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Fecha: {servicio.fecha} <br />
                        Hora: {servicio.hora}
                      </p>
                      <p className="text-sm">
                        Cliente: {servicio.cliente?.nombre || "No asignado"}
                      </p>
                      <p className="text-sm">
                        Telefono Cliente:{" "}
                        {servicio.cliente?.telefono || "No asignado"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        Precio:{servicio.precio.toFixed(2)}€
                      </p>
                      <p className="text-sm">
                        Precio 10%: {(servicio.precio10 || 0).toFixed(2)}€
                      </p>
                      <p className="text-sm">{servicio.nPersona} personas</p>
                      <p className="text-sm">
                        Requisitos: {servicio.requisitos}
                      </p>
                      {/* Eurotaxi (checkbox visual) */}
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-gray-500">
                          Eurotaxi{" "}
                        </span>
                        <input
                          type="checkbox"
                          checked={servicio.eurotaxi || false}
                          readOnly
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Mascota */}
                      <div className="flex items-center">
                        <span className="mr-1 text-sm text-gray-500">
                          Mascota
                        </span>
                        <input
                          type="checkbox"
                          checked={servicio.mascota || false}
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
                          checked={servicio.silla || false}
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
                          checked={servicio.viajeLargo || false}
                          readOnly
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {servicios.length === 0 &&
        !loading &&
        (conductorSeleccionado || fechaInicio || fechaFin) && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron servicios para los filtros seleccionados
          </div>
        )}
    </div>
  );
};
