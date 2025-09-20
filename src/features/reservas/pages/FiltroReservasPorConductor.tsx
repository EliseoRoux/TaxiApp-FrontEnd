import { useState, useMemo } from "react";
import { useConductores } from "../../conductores/hooks/useConductores";
import { useReservas } from "../hooks/useReservas";
import type { ConductorResponse } from "../../conductores/types/conductor";
import { ReservaList } from "../components/ReservaList";

const FiltroReservasPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(
    null
  );
  // --- Estados para las fechas ---
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { reservas, isLoading: isLoadingReservas } = useReservas();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  // --- LÓGICA DE FILTRADO ---
  const reservasFiltradas = useMemo(() => {
    let items = reservas;

    if (selectedConductorId) {
      items = items.filter(
        (r) => r.conductor?.idConductor === selectedConductorId
      );
    }
    if (fechaInicio) {
      // Usamos fechaReserva que es el campo correcto para las reservas
      items = items.filter(
        (r) => new Date(r.fechaReserva) >= new Date(fechaInicio)
      );
    }
    if (fechaFin) {
      items = items.filter(
        (r) => new Date(r.fechaReserva) <= new Date(fechaFin)
      );
    }

    return items;
  }, [selectedConductorId, reservas, fechaInicio, fechaFin]);

  const isLoading = isLoadingConductores || isLoadingReservas;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Filtrar Reservas por Conductor y Fecha
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
            {conductores.map((c: ConductorResponse) => (
              <option key={c.idConductor} value={c.idConductor}>
                {c.nombre}
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
