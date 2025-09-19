import { useState } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useServiciosPorConductor } from "../hooks/useServiciosPorConductor";
import { ServicioList } from "../components/ServicioList";
// Importamos el tipo específico para un conductor
import type { ConductorResponse } from "../../conductores/types/conductor";

const FiltroServiciosPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const {
    servicios,
    isLoading: isLoadingServicios,
    isError,
  } = useServiciosPorConductor(selectedConductorId);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Filtrar Servicios por Conductor
      </h1>

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
          <option value="">-- Seleccione para filtrar --</option>
          {conductores.map((conductor: ConductorResponse) => (
            <option key={conductor.idConductor} value={conductor.idConductor}>
              {conductor.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoadingServicios && <p>Buscando servicios...</p>}
      {isError && (
        <p className="text-red-500">Error al cargar los servicios.</p>
      )}

      {selectedConductorId && !isLoadingServicios && (
        <ServicioList
          servicios={servicios}
          onEdit={() =>
            alert("Para editar, ve a la página principal de servicios.")
          }
          onDelete={() =>
            alert("Para eliminar, ve a la página principal de servicios.")
          }
        />
      )}
    </div>
  );
};

export default FiltroServiciosPorConductor;
