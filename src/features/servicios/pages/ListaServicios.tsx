import { useServicios } from "../hooks/useServicios";
import { ServicioForm } from "../components/ServicioForm";
import { useState } from "react";

export const ListaServicios = () => {
  const { servicios, loading, addServicio, editServicio, removeServicio } =
    useServicios();

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar este servicio?")) {
      await removeServicio(id);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Servicios</h1>

      <ServicioForm
        onSubmit={async (data) => {
          if (editingId) {
            await editServicio(editingId, data);
          } else {
            await addServicio(data);
          }
          setEditingId(null);
        }}
      />

      {/* Listado de servicios */}
      <div className="mt-6 space-y-4">
        {servicios.map((servicio) => (
          <div key={servicio.id_servicio} className="border p-4 rounded-lg">
            {editingId === servicio.id_servicio ? (
              <ServicioForm
                initialData={servicio}
                onSubmit={async (data) => {
                  await editServicio(servicio.id_servicio!, data);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                {/* Información principal */}
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {servicio.origen} → {servicio.destino}
                    </h3>
                  </div>

                  {/* Cliente */}
                  <div className="text-right">
                    <span className="block text-sm text-gray-500">
                      Cliente: {servicio.cliente?.nombre || "No asignado"}
                    </span>
                  </div>
                  
                  <div>
                    <span className="block text-sm text-gray-500">
                      Teléfono: {servicio.cliente?.telefono || "N/A"}
                    </span>
                  </div>
                  {/* Conductor */}
                 <span className="block text-sm text-gray-500">
                    Conductor: {servicio.conductor?.nombre || "No asignado"}
                  </span>

                  <div className="flex items-center space-x-4">
                    {/* Precio base */}
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Precio:{" "}
                      </span>
                      <span className="font-bold">
                        {servicio.precio.toFixed(2)}€
                      </span>
                    </div>

                    {/* Precio +10% (calculado) */}
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Precio 10%:{" "}
                      </span>
                      <span className="font-bold">
                        {(servicio.precio * 0.1).toFixed(2)}€
                      </span>
                    </div>

                    {/* Número de personas */}
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Personas: {servicio.nPersona}
                      </span>
                    </div>

                    {/* Requisitos */}
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Requisitos: {servicio.requisitos}
                      </span>
                    </div>

                    {/* Eurotaxi (checkbox visual) */}
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        Eurotaxi{" "}
                      </span>
                      <input
                        type="checkbox"
                        checked={servicio.eurotaxi || false}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <div className="flex space-x-4">
                    {servicio.fecha && (
                      <span>
                        Fecha: {new Date(servicio.fecha).toLocaleDateString()}
                      </span>
                    )}
                    {servicio.hora && (
                      <span>
                        <br></br>Hora: {servicio.hora}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setEditingId(servicio.id_servicio!)}
                    className="text-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id_servicio!)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {servicios.length === 0 && !loading && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-2 text-gray-500">No hay servicios registrados</p>
            <p className="text-sm text-gray-400">
              Crea tu primer servicio usando el formulario
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
