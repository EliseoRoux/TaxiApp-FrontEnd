import { useDeudas } from "../hooks/useDeudas";
import { pagarDeuda } from "../api/conductorAPI";

export function ListaDeudas() {
  const { deudas, loading, error, refresh } = useDeudas();

  const handlePay = async (id: number) => {
    try {
      await pagarDeuda(id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Conductores con deuda</h2>
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
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {deudas.map((c) => (
            <tr key={c.idConductor} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{c.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{c.telefono}</td>
              <td className="px-6 py-4 whitespace-nowrap">{c.deuda}€</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handlePay(c.idConductor)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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
}
