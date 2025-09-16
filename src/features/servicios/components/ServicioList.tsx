
import type { ServicioResponse } from "../types/servicio";

type Props = {
  servicios: ServicioResponse[];
  onEdit: (servicio: ServicioResponse) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export const ServicioList = ({ servicios, onEdit, onDelete, loading }: Props) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay servicios registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conductor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {servicios.map((servicio) => (
            <tr key={servicio.idServicio} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{servicio.origen}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{servicio.destino}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">€{servicio.precio.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.cliente?.nombre || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{servicio.conductor?.nombre || 'Sin Asignar'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(servicio)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(servicio.idServicio)}
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