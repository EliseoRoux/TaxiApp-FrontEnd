
import type { ConductorResponse } from "../types/conductor";

type Props = {
  conductores: ConductorResponse[];
  onEdit: (conductor: ConductorResponse) => void;
  onDelete: (id: number) => void;
  onPay: (conductor: ConductorResponse) => void;
  loading?: boolean;
};

export const ConductorList = ({ conductores, onEdit, onDelete, onPay, loading }: Props) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (conductores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay conductores registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deuda</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {conductores.map((conductor) => (
            <tr key={conductor.idConductor} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{conductor.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conductor.telefono}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${conductor.deuda > 0 ? 'text-red-600' : 'text-green-600'}`}>
                €{conductor.deuda.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(conductor)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(conductor.idConductor)}
                  className="text-red-600 hover:text-red-900 mr-3"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => onPay(conductor)}
                  className="text-green-600 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={conductor.deuda === 0}
                >
                  Pagada
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};