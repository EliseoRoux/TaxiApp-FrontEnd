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

  // Obtenemos todos los datos necesarios
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { servicios, isLoading: isLoadingServicios } = useServicios();
  const { reservas, isLoading: isLoadingReservas } = useReservas();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // Combinamos y filtramos el historial en el frontend
  const historialFiltrado = useMemo(() => {
    // Filtrar servicios y reservas si hay un conductor seleccionado
    const serviciosDelConductor = selectedConductorId
      ? servicios.filter(
          (s) => s.conductor?.idConductor === selectedConductorId
        )
      : servicios;

    const reservasDelConductor = selectedConductorId
      ? reservas.filter((r) => r.conductor?.idConductor === selectedConductorId)
      : reservas;

    // Mapear a un formato común de historial
    const historial: HistorialEntry[] = [
      ...serviciosDelConductor.map((s) => ({
        id: `servicio-${s.idServicio}`,
        tipo: "Servicio" as const,
        fecha: s.fecha,
        origen: s.origen,
        destino: s.destino,
        precio: s.precio,
        clienteNombre: s.cliente?.nombre || "N/A",
      })),
      ...reservasDelConductor.map((r) => ({
        id: `reserva-${r.idReserva}`,
        tipo: "Reserva" as const,
        fecha: r.fechaReserva,
        origen: r.origen,
        destino: r.destino,
        precio: r.precio,
        clienteNombre: r.cliente?.nombre || "N/A",
      })),
    ];

    //  Ordenar por fecha
    return historial.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }, [selectedConductorId, servicios, reservas]);

  const isLoading =
    isLoadingConductores || isLoadingServicios || isLoadingReservas;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Historial por Conductor</h1>
      <div className="mb-4 p-4 border rounded-lg bg-white">
        <label
          htmlFor="conductor-select"
          className="block text-sm font-medium text-gray-700"
        >
          Seleccione un Conductor:
        </label>
        <select
          id="conductor-select"
          onChange={handleSelectChange}
          className="mt-1 p-2 w-full border rounded-md"
          disabled={isLoading}
        >
          {/* Opción para mostrar todos */}
          <option value="">-- Todos --</option>
          {conductores.map((conductor: ConductorResponse) => (
            <option key={conductor.idConductor} value={conductor.idConductor}>
              {conductor.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Buscando historial...</p>}

      {!isLoading &&
        (historialFiltrado.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay historial para mostrar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left">Tipo</th>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-left">Cliente</th>
                  <th className="py-2 px-4 text-left">Origen</th>
                  <th className="py-2 px-4 text-left">Destino</th>
                  <th className="py-2 px-4 text-left">Precio</th>
                </tr>
              </thead>
              <tbody>
                {historialFiltrado.map((item, index) => (
                  <tr
                    key={`${item.id}-${index}`}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.tipo === "Servicio"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.tipo}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {new Date(item.fecha).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{item.clienteNombre}</td>
                    <td className="py-2 px-4">{item.origen}</td>
                    <td className="py-2 px-4">{item.destino}</td>
                    <td className="py-2 px-4">€{item.precio.toFixed(2)}</td>
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
