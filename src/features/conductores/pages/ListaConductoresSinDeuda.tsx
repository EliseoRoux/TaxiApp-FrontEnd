import { useConductoresSinDeuda } from "../hooks/useConductoresSinDeuda";

export function ListaConductoresSinDeuda() {
  const { conductores, loading, error } = useConductoresSinDeuda();

  if (loading) return <p>Cargando conductores sin deuda...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Conductores sin deuda</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deuda
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dinero Generado
            </th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((conductor) => (
            <tr key={conductor.idConductor} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{conductor.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{conductor.telefono}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  ${conductor.deuda.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  ${conductor.dineroGenerado.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {conductores.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay conductores sin deuda
        </div>
      )}
    </div>
  );
}