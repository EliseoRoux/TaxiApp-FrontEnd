// pages/ListaReservas.tsx
import { useReservas } from "../hooks/useReservas";
import { ReservaForm } from "../components/ReservaForm";
import { useState } from "react";

export const ListaReservas = () => {
  const { reservas, loading, addReserva, editReserva, removeReserva } =
    useReservas();
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar esta reserva?")) {
      await removeReserva(id);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>

      <ReservaForm
        onSubmit={async (data) => {
          if (editingId) {
            await editReserva(editingId, data);
          } else {
            await addReserva(data);
          }
          setEditingId(null);
        }}
      />

      <div className="mt-6 space-y-4">
        {reservas.map((reserva) => (
          <div key={reserva.idReserva} className="border p-4 rounded-lg">
            {editingId === reserva.idReserva ? (
              <ReservaForm
                initialData={reserva}
                onSubmit={async (data) => {
                  await editReserva(reserva.idReserva, data);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {reserva.origen} → {reserva.destino}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(reserva.fechaReserva).toLocaleDateString()} a
                      las {reserva.hora}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm text-gray-500">
                      Cliente: {reserva.cliente?.nombre || "No asignado"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-gray-500">
                      Teléfono: {reserva.cliente?.telefono || "N/A"}
                    </span>
                  </div>

                  {/* Conductor */}
                  <span className="block text-sm text-gray-500">
                    Conductor: {reserva.conductor?.nombre || "No asignado"}
                  </span>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Precio:{" "}
                      </span>
                      <span className="font-bold">
                        {reserva.precio.toFixed(2)}€
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Precio 10%:{" "}
                      </span>
                      <span className="font-bold">
                        {(reserva.precio * 0.1).toFixed(2)}€
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-sm text-gray-500">
                        Personas:{" "}
                      </span>
                      <span className="font-bold">{reserva.nPersona}</span>
                    </div>

                    {/* Eurotaxi */}
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        Eurotaxi{" "}
                      </span>
                      <input
                        type="checkbox"
                        checked={reserva.eurotaxi}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                    </div>

                    {/* Mascota */}
                    <div className="flex items-center">
                      <span className="mr-1 text-sm text-gray-500">
                        Mascota
                      </span>
                      <input
                        type="checkbox"
                        checked={reserva.mascota || false}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Silla */}
                    <div className="flex items-center">
                      <span className="mr-1 text-sm text-gray-500">
                        Silla de bebé
                      </span>
                      <input
                        type="checkbox"
                        checked={reserva.silla || false}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Viaje Largo */}
                    <div className="flex items-center">
                      <span className="mr-1 text-sm text-gray-500">
                        Viaje fuera de Madrid
                      </span>
                      <input
                        type="checkbox"
                        checked={reserva.viajeLargo || false}
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-sm text-gray-500">
                    Requisitos: {reserva.requisitos}
                  </span>
                </div>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setEditingId(reserva.idReserva)}
                    className="text-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(reserva.idReserva)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
