// src/features/historial/pages/HistorialConductor.tsx

import { useState } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useHistorialConductor } from "../hooks/useHistorialConductor";
import type { ConductorResponse } from "../../conductores/types/conductor";

const HistorialConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { historial, isLoading: isLoadingHistorial } =
    useHistorialConductor(selectedConductorId);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

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
          disabled={isLoadingConductores}
        >
          <option value="">-- Seleccione para ver el historial --</option>
          {conductores.map((conductor: ConductorResponse) => (
            <option key={conductor.idConductor} value={conductor.idConductor}>
              {conductor.nombre}
            </option>
          ))}
        </select>
      </div>
      {isLoadingHistorial && <p>Buscando historial...</p>}
      {selectedConductorId &&
        !isLoadingHistorial &&
        (historial.length === 0 ? (
          <p className="text-center text-gray-500">
            Este conductor no tiene historial.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="py-2 px-4">Tipo</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Cliente</th>
                  <th className="py-2 px-4">Origen</th>
                  <th className="py-2 px-4">Destino</th>
                  <th className="py-2 px-4">Precio</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item, index) => (
                  // KEY CORREGIDA: item.id ya es único, pero el índice añade robustez
                  <tr key={`${item.id}-${index}`} className="border-b">
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
