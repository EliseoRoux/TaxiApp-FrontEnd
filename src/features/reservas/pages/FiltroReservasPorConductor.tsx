
import { useState } from 'react';
import { useConductores } from '../../conductores/hooks/useConductores';
import useReservasPorConductor from '../hooks/useReservasPorConductor'; 
import type { ConductorResponse } from '../../conductores/types/conductor';
import { ReservaList } from '../components/ReservaList';

const FiltroReservasPorConductor = () => {
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(null);
  const { conductores, isLoading: isLoadingConductores } = useConductores();
  const { reservas, isLoading: isLoadingReservas } = useReservasPorConductor(selectedConductorId);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filtrar Reservas por Conductor</h1>
      <div className="mb-4 p-4 border rounded-lg bg-white">
        <label htmlFor="conductor-select" className="block text-sm font-medium text-gray-700">
          Seleccione un Conductor:
        </label>
        <select
          id="conductor-select"
          onChange={handleSelectChange}
          className="mt-1 p-2 w-full border rounded-md"
          disabled={isLoadingConductores}
        >
          <option value="">-- Seleccione para filtrar --</option>
          {conductores.map((c: ConductorResponse) => (
            <option key={c.idConductor} value={c.idConductor}>{c.nombre}</option>
          ))}
        </select>
      </div>
      {isLoadingReservas && <p>Buscando reservas...</p>}
      {selectedConductorId && !isLoadingReservas && (
        <ReservaList
          reservas={reservas}
          onEdit={() => alert('Para editar, ve a la página principal de reservas.')}
          onDelete={() => alert('Para eliminar, ve a la página principal de reservas.')}
        />
      )}
    </div>
  );
};

export default FiltroReservasPorConductor;