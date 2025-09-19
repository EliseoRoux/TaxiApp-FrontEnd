
import { useState, useMemo } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useReservas } from "../hooks/useReservas"; // Usamos el hook que obtiene TODAS las reservas
import type { ConductorResponse } from "../../conductores/types/conductor";
import { ReservaList } from "../components/ReservaList";

const FiltroReservasPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );

  // Obtenemos las listas completas
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { reservas, isLoading: isLoadingReservas } = useReservas();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // Filtramos en el frontend
  const reservasFiltradas = useMemo(() => {
    if (!selectedConductorId) {
      return reservas; // Mostrar todas si no hay selección
    }
    return reservas.filter(
      (r) => r.conductor?.idConductor === selectedConductorId
    );
  }, [selectedConductorId, reservas]);

  const isLoading = isLoadingConductores || isLoadingReservas;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Filtrar Reservas por Conductor
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
          {/* Opción para mostrar todas */}
          <option value="">-- Todos --</option>
          {conductores.map((c: ConductorResponse) => (
            <option key={c.idConductor} value={c.idConductor}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Cargando datos...</p>}

      {!isLoading && (
        <ReservaList
          reservas={reservasFiltradas}
          onEdit={() =>
            alert("Para editar, ve a la página principal de reservas.")
          }
          onDelete={() =>
            alert("Para eliminar, ve a la página principal de reservas.")
          }
        />
      )}
    </div>
  );
};

export default FiltroReservasPorConductor;
