
import { useState } from 'react';
import { useConductores } from '../../conductores/hooks/useConductores';
import { useServiciosPorConductor } from '../hooks/useServiciosPorConductor';
import { ServicioList } from '../components/ServicioList';

const FiltroServiciosPorConductor = () => {
  // Estado para guardar el ID del conductor seleccionado
  const [selectedConductorId, setSelectedConductorId] = useState<number | null>(null);

  // Obtenemos la lista de conductores para el menú desplegable
  const { conductores, isLoading: isLoadingConductores } = useConductores();

  // Nuestro hook de filtrado. Se activa solo cuando 'selectedConductorId' tiene un valor.
  const { 
    servicios, 
    isLoading: isLoadingServicios, 
    isError 
  } = useServiciosPorConductor(selectedConductorId);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value ? Number(event.target.value) : null;
    setSelectedConductorId(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filtrar Servicios por Conductor</h1>

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
          {conductores.map((conductor) => (
            <option key={conductor.idConductor} value={conductor.idConductor}>
              {conductor.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoadingServicios && <p>Buscando servicios...</p>}
      {isError && <p className="text-red-500">Error al cargar los servicios.</p>}

      {/* Solo mostramos la lista si se ha seleccionado un conductor */}
      {selectedConductorId && !isLoadingServicios && (
        <ServicioList
          servicios={servicios}
          // Estas funciones son placeholders, ya que esta vista es de solo lectura
          onEdit={() => alert('Para editar, ve a la página principal de servicios.')}
          onDelete={() => alert('Para eliminar, ve a la página principal de servicios.')}
        />
      )}
    </div>
  );
};

export default FiltroServiciosPorConductor;