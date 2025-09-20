import { useState, useMemo } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useServicios } from "../hooks/useServicios";
import { ServicioList } from "../components/ServicioList";
import type { ConductorResponse } from "../../conductores/types/conductor";

const FiltroServiciosPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  // --- Estados para las fechas ---
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { servicios, isLoading: isLoadingServicios } = useServicios();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // --- LÓGICA DE FILTRADO ---
  const serviciosFiltrados = useMemo(() => {
    let items = servicios;

    // 1. Filtrar por conductor
    if (selectedConductorId) {
      items = items.filter(
        (s) => s.conductor?.idConductor === selectedConductorId
      );
    }

    // 2. Filtrar por fecha de inicio
    if (fechaInicio) {
      items = items.filter((s) => new Date(s.fecha) >= new Date(fechaInicio));
    }

    // 3. Filtrar por fecha de fin
    if (fechaFin) {
      items = items.filter((s) => new Date(s.fecha) <= new Date(fechaFin));
    }

    return items;
  }, [selectedConductorId, servicios, fechaInicio, fechaFin]);

  const isLoading = isLoadingConductores || isLoadingServicios;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Filtrar Servicios por Conductor y Fecha
      </h1>

      <div className="mb-4 p-4 border rounded-lg bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option value="">-- Todos --</option>
            {conductores.map((conductor: ConductorResponse) => (
              <option key={conductor.idConductor} value={conductor.idConductor}>
                {conductor.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* --- Filtro de Fecha Desde --- */}
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
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        {/* --- Filtro de Fecha Hasta --- */}
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
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
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
