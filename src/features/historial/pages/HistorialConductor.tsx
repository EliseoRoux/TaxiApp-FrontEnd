import { useState, useMemo } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useServicios } from "../../servicios/hooks/useServicios";
import { useReservas } from "../../reservas/hooks/useReservas";
import type { ConductorResponse } from "../../conductores/types/conductor";
import type { HistorialEntry } from "../types/historial";

const HistorialConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  // Estados para los nuevos filtros de fecha
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtenemos todos los datos necesarios de los hooks existentes
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { servicios, isLoading: isLoadingServicios } = useServicios();
  const { reservas, isLoading: isLoadingReservas } = useReservas();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // Lógica de filtrado combinada y optimizada
  const historialFiltrado = useMemo(() => {
    // 1. Combinar todos los servicios y reservas en un formato de historial unificado.
    const historialCompleto: HistorialEntry[] = [
      ...servicios.map((s) => ({
        id: `servicio-${s.idServicio}`,
        tipo: "Servicio" as const,
        fecha: s.fecha,
        conductorId: s.conductor?.idConductor,
        origen: s.origen,
        destino: s.destino,
        precio: s.precio,
        clienteNombre: s.cliente?.nombre || "N/A",
      })),
      ...reservas.map((r) => ({
        id: `reserva-${r.idReserva}`,
        tipo: "Reserva" as const,
        fecha: r.fechaReserva,
        conductorId: r.conductor?.idConductor,
        origen: r.origen,
        destino: r.destino,
        precio: r.precio,
        clienteNombre: r.cliente?.nombre || "N/A",
      })),
    ];

    // Aplicar los filtros de forma secuencial
    let itemsFiltrados = historialCompleto;

    if (selectedConductorId) {
      itemsFiltrados = itemsFiltrados.filter(
        (item) => item.conductorId === selectedConductorId
      );
    }
    if (fechaInicio) {
      itemsFiltrados = itemsFiltrados.filter(
        (item) => new Date(item.fecha) >= new Date(fechaInicio)
      );
    }
    if (fechaFin) {
      itemsFiltrados = itemsFiltrados.filter(
        (item) => new Date(item.fecha) <= new Date(fechaFin)
      );
    }

    // Ordenar el resultado final por fecha descendente
    return itemsFiltrados.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [selectedConductorId, fechaInicio, fechaFin, servicios, reservas]);

  const isLoading =
    isLoadingConductores || isLoadingServicios || isLoadingReservas;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Historial por Conductor y Fecha
      </h1>

      <div className="mb-4 p-4 border rounded-lg bg-white grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
        {/* Filtro de Conductor */}
        <div>
          <label
            htmlFor="conductor-select"
            className="block text-sm font-medium text-gray-700"
          >
            Conductor:
          </label>
          <select
            id="conductor-select"
            onChange={handleSelectChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">-- Todos --</option>
            {conductores.map((conductor: ConductorResponse) => (
              <option key={conductor.idConductor} value={conductor.idConductor}>
                {conductor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Fecha Desde */}
        <div>
          <label
            htmlFor="fecha-inicio"
            className="block text-sm font-medium text-gray-700"
          >
            Desde:
          </label>
          <input
            type="date"
            id="fecha-inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Filtro de Fecha Hasta */}
        <div>
          <label
            htmlFor="fecha-fin"
            className="block text-sm font-medium text-gray-700"
          >
            Hasta:
          </label>
          <input
            type="date"
            id="fecha-fin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {isLoading && <p className="text-center py-8">Buscando historial...</p>}

      {!isLoading &&
        (historialFiltrado.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay historial para mostrar con los filtros seleccionados.
          </p>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Origen
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Destino
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {historialFiltrado.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.tipo === "Servicio"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(item.fecha).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.clienteNombre}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.origen}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.destino}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      €{item.precio.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
};

export default HistorialConductor;
