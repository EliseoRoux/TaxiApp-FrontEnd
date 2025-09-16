
import type { Reserva } from "../types/reserva";

type Props = {
  reservas: Reserva[];
  onEdit: (reserva: Reserva) => void;
  onDelete: (id: number) => void;
};

export const ReservaList = ({ reservas, onEdit, onDelete }: Props) => {
  if (reservas.length === 0) {
    return <p className="text-center text-gray-500">No hay reservas para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2 px-4">Cliente</th>
            <th className="py-2 px-4">Origen</th>
            <th className="py-2 px-4">Destino</th>
            <th className="py-2 px-4">Fecha y Hora</th>
            <th className="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva, index) => (
            <tr key={`${reserva.idReserva}-${index}`} className="border-b">
              <td className="py-2 px-4">{reserva.cliente?.nombre || 'No asignado'}</td>
              <td className="py-2 px-4">{reserva.origen}</td>
              <td className="py-2 px-4">{reserva.destino}</td>
              <td className="py-2 px-4">{new Date(reserva.fechaReserva).toLocaleString()}</td>
              <td className="py-2 px-4">
                <button onClick={() => onEdit(reserva)} className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                <button onClick={() => onDelete(reserva.idReserva)} className="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};