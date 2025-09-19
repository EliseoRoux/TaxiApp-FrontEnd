// src/features/servicios/pages/FiltroServiciosPorConductor.tsx

import { useState, useMemo } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useServicios } from "../hooks/useServicios"; // Usamos el hook que obtiene TODOS los servicios
import { ServicioList } from "../components/ServicioList";
import type { ConductorResponse } from "../../conductores/types/conductor";

const FiltroServiciosPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );

  // Obtenemos las listas completas de conductores y servicios
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { servicios, isLoading: isLoadingServicios } = useServicios();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // Filtramos la lista de servicios en el frontend
  const serviciosFiltrados = useMemo(() => {
    if (!selectedConductorId) {
      return servicios; // Si no hay conductor seleccionado, mostramos todos
    }
    return servicios.filter(
      (s) => s.conductor?.idConductor === selectedConductorId
    );
  }, [selectedConductorId, servicios]);

  const isLoading = isLoadingConductores || isLoadingServicios;

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

      {isLoading && <p>Cargando datos...</p>}

      {!isLoading && (
        <ServicioList
          servicios={serviciosFiltrados}
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
