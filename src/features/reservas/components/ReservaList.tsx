// src/features/reservas/components/ReservaList.tsx

import type { Reserva } from "../types/reserva";

type Props = {
  reservas: Reserva[];
  onEdit: (reserva: Reserva) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export const ReservaList = ({ reservas, onEdit, onDelete, loading }: Props) => {
  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (reservas.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No hay reservas para mostrar.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origen
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conductor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reservas.map((reserva) => (
            <tr key={reserva.idReserva} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reserva.origen}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {reserva.destino}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                €{reserva.precio.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {reserva.cliente?.nombre || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {reserva.conductor?.nombre || "Sin Asignar"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(reserva)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(reserva.idReserva)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
