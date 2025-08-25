import { useState } from "react";
import { ListaServicios } from "./features/servicios/pages/ListaServicios";
import { ListaClientes } from "./features/clientes/pages/ListaClientes";
import { ListaConductores } from "./features/conductores/pages/ListaConductores";
import { ListaReservas } from "./features/reservas/pages/ListaReservas";
import { ListaDeudas } from "./features/conductores/pages/ListaDeudas";
import { ListaConductoresSinDeuda } from "./features/conductores/pages/ListaConductoresSinDeuda";
import { FiltroServiciosPorConductor } from "./features/servicios/pages/FiltroServiciosPorConductor";

type View =
  | "servicios"
  | "clientes"
  | "conductores"
  | "reservas"
  | "deudas"
  | "sinDeuda"
  | "serviciosFiltrados";

function App() {
  const [currentView, setCurrentView] = useState<View>("servicios");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => setCurrentView("servicios")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Servicios
            </button>
            <button
              onClick={() => setCurrentView("reservas")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Reservas
            </button>
            <button
              onClick={() => setCurrentView("clientes")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Clientes
            </button>
            <button
              onClick={() => setCurrentView("conductores")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Conductores
            </button>
            <button
              onClick={() => setCurrentView("deudas")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Deudas
            </button>
            <button
              onClick={() => setCurrentView("sinDeuda")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Sin Deuda
            </button>
            <button
              onClick={() => setCurrentView("serviciosFiltrados")}
              className="px-3 py-2 hover:bg-gray-100 rounded"
            >
              Servicios por Conductor
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-6">
        {currentView === "servicios" && <ListaServicios />}
        {currentView === "reservas" && <ListaReservas />}
        {currentView === "clientes" && <ListaClientes />}
        {currentView === "conductores" && <ListaConductores />}
        {currentView === "deudas" && <ListaDeudas />}
        {currentView === "sinDeuda" && <ListaConductoresSinDeuda />}
        {currentView === "serviciosFiltrados" && (
          <FiltroServiciosPorConductor />
        )}
      </div>
    </div>
  );
}

export default App;
