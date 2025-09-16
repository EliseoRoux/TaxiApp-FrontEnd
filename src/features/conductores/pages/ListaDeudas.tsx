import { useConductores } from "../hooks/useConductores";
import type { ConductorResponse } from "../types/conductor";

const ListaDeudas = () => {
  // Obtenemos 'payDebt' del hook, que ahora está corregido.
  const { conductores, payDebt, isLoading, isPaying } = useConductores();

  const conductoresConDeuda = conductores.filter(c => c.deuda > 0);

  const handlePagarDeuda = (conductor: ConductorResponse) => {
    if (window.confirm(`¿Confirmas que la deuda de ${conductor.nombre} (€${conductor.deuda}) ha sido saldada?`)) {
      // Ahora solo pasamos el ID del conductor, que es lo que la mutación espera.
      payDebt(conductor.idConductor);
    }
  };

  if (isLoading) {
    return <div className="p-4">Cargando deudas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Conductores con Deudas Pendientes</h1>

      {conductoresConDeuda.length === 0 ? (
        <p>No hay conductores con deudas pendientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Deuda</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductoresConDeuda.map((conductor) => (
                <tr key={conductor.idConductor} className="border-b">
                  <td className="py-2 px-4">{conductor.nombre}</td>
                  <td className="py-2 px-4 font-semibold text-red-600">
                    €{conductor.deuda.toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handlePagarDeuda(conductor)}
                      disabled={isPaying}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                    >
                      {isPaying ? 'Procesando...' : 'Saldar Deuda'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListaDeudas;